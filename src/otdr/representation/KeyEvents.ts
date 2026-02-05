// from keyevents#63
// var factor = 1e-4 * parts.sol / parseFloat(results['FxdParams']['index']);

// time-of-travel - in units of 0.1 nanoseconds --> 0.001

// 0 - loss or gain in power; 1 - reflelction; 2 - "multiple event"
type EventPower = "0" | "1" | "2";

// represents/correlate w/ mode,  e - means end of the fiber, A - auto, rest are unknown
type Mode = "A" | "E" | "F" | "M" | "D";

export type KeyEvents = {
  name: "KeyEvents";

  // 2 bytes unsigned int
  numberOfEvents: number;

  events: Array<KeyEvent>;

  summary: KeyEventsSummary;
};

// altogether 42 bytes in v2
// everywhere precision is 3
export type KeyEvent = {
  // 2 bytes unsigned integer, starts from 1
  eventNumber: number;

  // 4 bytes unsigned int, in units of 0.1 nanoseconds
  timeOfTravel: number;

  // not in file
  // (distance in kilometers) = (integer value) * 10^-4 * c / (refractive index)
  calculatedDistance: number;

  slope: {
    // 2 bytes signed integer, multiplication 0.001
    raw: number;
    inDbPerKm: number;
  };

  spliceLoss: {
    // 2 bytes signed integer, multiplication 0.001
    raw: number;
    inDb: number;
  };

  reflectionLoss: {
    // 4 bytes signed integer, multiplication 0.001
    raw: number;
    inDb: number;
  };

  eventType: {
    // 8 characters, format: nx9999LS, TODO: check whether it has \0
    raw: `${EventPower}${Mode}${string}`;
    // TODO: check https://github.com/sid5432/jsOTDR/blob/master/lib/keyevents.js#L80
    normalized: string;
  };

  endOfPreviousEvent?: {
    // only v2
    // 4 unsigned bytes
    raw: number; // 0 in case of first
    inKm: number; // raw * factor
  };

  beginning?: {
    // only v2
    // 4 unsigned bytes
    raw: number;
    inKm: number; // raw * factor
  };

  end?: {
    // only v2
    // 4 unsigned bytes
    raw: number;
    inKm: number; // raw * factor
  };

  beginningOfNextEvent?: {
    // only v2
    // 4 unsigned bytes
    raw: number; // equals range if last event
    inKm: number; // raw * factor
  };

  peakPoint?: {
    // only v2
    // 4 unsigned bytes
    raw: number; // equals range if last event
    inKm: number; // raw * factor
  };
};

export type KeyEventsSummary = {
  totalLoss: {
    // 4 bytes signed integer
    raw: number; // 0.001 multiplier
    inDbPerKm: number; // assumption of the unit
  };

  fiberStartPosition: {
    // in code it is loss_start
    // 4 bytes signed integer
    raw: number; // factor multiplier
    inKm: number;
  };

  fiberLength: {
    // in code iti s loss_finish
    // 4 bytes unsigned integer
    raw: number; // factor multiplier
    inKm: number;
  };

  opticalReturnLoss: {
    // 2 bytes unsigned integer
    raw: number; // multipler time-of-travel - 0.001
    inDbPerKm: number; // assumption of the unit
  };

  opticalReturnLossStart: {
    // in code it is orl_start, allegedly duplicate of fiberStartPosition
    // 4 bytes signed integer
    raw: number; // factor multiplier
    inKm: number;
  };

  opticalReturnLossFinish: {
    // in code it is orl_finish, allegedly duplicate of fiberLength
    // 4 bytes unsigned integer
    raw: number; // factor multiplier
    inKm: number;
  };
};
