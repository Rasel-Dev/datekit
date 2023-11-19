export interface DateTimeOptions {
  locale?: string | string[];
  format?: string;
  timeZone?: string;
  offset?: string;
  calendar?: string;
}

// export interface DateConfig extends DateTimeOptions {
//   calendar: string;
//   numberingSystem: string;
//   year: string;
//   month: string;
//   day: string;
//   usage: string;
//   sensitivity: string;
//   ignorePunctuation: boolean;
//   collation: string;
//   numeric: boolean;
//   caseFirst: string;
// }

export type DateTimeInput = Date | string | number;

export type unitType =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';
