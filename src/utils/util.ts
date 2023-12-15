import {
  AdjustProtoOptions,
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
// AdjustPrototypeProparty
const adjustProto = (date: Date, options: AdjustProtoOptions) => {
  const { unit, utc, item, op } = options
  const $d = new Date(date)
  const proto = (set = false) => {
    const prefixPad = `${!set ? 'get' : 'set'}${utc ? 'UTC' : ''}`
    const proparty = {
      year: `${prefixPad}FullYear`,
      month: `${prefixPad}Month`,
      day: `${prefixPad}Date`,
      weekday: `${prefixPad}Day`,
      hour: `${prefixPad}Hours`,
      minute: `${prefixPad}Minutes`,
      second: `${prefixPad}Seconds`,
      millisecond: `${prefixPad}Milliseconds`,
    }[unit]
    return proparty
  }
  const p = proto()
  const clone = $d as unknown as Record<string, Function>
  if (!item) return clone[p]()

  const unitItem = clone[p]()
  clone[proto(true)](op === 'add' ? unitItem + item : unitItem - item)
  return clone
}

const offset = ($d: Date) => {
  const tzOffset = $d.getTimezoneOffset()
  const tzPos = Math.abs(tzOffset)
  const hOffset = Math.floor(tzPos / 60)
  const mOffset = tzPos % 60
  const sign = tzOffset < 0 ? '+' : '-'
  const z = `${sign}${padStart(hOffset + '')}:${padStart(mOffset + '')}`
  const zz = `${sign}${padStart(hOffset + '')}${padStart(mOffset + '')}`
  return { z, zz, offset: tzOffset }
}

const extract = (date: Date) => {
  const $d = new Date(date)
  // Get the individual date and time components.
  const Y = adjustProto($d, { unit: 'year' })
  const M = adjustProto($d, { unit: 'month' }) + 1
  const D = adjustProto($d, { unit: 'day' })
  const w = adjustProto($d, { unit: 'weekday' })
  const h = adjustProto($d, { unit: 'hour' })
  const m = adjustProto($d, { unit: 'minute' })
  const s = adjustProto($d, { unit: 'second' })
  const ms = adjustProto($d, { unit: 'millisecond' })
  return { $d, Y, M, D, w, h, m, s, ms }
}

// const extractUtc = (date: Date) => {
//   const $d = new Date(date)
//   const { z, zz } = offset($d)
//   // Get the individual date and time components of UTC.
//   const Y = adjustProto($d, { unit: 'year', utc: true })
//   const M = adjustProto($d, { unit: 'month', utc: true }) + 1
//   const D = adjustProto($d, { unit: 'date', utc: true })
//   const W = adjustProto($d, { unit: 'day', utc: true })
//   const H = adjustProto($d, { unit: 'hour', utc: true })
//   const m = adjustProto($d, { unit: 'minute', utc: true })
//   const s = adjustProto($d, { unit: 'second', utc: true })
//   const ms = adjustProto($d, { unit: 'millisecond', utc: true })
//   return { $d, Y, M, D, W, H, m, s, ms, z, zz }
// }

const $format = ($d: Date, config?: IntlConfig) => {
  if (!config) return null
  const { locale, ...options } = config
  return new Intl.DateTimeFormat(locale, options).formatToParts($d)
}

const toIso = (d: Date) => {
  const { Y, M, D, h, m, s } = extract(d)
  return `${Y}-${padStart(M + '')}-${padStart(D + '')}T${padStart(
    h + ''
  )}:${padStart(m + '')}:${padStart(s + '')}`
}

const customFormat = (d: Date, f = DEFAULT_FORMAT, config?: IntlConfig) => {
  const format = f.trim()
  let output = format
  const formatTokens = format.match(FMT_REGX)
  const localFormatTokens = format.match(L_FMT_REGX)
  let opts: Record<string, string | FormatExtractorType> = {}

  if (formatTokens) {
    const components: Record<string, string> = {}

    // Setup meridiem first
    const meridiem = formatTokens.find((token) => ['A', 'a'].includes(token))
    if (meridiem) {
      const conf = availableTokens?.[meridiem][0] as unknown as Object
      const part = $format(d, { ...conf, ...config })

      const fp = part?.find((cycle) => cycle.type === 'dayPeriod')

      const md =
        (meridiem === 'a'
          ? fp?.value?.toLowerCase()
          : fp?.value?.toUpperCase()) || ''
      output = output.replace(`${meridiem}`, md)
      opts.dayPeriod = md
      formatTokens.splice(
        formatTokens.findIndex((t) => t === meridiem),
        1
      )
    }

    for (const token of formatTokens) {
      const availToken = availableTokens?.[token]
      const tokenRx = new RegExp(`${token[0]}+`, 'g')
      const invalidFormat = formatTokens.find((t) => tokenRx.test(t)) !== token
      if (!availToken || invalidFormat) {
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

      // normal token
      if (availToken) {
        const cfg = availToken[0]
        const type = availToken[1] + ''
        output = output.replace(token, type)
        const part =
          typeof cfg === 'object'
            ? $format(d, !config ? cfg : { ...cfg, ...config })
            : []

        const fp = part?.find((cycle) => cycle.type === type)

        if (part && fp?.type) components[fp.type] = fp?.value

        const withPadValue = manualPadOptions.includes(token)
          ? padStart(fp?.value)
          : fp?.value
        output = output.replace(type, withPadValue || '')
        opts[type] = withPadValue + ''
      }
    }
  }

  if (localFormatTokens) {
    for (const token of localFormatTokens) {
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

  return {
    extract: opts,
    format: output.trim(),
  }
}

const calculateTime = (
  d: Date,
  item: number,
  partTo: UnitType,
  o: OpType = 'add'
) => {
  if (isNaN(item)) throw new Error('Item should be a number')

  switch (partTo) {
    case 'year':
      return adjustProto(d, { unit: 'year', item, op: o })
    case 'month':
      return adjustProto(d, { unit: 'month', item, op: o })
    case 'week':
      return adjustProto(d, { unit: 'day', item: item * 7, op: o })
    case 'day':
      return adjustProto(d, { unit: 'day', item, op: o })
    case 'hour':
      return adjustProto(d, { unit: 'hour', item, op: o })
    case 'minute':
      return adjustProto(d, { unit: 'minute', item, op: o })
    case 'second':
      return adjustProto(d, { unit: 'second', item, op: o })
    default:
      return d
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
  // extu: extractUtc,
  iso: toIso,
  fmt: customFormat,
  cal: calculateTime,
  status: msStatus,
  pad: padStart,
}
