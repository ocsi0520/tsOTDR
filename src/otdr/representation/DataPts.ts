// TODO: need to re-check jsOTDR/lib/datapts.js to write reader

// depends on FxdParam, i.e. resolution
export type DataPts = {
  name: "DataPts";

  // see comment at DataPtsBlockParser: offset is always set to STV
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
  // most probably in case of multiple traces, this is the count of the current traces' data point
  // which allegedly never happens
  numberOfDataPointsInTrace: number;

  scalingFactor: {
    // 2 bytes (unsigned integer)
    raw: number;
    normalized: number; // = raw / 1000
  };

  // at least one, length = numberOfDataPointsInTrace
  traceValues: Array<number>; // 2 bytes unsigned int each

  calculatedBeforeOffset: {
    max: number;
    min: number;
  };

  // this is nlist, which is the mapped traceValues (dlist)
  // https://github.com/sid5432/jsOTDR/blob/master/lib/datapts.js#L135
  mappedTraceValues: Array<MappedTraceValue>;
};

export type MappedTraceValue = {
  nlistValue: number;
  whateverValue: number;
}

