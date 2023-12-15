export interface IntlConfig extends Intl.DateTimeFormatOptions {
  locale?: string | string[]
}

export type MonthStyleType = 'long' | 'short' | 'numeric' | '2-digit'
export type WeekStyleType = 'long' | 'short'
export type FormatExtractorType =
  | 'year'
  | 'month'
  | 'weekday'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'meridiem'

export type UnitType =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'

type PropartyUnit =
  | 'millisecond'
  | 'year'
  | 'month'
  | 'weekday'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'

export type AdjustProtoOptions = {
  unit: PropartyUnit
  item?: number
  op?: OpType
  utc?: boolean
}

export type OpType = 'add' | 'sub'
export type RTFU = Intl.RelativeTimeFormatUnit
export type RTFS = Intl.RelativeTimeFormatStyle

interface IUnitObj {
  0: boolean
  1: number
}
type UnitObj = [boolean, number]
export type UnitObjType = Partial<Record<RTFU | string, IUnitObj & UnitObj>>
