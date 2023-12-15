export interface DateKitOptions {
  locale?: string | string[]
  timeZone?: string
  offset?: string
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

export type StartOfType = 'year' | 'month' | 'week' | 'day'
