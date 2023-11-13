export interface IntlConfig extends Intl.DateTimeFormatOptions {
  locales?: string | string[];
}

export type MonthStyleType = 'long' | 'short' | 'numeric' | '2-digit';
export type WeekStyleType = 'long' | 'short';
export type FormatExtractorType =
  | 'year'
  | 'month'
  | 'weekday'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'meridiem';

export type FormatCalType =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

export type OpType = 'add' | 'sub';
export type RTFU = Intl.RelativeTimeFormatUnit;
export type RTFS = Intl.RelativeTimeFormatStyle;

interface IUnitObj {
  0: boolean;
  1: number;
}
type UnitObj = [boolean, number];
export type UnitObjType = Partial<Record<RTFU, IUnitObj & UnitObj>>;
