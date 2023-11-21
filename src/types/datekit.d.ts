export interface DateKitOptions {
  locale?: string | string[]
  format?: string
  timeZone?: string
  offset?: string
  calendar?: string
}
export type DateKitInput = Date | string | number

export type unitType =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
