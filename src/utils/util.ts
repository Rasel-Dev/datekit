import {
  FormatCalType,
  FormatExtractorType,
  IntlConfig,
  OpType,
  RTFU,
  UnitObjType,
} from '@/types/util';
import {
  MILLISECONDS_A_SECOND,
  RSC_REGX,
  SECONDS_A_DAY,
  SECONDS_A_HOUR,
  SECONDS_A_MINUTE,
  SECONDS_A_WEEK,
} from './constant';

export const padStart = (n: string) => n.padStart(2, '0');

export const isLeapYear = (year: number) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const daysInYear = (year: number) => {
  return isLeapYear(year) ? 366 : 365;
};

export const daysInMonth = (year: number, month: number) => {
  const leapDay = isLeapYear(year) ? 29 : 28;
  return [31, leapDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};

export const weekStartDate = ($d: Date) => {
  const clone = new Date($d);
  const dayAt = clone.getDay();
  const diff = (dayAt + 6) % 7;
  return new Date(clone.setDate(clone.getDate() - diff));
};

export const extract = (date: Date) => {
  // const formatter = new Intl.DateTimeFormat('en-US', {
  //   // year: 'numeric',
  //   hour: '2-digit',
  //   // minute: '2-digit',
  //   // hourCycle: 'h24',
  // });
  const $d = new Date(date);
  // console.log('$d :', $f($d, {}));
  // Get the individual date and time components.
  const Y = $d.getFullYear();
  const M = $d.getMonth();
  const D = $d.getDate();
  const w = $d.getDay();
  const h = $d.getHours();
  const m = $d.getMinutes();
  const s = $d.getSeconds();
  const ms = $d.getMilliseconds();
  const tzOffset = $d.getTimezoneOffset();
  return { $d, Y, M, D, w, h, m, s, ms, tzOffset };
};

const $f = ($d: Date, config?: IntlConfig) => {
  console.log('config :', config);
  if (!config) return null;
  const { locales, ...options } = config;
  return new Intl.DateTimeFormat(locales, options).format($d);
};

const availableTokens = {
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
  A: ['AA', 'meridiem'], // meridiem
  a: ['aa', 'meridiem'], // meridiem
};

const localizedTokenString = {
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

const manualPadOptions = ['mm', 'ss'];

export const customFormat = (
  d: Date,
  f = 'YYYY-MM-DD hh:mm:ss A',
  config?: IntlConfig
) => {
  const format = f.trim();
  const formatTokens = format.split(RSC_REGX).filter((fp) => !!fp);
  // console.log('formatTokens :', formatTokens);
  const prevFormat = format.replace(/A|a/g, 'AA');
  let output = '';
  let meridiem = '';
  let opts: Record<string, string | FormatExtractorType> = {};
  formatTokens.forEach((p) => {
    const availToken = availableTokens?.[p];
    const locTokFor = localizedTokenString?.[p];
    // console.log('availToken :', availToken);
    // normal token
    if (availToken) {
      const part = $f(d, { ...availToken[0], ...config });
      if (typeof availToken[0] === 'object' && part) {
        if (['hh', 'h'].includes(p)) meridiem = part.split(' ')[1];
        const othersWithHour = ['hh', 'h'].includes(p)
          ? part.split(' ')[0]
          : part;
        const withPadValue = manualPadOptions.includes(p)
          ? padStart(part)
          : othersWithHour;
        opts[availToken[1]] = withPadValue;
        output = (output || prevFormat).replace(p, withPadValue);
      } else {
        // meridiem
        if (['A', 'a'].includes(p)) {
          const md = p === 'a' ? meridiem?.toLowerCase() : meridiem;
          output = output.replace('AA', md);
          // console.log('output.replace(p, md) :', output.replace(p, md));
          opts[availToken[1]] = md;
        }
      }
    }
    // local token
    if (locTokFor) {
      output = (output || prevFormat).replace(
        p,
        customFormat(d, locTokFor, config).format
      );
    }
  });
  // console.log('opts :', opts);
  return { extract: opts, format: output.trim() };
};

export const isoString = (d: Date, locales: string) => {
  let configs: Record<string, string> = { timeZone: 'UTC', locales };
  const format = 'YY M D h m s';
  format.split(RSC_REGX).forEach((ft) => {
    const availConfig = availableTokens?.[ft];
    if (!!ft && typeof availConfig?.[0] === 'object') {
      configs = { ...configs, ...availConfig[0] };
    }
  });
  // console.log('configs :', configs);
  return $f(d, configs);
};

export const getIso = (d: Date) => {
  return d.toLocaleString('sv-SE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'UTC',
  });
};

export const calculateTime = (
  d: Date,
  item: number,
  partTo: FormatCalType,
  o: OpType = 'add'
) => {
  if (isNaN(item)) throw new Error('Item should be a number');

  const { $d, Y, M, D, w, h, m, s } = extract(d);

  switch (partTo) {
    case 'year':
      if (o === 'add') {
        $d.setFullYear(Y + item);
        return $d;
      }
      $d.setFullYear(Y - item);
      return $d;
    case 'month':
      if (o === 'add') {
        $d.setMonth(M + item);
        return $d;
      }
      $d.setMonth(M - item);
      return $d;
    case 'day':
      if (o === 'add') {
        $d.setDate(D + item);
        return $d;
      }
      $d.setDate(D - item);
      return $d;
    case 'hour':
      if (o === 'add') {
        $d.setHours(h + item);
        return $d;
      }
      $d.setHours(h - item);
      return $d;
    case 'minute':
      if (o === 'add') {
        $d.setMinutes(m + item);
        return $d;
      }
      $d.setMinutes(m - item);
      return $d;
    case 'second':
      if (o === 'add') {
        $d.setSeconds(s + item);
        return $d;
      }
      $d.setSeconds(s - item);
      return $d;
    default:
      return $d;
  }
};

export const msStatus = (ms: number): { value: number; unit: RTFU } => {
  const seconds = Math.abs(ms) / MILLISECONDS_A_SECOND;
  // console.log('seconds :--------------------------');
  // console.log('seconds :', ms);
  // console.log('seconds :--------------------------');
  const obj: UnitObjType = {
    second: [seconds < 2, 1],
    seconds: [seconds < SECONDS_A_MINUTE, seconds],
    minute: [seconds === SECONDS_A_MINUTE, 1],
    minutes: [
      seconds > SECONDS_A_MINUTE && seconds < SECONDS_A_HOUR,
      Math.floor(seconds / SECONDS_A_MINUTE),
    ],
    hour: [seconds === SECONDS_A_HOUR, 1],
    hours: [
      seconds > SECONDS_A_HOUR && seconds < SECONDS_A_DAY,
      Math.floor(seconds / SECONDS_A_HOUR),
    ],
    day: [seconds === SECONDS_A_DAY, 1],
    days: [
      seconds > SECONDS_A_DAY && seconds < SECONDS_A_WEEK,
      Math.floor(seconds / SECONDS_A_DAY),
    ],
    week: [seconds === SECONDS_A_WEEK, 1],
    weeks: [seconds > SECONDS_A_WEEK, Math.floor(seconds / SECONDS_A_WEEK)],
    // year: false,
    // month: false,
    // years: false,
    // quarter: false,
    // quarters: false,
    // months: false,
  };

  // console.log('obj :', obj);
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k]?.[0]) {
      return { value: ms < 0 ? -obj[k][1] : obj[k][1], unit: k as RTFU };
    }
  }
  return { value: 0, unit: 'year' };
};
