import { speedOfLight } from "../../utility/physical-constants";
import {
  eventModeByRaw,
  eventSubtypeByRaw,
  type EventModeAssociation,
  type EventSubtypeAssociation,
  type KeyEvent,
  type KeyEventBlock,
  type KeyEventsSummary,
  type RawEventType,
} from "../representation/KeyEvents";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

type KeysBeforeEvents = "name" | "numberOfEvents";

export class KeyEventsBlockParser extends BlockParser {
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const factor = this.getFactor(dataParsedSoFar);
    const keyEventParamsBeforeEvents: Pick<KeyEventBlock, KeysBeforeEvents> = {
      name: this.readName(dataParsedSoFar, "KeyEvents"),
      numberOfEvents: this.reader.readUnsignedInt(2),
    };
    const events = this.readEvents(
      keyEventParamsBeforeEvents.numberOfEvents,
      factor,
      this.getFormat(dataParsedSoFar) === 2,
    );

    const keyEventBlock: KeyEventBlock = {
      ...keyEventParamsBeforeEvents,
      events,
      summary: this.readSummary(factor),
    };

    return { ...dataParsedSoFar, keyEventBlock };
  }

  private readEvents(
    numberOfEvents: number,
    factor: number,
    isV2: boolean,
  ): KeyEventBlock["events"] {
    const events: Array<KeyEvent> = [];
    for (let i = 0; i < numberOfEvents; i++)
      events.push(this.readEvent(factor, isV2));
    return events;
  }

  private readEvent(factor: number, isV2: boolean): KeyEvent {
    return {
      eventNumber: this.reader.readUnsignedInt(2),
      timeOfTravel: this.readNormalizableUnsigned(
        4,
        factor,
        "calculatedDistance",
      ),
      slope: this.readNormalizableSigned(2, 0.001, "inDbPerKm"),
      spliceLoss: this.readNormalizableSigned(2, 0.001, "inDecibel"),
      reflectionLoss: this.readNormalizableSigned(4, 0.001, "inDecibel"),
      eventType: this.readEventType(),
      endOfPreviousEvent: isV2
        ? this.readNormalizableUnsigned(4, factor, "inKm")
        : undefined,
      beginning: isV2
        ? this.readNormalizableUnsigned(4, factor, "inKm")
        : undefined,
      end: isV2 ? this.readNormalizableUnsigned(4, factor, "inKm") : undefined,
      beginningOfNextEvent: isV2
        ? this.readNormalizableUnsigned(4, factor, "inKm")
        : undefined,
      peakPoint: isV2
        ? this.readNormalizableUnsigned(4, factor, "inKm")
        : undefined,
      comment: this.reader.readStringUntilNull(),
    };
  }

  private readEventType(): KeyEvent["eventType"] {
    const rawEventType = this.reader.readFixedString(8) as RawEventType;
    const subtype =
      eventSubtypeByRaw[rawEventType[0] as EventSubtypeAssociation["Raw"]] ||
      "unknown";
    const mode =
      eventModeByRaw[rawEventType[1] as EventModeAssociation["Raw"]] ||
      "unknown";
    return {
      raw: rawEventType,
      extraInfo: {
        subtype,
        mode,
      },
    };
  }

  private readSummary(factor: number): KeyEventsSummary {
    return {
      totalLoss: this.readNormalizableSigned(4, 0.001, "inDbPerKm"),
      fiberStartPosition: this.readNormalizableSigned(4, factor, "inKm"),
      fiberLength: this.readNormalizableUnsigned(4, factor, "inKm"),
      opticalReturnLoss: this.readNormalizableUnsigned(2, 0.001, "inDbPerKm"),
      opticalReturnLossStart: this.readNormalizableSigned(4, factor, "inKm"),
      opticalReturnLossFinish: this.readNormalizableUnsigned(4, factor, "inKm"),
    };
  }

  private getFactor(dataParsedSoFar: Partial<Representation>): number {
    if (!dataParsedSoFar.fxdParamsBlock)
      throw new Error(
        "Fixed Params should have been parsed by now (before KeyEventsBlock)",
      );
    return (
      (1e-4 * speedOfLight) /
      dataParsedSoFar.fxdParamsBlock.indexOfRefractionOfFiber.normalized
    );
  }
}
