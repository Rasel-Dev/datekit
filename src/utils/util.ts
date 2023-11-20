import {
  FormatExtractorType,
  IntlConfig,
  OpType,
  RTFU,
  UnitObjType,
  UnitType,
} from '../types/util'
import {
  DEFAULT_FORMAT,
  FMT_REGX,
  L_FMT_REGX,
  MILLISECONDS_A_SECOND,
  SECONDS_A_MINUTE,
  availableTokens,
  invalid_token,
  localizedTokenString,
  manualPadOptions,
} from './constant'

const padStart = (n?: string) => String(n)?.padStart(2, '0')

const isLeapYear = (year: number) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

const daysInYear = (year: number) => {
  return isLeapYear(year) ? 366 : 365
}

const daysInMonth = (year: number, monthIdx: number) => {
  const leapDay = isLeapYear(year) ? 29 : 28
  return [31, leapDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIdx]
}

const weekStartDate = ($d: Date) => {
  const clone = new Date($d)
  const dayAt = clone.getDay()
  const diff = (dayAt + 6) % 7
  return new Date(clone.setDate(clone.getDate() - diff))
}

const extract = (date: Date) => {
  const $d = new Date(date)
  // Get the individual date and time components.
  const Y = $d.getFullYear()
  const M = $d.getMonth() + 1
  const D = $d.getDate()
  const w = $d.getDay()
  const h = $d.getHours()
  const m = $d.getMinutes()
  const s = $d.getSeconds()
  const ms = $d.getMilliseconds()
  return { $d, Y, M, D, w, h, m, s, ms }
}

const offset = ($d: Date) => {
  const tzOffset = $d.getTimezoneOffset()
  const tzPos = Math.abs(tzOffset)
  const hOffset = Math.floor(tzPos / 60)
  const mOffset = tzPos % 60
  const sign = tzOffset < 0 ? '+' : '-'
  const z = `${sign}${padStart(hOffset + '')}:${padStart(mOffset + '')}`
  // console.log('z :', z);
  const zz = `${sign}${padStart(hOffset + '')}${padStart(mOffset + '')}`
  // console.log('zz :', zz);
  return { z, zz, offset: tzOffset }
}

const extractUtc = (date: Date) => {
  const $d = new Date(date)
  const { z, zz } = offset($d)
  // console.log('offset($d) :', offset($d));
  // extract($d);
  // Get the individual date and time components of UTC.
  const Y = $d.getUTCFullYear()
  const M = $d.getUTCMonth() + 1
  const D = $d.getUTCDate()
  const W = $d.getUTCDay()
  const H = $d.getUTCHours()
  const m = $d.getUTCMinutes()
  const s = $d.getUTCSeconds()
  const ms = $d.getUTCMilliseconds()
  return { $d, Y, M, D, W, H, m, s, ms, z, zz }
}

const $f = ($d: Date, config?: IntlConfig) => {
  // console.log('config :', config);
  if (!config) return null
  const { locale, ...options } = config
  return new Intl.DateTimeFormat(locale, options).formatToParts($d)
}

const toIso = (d: Date) => {
  const { Y, M, D, h, m, s } = extract(d)
  // console.log('extract(d) :', extract(d));
  return `${Y}-${padStart(M + '')}-${padStart(D + '')}T${padStart(
    h + ''
  )}:${padStart(m + '')}:${padStart(s + '')}`
}

const customFormat = (d: Date, f = DEFAULT_FORMAT, config?: IntlConfig) => {
  // console.log(extractUtc(d));

  const format = f.trim()
  let output = format
  const formatTokens = format.match(FMT_REGX)!
  const localFormatTokens = format.match(L_FMT_REGX)
  // console.log('formatTokens :', formatTokens)
  const components: Intl.DateTimeFormatPart[] = []
  let opts: Record<string, string | FormatExtractorType> = {}

  if (formatTokens) {
    for (const token of formatTokens) {
      // console.log('token :', token)
      const availToken = availableTokens?.[token]
      const tokenRx = new RegExp(`${token[0]}+`, 'g')
      const invalidFormat = formatTokens.find((t) => tokenRx.test(t))
      if (!availToken || invalidFormat !== token) {
        const available = Object.keys(availableTokens).filter((t) =>
          t.match(tokenRx)
        )
        throw new Error(
          invalid_token.replace(
            /\[(.*?)\]/g,
            format.replace(token, `[${token}]`)
          ) + `. You can use ${available.join(' or ')}`
        )
      }

      // console.log('availToken :', availToken)
      // normal token
      if (availToken) {
        const cfg = availToken[0]
        const type = availToken[1] + ''
        output = output.replace(token, type)
        const part = typeof cfg === 'object' ? $f(d, { ...cfg, ...config }) : []
        // console.log('part :', token, part);
        const fp = part?.find((cycle) => cycle.type === type)
        // console.log('fp :', fp);
        if (part) components.push(...part)
        // console.log('part :', part);
        if (['A', 'a'].includes(token)) {
          const cp = components?.find((cycle) => cycle.type === type)
          // console.log('cp :', cp, type, components);
          const md = (token === 'a' ? cp?.value.toLowerCase() : cp?.value) || ''
          // console.log('md :', md);
          output = output.replace(/dayPeriod/g, md)
          opts[type] = md
          continue
        }
        const withPadValue = manualPadOptions.includes(token)
          ? padStart(fp?.value)
          : fp?.value
        output = output.replace(type, withPadValue || '')
        opts[type] = withPadValue + ''
      }
      // local token
      // if (locTokFor)
      //   output = output.replace(
      //     token,
      //     customFormat(d, locTokFor, config).format
      //   )
    }
  }

  if (localFormatTokens) {
    for (const token of localFormatTokens) {
      // console.log('token :', token)
      const locTokFor = localizedTokenString?.[token]
      const tokenRx = new RegExp(`${token[0]}+`, 'g')
      if (!locTokFor) {
        const available = Object.keys(localizedTokenString).filter((t) =>
          t.match(tokenRx)
        )
        throw new Error(
          invalid_token.replace(
            /\[(.*?)\]/g,
            format.replace(token, `[${token}]`)
          ) + `. You can use ${available.join(' or ')}`
        )
      }
      // local token
      if (locTokFor)
        output = output.replace(
          token,
          customFormat(d, locTokFor, config).format
        )
    }
  }

  return { extract: opts, format: output.trim() }
}

const calculateTime = (
  d: Date,
  item: number,
  partTo: UnitType,
  o: OpType = 'add'
) => {
  if (isNaN(item)) throw new Error('Item should be a number')

  const { $d, Y, M, D, w, h, m, s } = extract(d)

  switch (partTo) {
    case 'year':
      if (o === 'add') {
        $d.setFullYear(Y + item)
        return $d
      }
      $d.setFullYear(Y - item)
      return $d
    case 'month':
      if (o === 'add') {
        $d.setMonth(M + item)
        return $d
      }
      $d.setMonth(M - item)
      return $d
    case 'week':
      if (o === 'add') {
        $d.setDate(D + item * 7)
        return $d
      }
      $d.setDate(D - item * 7)
      return $d
    case 'day':
      if (o === 'add') {
        $d.setDate(D + item)
        return $d
      }
      $d.setDate(D - item)
      return $d
    case 'hour':
      if (o === 'add') {
        $d.setHours(h + item)
        return $d
      }
      $d.setHours(h - item)
      return $d
    case 'minute':
      if (o === 'add') {
        $d.setMinutes(m + item)
        return $d
      }
      $d.setMinutes(m - item)
      return $d
    case 'second':
      if (o === 'add') {
        $d.setSeconds(s + item)
        return $d
      }
      $d.setSeconds(s - item)
      return $d
    default:
      return $d
  }
}

const msStatus = (ms: number, d: Date): { value: number; unit: RTFU } => {
  const f = Math.floor,
    r = Math.round,
    a = Math.abs
  const isN = ms < 0
  const floor = isN ? f : r
  const round = isN ? r : f
  const seconds = a(ms) / MILLISECONDS_A_SECOND

  const minutes = floor(seconds / 60)
  const hours = round(minutes / 60)
  const days = floor(hours / 24)
  const weeks = floor(days / 7)
  const months = floor(days / daysInMonth(d.getFullYear(), d.getMonth()))
  const years = floor(months / 12)

  const obj: UnitObjType = {
    second: [seconds < 2, 1],
    seconds: [seconds < SECONDS_A_MINUTE, floor(seconds)],
    minute: [minutes === 1, 1],
    minutes: [minutes > 1 && minutes <= 60, isN ? minutes : minutes],
    hour: [hours === 1, 1],
    hours: [hours > 1 && hours < 24, isN ? hours : hours],
    day: [days === 1, 1],
    days: [days > 1 && days < 7, isN ? days : days],
    week: [weeks === 1, 1],
    weeks: [weeks > 1 && weeks <= 4, isN ? weeks : weeks],
    month: [months === 1, 1],
    months: [months > 1 && months < 12, isN ? months : months],
    // quarter: false,
    // quarters: false,
    year: [years === 1, 1],
    years: [years > 1, isN ? years : years],
  }

  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k]?.[0]) {
      return { value: !isN ? -obj[k]![1] : obj[k]![1], unit: k as RTFU }
    }
  }
  return { value: 0, unit: 'years' }
}

export default {
  offs: offset,
  ext: extract,
  extu: extractUtc,
  iso: toIso,
  fmt: customFormat,
  cal: calculateTime,
  status: msStatus,
  pad: padStart,
}
