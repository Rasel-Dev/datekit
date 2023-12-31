import { DateKitInput, DateKitOptions, StartOfType } from '../../types/index'
import { RTFS, UnitType } from '../../types/util'
import {
  MILLISECONDS_A_DAY,
  MILLISECONDS_A_HOUR,
  MILLISECONDS_A_MINUTE,
  MILLISECONDS_A_SECOND,
  MILLISECONDS_A_WEEK,
  UNITS,
} from './constant'
import Util from './util'

export default class DateKit {
  private $d: Date
  protected $l?: Date
  private _config: Partial<DateKitOptions> = {}

  constructor(date?: DateKitInput, options?: DateKitOptions) {
    if (date) this.$l = new Date()
    this.$d = this._create(date)
    //Config
    const { locale } = new Intl.DateTimeFormat().resolvedOptions()
    const config = {
      locale,
      offset: Util.offs(this.$d).z,
    }
    this._config = !options
      ? config
      : ({ ...config, ...options } as DateKitOptions)
  }

  protected _create(date?: DateKitInput): Date {
    if (date) {
      if (date instanceof Date) {
        return date
      } else if (typeof date === 'string') {
        return new Date(date)
      } else if (typeof date === 'number') {
        return new Date(date)
      } else {
        throw new Error('Given datetime formate not support!')
      }
    } else {
      return new Date()
    }
  }

  /**
   * Get or set timezone. When you set timezone it will return new instance of DateKit object
   * @param timeZone String of time zone
   * @returns timezone string | new instance of DateKit class
   */
  public tz(timeZone?: string) {
    if (!timeZone) return this._config?.timeZone || Util.offs(this?.$d).z
    return new DateKit(this.$d, { ...this._config, timeZone })
  }

  /**
   * Clone the DateKit object
   * @param withDate Old or New Date object. Otherwise creating new DateKit object
   * @param withOptions DateKitOptions
   * @returns The clone of the DateKit object
   */
  public clone(
    withDate?: Date | string | number,
    withOptions?: DateKitOptions
  ): DateKit {
    return new DateKit(withDate, withOptions || this._config)
  }

  /**
   * It return String of the date Universal Coordinated Time or UTC time
   * @return String of UTC
   */
  public utc() {
    return Util.fmt(this.$d, 'YYYY-MM-DDTHH:mm:ssZ', {
      locale: this._config.locale,
      timeZone: 'UTC',
    }).format
  }

  /**
   * It return String of the date International Organization for Standardization (ISO) time
   * @return String of ISO
   */
  public iso() {
    return Util.iso(this.$d)
  }

  /**
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   * @return number of milliseconds
   */
  public getTime() {
    return this.$d.getTime()
  }

  /**
   * startOf
   */
  public startOf(unit: StartOfType, isStart?: boolean) {
    const isStartOf = isStart !== undefined ? isStart : true

    const calculateDate = (m = 0, d = 1) => {
      const t = isStartOf ? [0, 0, 0] : [23, 59, 59]
      const dt = new Date(this.$d.getFullYear(), m, d, ...t)
      return this.clone(dt)
    }

    switch (unit) {
      case UNITS.y:
        return isStartOf ? calculateDate() : calculateDate(11, 31)
      case UNITS.M:
        return isStartOf
          ? calculateDate(this.$d.getMonth())
          : calculateDate(this.$d.getMonth() + 1, 0)
      case UNITS.w: {
        const cloneDt = new Date(this.$d)
        // Get the day of the week (0 = Sunday, 6 = Saturday)
        const weekAt = cloneDt.getDay()
        const date = cloneDt.getDate()
        cloneDt.setDate(isStartOf ? date - weekAt : date + (6 - weekAt))

        return calculateDate(cloneDt.getMonth(), cloneDt.getDate())
      }
      case UNITS.d:
        return calculateDate(this.$d.getMonth(), this.$d.getDate())

      default:
        return this.clone()
    }
  }

  /**
   * endOf
   */
  public endOf(unit: StartOfType) {
    return this.startOf(unit, false)
  }

  /**
   * This method return current datetime in ISO format
   */
  public now() {
    return Util.fmt(this?.$l || this?.$d, undefined, {
      timeZone: this._config?.timeZone,
    }).format
  }

  /**
   * It returns status of your given initial datetime, Otherwise return now
   * @param style "long" | "short" | "narrow"
   * @returns [ E.g. hours ago or in hours ]
   */
  public status(style: RTFS = 'long'): string {
    const target = (!!this?.$l && this.$d.getTime()) || 0
    const local = this.$l?.getTime() || this.$d.getTime()
    const compareValue = local - target
    const { value, unit } = Util.status(compareValue, this?.$l || this?.$d)

    const rtf = new Intl.RelativeTimeFormat(this._config.locale, {
      style,
    })

    return target === 0 || compareValue === 0 ? 'now' : rtf.format(value, unit)
  }

  /**
   * Manipulate the DateKit object
   * @param item Number of item[s] to addition
   * @param additionTo year, month, week, day, hour, minute, second
   * @returns new instance of DateKit object
   */
  public plus(item: number, additionTo: UnitType) {
    const mDate = Util.cal(this.$d, item, additionTo)
    return new DateKit(mDate, this._config)
  }

  /**
   * Manipulate the DateKit object
   * @param item Number of item[s] to subtract
   * @param subtractTo year, month, week, day, hour, minute, second
   * @returns new instance of DateKit object
   */
  public minus(item: number, subtractTo: UnitType) {
    const mDate = Util.cal(this.$d, item, subtractTo, 'sub')
    return new DateKit(mDate, this._config)
  }

  /**
   * It returns difference between your DateKitInput(item) and local/previous datetimte
   * @param item DateKitInput -> Date | string | number
   * @param unit "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
   * @param float
   * @returns Based on unit. Otherwise number of milliseconds
   */
  public diff(item: DateKitInput, unit?: UnitType, float = false) {
    const that = new Date(item)
    const thatTime = that.getTime()
    const thisTime = this.getTime()
    const millisecondsDiff = thatTime - thisTime

    const monthsDiff = () =>
      (that.getFullYear() - this.$d.getFullYear()) * 12 +
      (that.getMonth() - this.$d.getMonth())

    let res: number
    switch (unit) {
      case UNITS.y:
        res = monthsDiff() / 12
        break
      // case UNITS.q:
      //   res = 0;
      //   break;
      case UNITS.M:
        res = monthsDiff()
        break
      case UNITS.w:
        res = millisecondsDiff / MILLISECONDS_A_WEEK
        break
      case UNITS.d:
        res = millisecondsDiff / MILLISECONDS_A_DAY
        break
      case UNITS.h:
        res = millisecondsDiff / MILLISECONDS_A_HOUR
        break
      case UNITS.m:
        res = millisecondsDiff / MILLISECONDS_A_MINUTE
        break
      case UNITS.s:
        res = millisecondsDiff / MILLISECONDS_A_SECOND
        break
      default:
        res = millisecondsDiff
        break
    }

    return !float ? Math.floor(res) : +res.toFixed(3)
  }

  /**
   * This method returns formatted string, you can customize formatting and play with datetime. Returns ISO formatted otherwise.
   * @param {string} f Format string
   * @returns string
   */
  public format(f?: string) {
    return Util.fmt(this.$d, f, {
      locale: this._config.locale,
      timeZone: this._config.timeZone,
    }).format
  }

  /**
   * This method returns format object, you can customize formatting and play with datetime. Returns ISO format object otherwise.
   * @param {string} f Format string
   * @returns string
   */
  public extract(f?: string) {
    return Util.fmt(this.$d, f, {
      locale: this._config.locale,
      timeZone: this._config.timeZone,
    }).extract
  }
}
