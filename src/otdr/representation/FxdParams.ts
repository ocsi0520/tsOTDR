type Unit =
  | { raw: "mt"; normalized: "meters" }
  | { raw: "km"; normalized: "kilometers" }
  | { raw: "mi"; normalized: "miles" }
  | { raw: "kf"; normalized: "kilo-feet" }
  | { raw: string; normalized: "unknown"};

export type PulseEntry = {
  pulseWidthInNanoSeconds: number; // unsigned 2 bytes
  /**
   * 4 unsigned bytes, representing the time interval of the sample points
   * from the docs:
   * Sample spacing is an unsigned integer, representing the time interval of the sample points.
   * These are in units of 0.01 picoseconds (for example, a value of 2 means 0.02 picoseconds).
   * To convert it into meters, multiply the integer by 10-8 to become microseconds,
   * and then multiply by the speed-of-light,
   *
   */
  sampleSpacing: {
    raw: number;
    microSeconds: number;
    // TODO: meters and speed of light and other stuff
    // dx = microSeconds * speedOfLight / indexOfRefraction (in km)
    // range = dx * numberOfDataPoints
    // resolution = dx * 1000 (got in meters)
  };
  // unsigned 4 bytes, without any hussle
  numberOfDataPoints: number;
};

type TraceType =
| { raw: 'ST'; normalized: "standard trace"; }
| { raw: 'RT'; normalized: "reverse trace"; }
| { raw: 'DT'; normalized: "difference trace"; }
| { raw: 'RF'; normalized: "reference"; }

export type FxdParams = {
  name: "FxdParams";
  date: {
    secondsSinceEpoch: number; // 4 bytes unsigned
    normalized: Date;
  };
  unit: Unit; // 2 byte chars w/out \0

  waveLength: {
    // 10 times of wavelength in nanometers, but not every time...
    raw: number; // unit: nano-meter 2 unsigned bytes, 0.1 multiplier,  precision 1,
    inNanoMeter: number;
  };
  acquisitionOffset: number; // 4 signed bytes // dont know units
  acquisitionOffsetDistance?: number; // only v2, 4 signed bytes // dont know units
  /**
   * The number of pulse width entries determines the number of times that
   * the next three parameter (pulse-width, sample spacing, and number of data points)
   * are repeated. This corresponds to the number of traces in the data block
   * (described elsewhere)
   * 
   * usually 1
   */
  numberOfPulseWidthEntries: number; // unsigned 2 bytes
  pulseEntries: Array<PulseEntry>;  // length = numberOfPulseWidthEntries
  /**
   * The refractive index is represented as an unsigned integer that is 10^5 times
   * the value of the index of refraction (IOR).
   */
  indexOfRefractionOfFiber: {
    // 4 unsigned bytes
    // 1e-5 multiplier
    // precision 6? --- 6 tizedesjegyre kerekiti (string-ge valik)
    raw: number;
    normalized: number; 
  };
  backscatteringCoefficient: {
    // 2 unsigned bytes, -0.1 multiplier, precision is 2
    raw: number;
    inDecibel: number;
  }
  /**
   * I have failed to discover what determines the multiple.
   * I might be completely wrong in assuming that this the number of averages!
   */
  // unsigned 4 bytes
  numberOfAverages: number;
  averagingTime?: { // only in v2
    // unsigned 2 bytes, multiplier 0.1, 0 precision, unit: sec
    raw: number;
    inSeconds: number;
  }
  /**
   * Excerpt:
   * ...multiply by 2*10^-5. However, this is not quite right.
   * In some instances the numbers agree with the established (commercial) software programs;
   */
  range: {
    // 4 unsigned bytes, multiplier: 2e-5, prec: 6, unit: km
    raw: number;
    inKm: number;
  }


  // for the following 5 properties, we don't know the units and multipliers
  // 4 bytes signed integer
  acquisitionRangeDistance?: number; // only v2
  // 4 bytes signed integer
  frontPanelOffset: number;
  // unsigned 2 bytes
  noiseFloorLevel: number;
  // signed 2 bytes
  noiseFloorScalingFactor: number;
  // unsigned 2 bytes
  powerOffsetFirstPoint: number;

  lossThreshold: {
    // 2 bytes unsigned, 0.001 multiplier, 3 precision, unit: db
    raw: number;
    inDecibel: number;
  }
  reflectionThreshold: {
    // 2 bytes unsigned, -0.001 multiplier, 3 precision, unit: db
    raw: number;
    inDecibel: number;
  }
  endOfTransmissionThreshold: {
    // 2 bytes unsigned, 0.001 multiplier, 3 precision, unit: db
    raw: number;
    inDecibel: number;
  }

  traceType?: TraceType; // only v2

  unknownRegionOrWindow: {
    // al of them are signed 4 bytes
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
};
