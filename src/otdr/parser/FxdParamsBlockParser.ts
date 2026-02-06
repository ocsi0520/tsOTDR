import { speedOfLight } from "../../utility/physical-constants";
import {
  knownUnitsByRaw,
  traceTypesByRaw,
  type FxdParams,
  type TraceTypeAssociation,
  type UnitAssociation,
} from "../representation/FxdParams";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

type KeysBeforePulseEntries =
  | "name"
  | "date"
  | "unit"
  | "waveLength"
  | "acquisitionOffset"
  | "acquisitionOffsetDistance"
  | "numberOfPulseWidthEntries";

type RawPulseEntry = {
  pulseWidthInNanoSeconds: number;
  sampleSpacing: number;
  numberOfDataPoints: number;
};
export class FxdParamsBlockParser extends BlockParser {
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const fxdParamsBlockBeforePulseEntries: Pick<
      FxdParams,
      KeysBeforePulseEntries
    > = {
      name: this.readName(dataParsedSoFar, "FxdParams"),
      date: this.readDate(),
      unit: this.readUnit(),
      waveLength: this.readNormalizableUnsigned(2, 0.1, "inNanoMeter"),
      acquisitionOffset: this.reader.readSignedInt(4),
      acquisitionOffsetDistance:
        this.readAcquisitionOffsetDistance(dataParsedSoFar),
      numberOfPulseWidthEntries: this.reader.readUnsignedInt(2),
    };
    const pulseAndIOR = this.readPulseEntriesAndIndexOfRefraction(
      fxdParamsBlockBeforePulseEntries.numberOfPulseWidthEntries,
    );

    const fxdParamsBlock: FxdParams = {
      ...fxdParamsBlockBeforePulseEntries,
      ...pulseAndIOR,
      backscatteringCoefficient: this.readNormalizableUnsigned(
        2,
        -0.1,
        "inDecibel",
      ),
      numberOfAverages: this.reader.readUnsignedInt(4),
      averagingTime: this.readAverageInTime(dataParsedSoFar),
      range: this.readNormalizableUnsigned(4, 2e-5, "inKm"),
      acquisitionRangeDistance:
        this.getFormat(dataParsedSoFar) === 2
          ? this.reader.readSignedInt(4)
          : undefined,
      frontPanelOffset: this.reader.readSignedInt(4),
      noiseFloorLevel: this.reader.readUnsignedInt(2),
      noiseFloorScalingFactor: this.reader.readSignedInt(2),
      powerOffsetFirstPoint: this.reader.readUnsignedInt(2),
      lossThreshold: this.readNormalizableUnsigned(2, 0.001, "inDecibel"),
      reflectionThreshold: this.readNormalizableUnsigned(
        2,
        -0.001,
        "inDecibel",
      ),
      endOfTransmissionThreshold: this.readNormalizableUnsigned(
        2,
        0.001,
        "inDecibel",
      ),
      traceType: this.readTraceType(dataParsedSoFar),
      unknownRegionOrWindow: this.readUnknownRegionOrWindow(dataParsedSoFar),
    };

    return {
      ...dataParsedSoFar,
      fxdParamsBlock,
    };
  }
  private readUnknownRegionOrWindow(
    dataParsedSoFar: Partial<Representation>,
  ): FxdParams["unknownRegionOrWindow"] {
    if (this.getFormat(dataParsedSoFar) !== 2) return undefined;
    return {
      x1: this.reader.readSignedInt(4),
      y1: this.reader.readSignedInt(4),
      x2: this.reader.readSignedInt(4),
      y2: this.reader.readSignedInt(4),
    };
  }
  private readTraceType(
    dataParsedSoFar: Partial<Representation>,
  ): FxdParams["traceType"] {
    if (this.getFormat(dataParsedSoFar) !== 2) return undefined;
    const raw = this.reader.readFixedString(2) as TraceTypeAssociation["Raw"];
    return { raw, normalized: traceTypesByRaw[raw] };
  }

  private readAverageInTime(
    dataParsedSoFar: Partial<Representation>,
  ): FxdParams["averagingTime"] | undefined {
    if (this.getFormat(dataParsedSoFar) !== 2) return undefined;
    const raw = this.reader.readUnsignedInt(2);
    return { raw, inSeconds: raw * 0.1 };
  }

  // TODO: this could go to a separate unit
  private readPulseEntriesAndIndexOfRefraction(
    numberOfEntries: number,
  ): Pick<FxdParams, "pulseEntries" | "indexOfRefractionOfFiber"> {
    const rawEntries: Array<RawPulseEntry> = [];
    for (let i = 0; i < numberOfEntries; i++)
      rawEntries.push(this.readPulseEntry());

    const indexOfRefractionOfFiber: FxdParams["indexOfRefractionOfFiber"] =
      this.readNormalizableUnsigned(4, 1e-5, "normalized");

    const normalizedEntries: FxdParams["pulseEntries"] = rawEntries.map(
      (rawEntry) => {
        const microSeconds = rawEntry.sampleSpacing * 1e-8;
        const distanceInKm =
          (microSeconds * speedOfLight) / indexOfRefractionOfFiber.normalized;
        const range = distanceInKm * rawEntry.numberOfDataPoints;
        const resolution = distanceInKm * 1000;
        return {
          numberOfDataPoints: rawEntry.numberOfDataPoints,
          pulseWidthInNanoSeconds: rawEntry.pulseWidthInNanoSeconds,
          sampleSpacing: {
            raw: rawEntry.sampleSpacing,
            microSeconds,
            distanceInKm,
            range,
            resolution,
          },
        };
      },
    );
    return {
      pulseEntries: normalizedEntries,
      indexOfRefractionOfFiber,
    };
  }

  private readPulseEntry(): RawPulseEntry {
    return {
      pulseWidthInNanoSeconds: this.reader.readUnsignedInt(2),
      sampleSpacing: this.reader.readUnsignedInt(4),
      numberOfDataPoints: this.reader.readUnsignedInt(4),
    };
  }

  private readDate(): FxdParams["date"] {
    const secondsSinceEpoch = this.reader.readUnsignedInt(4);
    const normalized = new Date(0);
    normalized.setUTCSeconds(secondsSinceEpoch);
    return {
      secondsSinceEpoch,
      normalized,
    };
  }

  private readUnit(): FxdParams["unit"] {
    const raw = this.reader.readFixedString(2) as UnitAssociation["Raw"];
    return { raw, normalized: knownUnitsByRaw[raw] || "unknown" };
  }

  private readAcquisitionOffsetDistance(
    dataParsedSoFar: Partial<Representation>,
  ): FxdParams["acquisitionOffsetDistance"] {
    if (this.getFormat(dataParsedSoFar) !== 2) return undefined;
    return this.reader.readSignedInt(4);
  }
}
