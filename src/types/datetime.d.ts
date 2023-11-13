export interface DateTimeOptions {
  locale?: string;
  format?: string;
  timeZone?: string;
}

export interface DateConfig extends DateTimeOptions {
  calendar: string;
  numberingSystem: string;
  year: string;
  month: string;
  day: string;
  usage: string;
  sensitivity: string;
  ignorePunctuation: boolean;
  collation: string;
  numeric: boolean;
  caseFirst: string;
}

export type unitType =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';
