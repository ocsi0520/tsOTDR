import type { DataPts, TraceDatum } from "../representation/DataPts";
import type { FxdParams } from "../representation/FxdParams";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

// __COMMENT__ look at https://github.com/sid5432/jsOTDR/blob/master/lib/datapts.js#L134
// since xref['_datapts_params']['offset'] is never read from the file, rather hard-coded, its value is always 'STV'
// so I skip the if-else stuff at line 134

export class DataPtsBlockParser extends BlockParser {
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const fxdParamsBlock = dataParsedSoFar.fxdParamsBlock;
    if (!fxdParamsBlock)
      throw new Error(
        "FxdParamsBlock should have been parsed by now (from DataPtsBlockParser)",
      );

    const scaling = this.getScaling(dataParsedSoFar);
    const dataPtsBlockWithoutTraceData: Omit<DataPts, "traceData"> = {
      name: this.readName(dataParsedSoFar, "DataPts"),
      calculated: {
        offset: "STV",
        scaling,
      },
      numberOfDataPoints: this.readNumberOfDataPoints(fxdParamsBlock),
      numberOfTraces: this.readNumberOfTraces(fxdParamsBlock),
    };

    const dataPtsBlock: DataPts = {
      ...dataPtsBlockWithoutTraceData,
      traceData: this.readTraceData(
        fxdParamsBlock,
        dataPtsBlockWithoutTraceData,
      ),
    };

    return { ...dataParsedSoFar, dataPtsBlock };
  }

  private getScaling(dataParsedSoFar: Partial<Representation>): number {
    if (!dataParsedSoFar.supParamsBlock)
      throw new Error(
        "SupParamsBlock should have been parsed by now (from DataPtsBlockParser)",
      );
    return dataParsedSoFar.supParamsBlock.module.name === "OFL250" ? 0.1 : 1;
  }

  private readNumberOfDataPoints(fxdParamsBlock: FxdParams): number {
    const numberOfDataPoints = this.reader.readUnsignedInt(4);
    const numberOfDataPointsFromFxdarams = fxdParamsBlock.pulseEntries
      .map((entry) => entry.numberOfDataPoints)
      .reduce((a, b) => a + b, 0);

    if (numberOfDataPoints !== numberOfDataPointsFromFxdarams)
      throw new Error(
        "there's some hiccups between FxdParams and DataPts regarding the number of data points",
      );
    return numberOfDataPoints;
  }

  private readNumberOfTraces(fxdParamsBlock: FxdParams): number {
    // for whatever reason numberOfPulseWidthEntries is unsigned, meanwhile traces are signed? o.O
    // so I rather read again unsigned int
    // https://github.com/sid5432/jsOTDR/blob/master/lib/fxdparams.js#L62C51-L62C54 // 'v' means 'value' - which is unsigned int
    // https://github.com/sid5432/jsOTDR/blob/master/lib/datapts.js#L83

    const numberOfTraces = this.reader.readUnsignedInt(2);
    if (fxdParamsBlock.numberOfPulseWidthEntries !== numberOfTraces)
      throw new Error(
        "there's some hiccups between FxdParams and DataPts regarding the number of traces / pulse with entries",
      );

    return numberOfTraces;
  }

  private readTraceData(
    fxdParamsBlock: FxdParams,
    dataPtsBlockWithoutTraceData: Omit<DataPts, "traceData">,
  ): DataPts["traceData"] {
    const traceData: DataPts["traceData"] = [];
    for (let i = 0; i < dataPtsBlockWithoutTraceData.numberOfTraces; i++) {
      const resolutionForCurrentTrace =
        fxdParamsBlock.pulseEntries[i].sampleSpacing.resolution;
      traceData.push(
        this.readTraceDatum(
          dataPtsBlockWithoutTraceData.calculated.scaling,
          resolutionForCurrentTrace,
        ),
      );
    }
    return traceData;
  }

  private readTraceDatum(
    calculatedScaling: number,
    resolutionForCurrentTrace: number,
  ): TraceDatum {
    const numberOfDataPointsInTrace = this.reader.readUnsignedInt(4);
    const scalingFactor: TraceDatum["scalingFactor"] =
      this.readNormalizableUnsigned(2, 0.001, "normalized");
    const rawTraceValues: Array<number> = [];
    for (let i = 0; i < numberOfDataPointsInTrace; i++)
      rawTraceValues.push(this.reader.readUnsignedInt(2));

    const maxElement = Math.max(...rawTraceValues);
    const minElement = Math.min(...rawTraceValues);

    const whateverUltraScalingFactor = scalingFactor.normalized * 0.001;
    const calculatedBeforeOffset: TraceDatum["calculatedBeforeOffset"] = {
      max: maxElement * whateverUltraScalingFactor,
      min: minElement * whateverUltraScalingFactor,
    };

    const mappedTraceValues: TraceDatum["mappedTraceValues"] =
      rawTraceValues.map((item, index) => {
        return {
          nlistValue: (maxElement - item) * whateverUltraScalingFactor,
          whateverValue:
            (resolutionForCurrentTrace * index * calculatedScaling) / 1000, // (in km)
        };
      });

    return {
      numberOfDataPointsInTrace,
      scalingFactor,
      traceValues: rawTraceValues,
      calculatedBeforeOffset,
      mappedTraceValues,
    };
  }
}
