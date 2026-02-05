// TODO: need to re-check jsOTDR/lib/datapts.js to write reader

// depends on FxdParam, i.e. resolution
export type DataPts = {
  name: "DataPts";

  // extra parameters ????
  // method used by STV: minimum reading shifted to zero
  // method used by AFL/Noyes Trace.Net: maximum reading shifted to zero (approx)

  calculated: {
    // internal usage
    scaling: number;
    offset: string;
  };

  // 4 bytes unsigned int
  // same as number of data points in FxdParams block
  numberOfDataPoints: number;

  // 2 bytes signed integer
  // same as number of pulse width entries in the FxdParams block
  numberOfTraces: number;

  traceData: Array<TraceDatum>;
};

export type TraceDatum = {
  // 4 bytes unsigned int
  // same as number of data points in FxdParams block
  repeatOfNumberOfDataPoints: number;

  scalingFactor: {
    // 2 bytes (unsigned integer)
    raw: number;
    normalized: number; // = raw / 1000
  };

  // at least one, length = numberOfDataPoints or repeatOfNumberOfDataPoints
  traceValues: Array<TraceValue>;

  calculatedBeforeOffset: {
    max: number;
    min: number;
  };

  // TODO: check tracedata (in jsOTDR), as it is modified:
  // added calculated data based on nlist
  // nlist is calculated from traceData (the property here) and offset
};

export type TraceValue = {
  // 2 bytes unsigned int
  value: number;
};
