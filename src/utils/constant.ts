export const SECONDS_A_MINUTE = 60;
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24;
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7;

export const MILLISECONDS_A_SECOND = 1e3;
export const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
export const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
export const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
export const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;

export const RSC_REGX = /[-_/\s,.TZ:]/g;

export const invalid_token = 'Invalid Format [t]';

export const DEFAULT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

export const availableTokens = {
  YYYY: [{ year: 'numeric' }, 'year'],
  YY: [{ year: '2-digit' }, 'year'],
  MMMM: [{ month: 'long' }, 'month'],
  MMM: [{ month: 'short' }, 'month'],
  MM: [{ month: '2-digit' }, 'month'],
  M: [{ month: 'numeric' }, 'month'],
  DDDD: [{ weekday: 'long' }, 'weekday'],
  DDD: [{ weekday: 'short' }, 'weekday'],
  DD: [{ day: '2-digit' }, 'day'],
  D: [{ day: 'numeric' }, 'day'],
  HH: [{ hour: '2-digit', hour12: false }, 'hour'],
  hh: [{ hour: '2-digit', hour12: true }, 'hour'],
  h: [{ hour: 'numeric' }, 'hour'],
  mm: [{ minute: '2-digit' }, 'minute'],
  m: [{ minute: 'numeric' }, 'minute'],
  ss: [{ second: '2-digit' }, 'second'],
  s: [{ second: 'numeric' }, 'second'],
  A: ['AMPM', 'dayPeriod'], // meridiem
  a: ['ampm', 'dayPeriod'], // meridiem
};

export const localizedTokenString = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'DDDD, MMMM D, YYYY h:mm A',
  l: 'M/D/YYYY',
  ll: 'MMM D, YYYY',
  lll: 'MMM D, YYYY h:mm A',
  llll: 'DDD, MMM D, YYYY h:mm A',
};

export const manualPadOptions = ['mm', 'ss'];

export const UNITS = {
  y: 'year',
  q: 'quarter',
  M: 'month',
  w: 'week',
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
};
