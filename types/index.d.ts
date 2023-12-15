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

export = datekit

declare function datekit(date?: DateKitInput): datekit.DateKit

declare function datekit(
  date?: DateKitInput,
  options?: DateKitOptions
): datekit.DateKit

declare namespace datekit {
  class DateKit {
    constructor(date?: DateKitInput, options?: DateKitOptions): void

    /**
     * Get or set timezone. When you set timezone it will return new instance of DateKit object
     * @param timeZone String of time zone
     * @returns timezone string | new instance of DateKit class
     */
    tz(timeZone?: string): DateKit

    /**
     * Clone the DateKit object
     * @param withDate Old or New Date object. Otherwise creating new DateKit object
     * @param withOptions DateKitOptions
     * @returns The clone of the DateKit object
     */
    clone(withDate?: DateKitInput, withOptions?: DateKitOptions): DateKit

    /**
     * It return String of the date Universal Coordinated Time or UTC time
     * @return String of UTC
     */
    utc(): string

    /**
     * It return String of the date International Organization for Standardization (ISO) time
     * @return String of ISO
     */
    iso(): string

    /**
     * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
     * @return number of milliseconds
     */
    getTime(): number

    /**
     * startOf
     */
    startOf(unit: StartOfType, isStart?: boolean): DateKit

    /**
     * endOf
     */
    endOf(unit: StartOfType): DateKit

    /**
     * This method return current datetime in ISO format
     */
    now(): string

    /**
     * It returns status of your given initial datetime, Otherwise return now
     * @param style "long" | "short" | "narrow"
     * @returns [ E.g. hours ago or in hours ]
     */
    status(style: RTFS = 'long'): string

    /**
     * Manipulate the DateKit object
     * @param item Number of item[s] to addition
     * @param additionTo year, month, week, day, hour, minute, second
     * @returns new instance of DateKit object
     */
    plus(item: number, additionTo: UnitType): DateKit

    /**
     * Manipulate the DateKit object
     * @param item Number of item[s] to subtract
     * @param subtractTo year, month, week, day, hour, minute, second
     * @returns new instance of DateKit object
     */
    minus(item: number, subtractTo: UnitType): DateKit

    /**
     * It returns difference between your DateKitInput(item) and local/previous datetimte
     * @param item DateKitInput -> Date | string | number
     * @param unit "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
     * @param float
     * @returns Based on unit. Otherwise number of milliseconds
     */
    diff(item: DateKitInput, unit?: UnitType, float = false): number

    /**
     * This method returns formatted string, you can customize formatting and play with datetime. Returns ISO formatted otherwise.
     * @param {string} f Format string
     * @returns string
     */
    format(f?: string): string

    /**
     * This method returns format object, you can customize formatting and play with datetime. Returns ISO format object otherwise.
     * @param {string} f Format string
     * @returns string
     */
    extract(f?: string): Record<string, string>
  }
}
