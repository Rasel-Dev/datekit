import { DateConfig, DateTimeOptions } from '@/types/datetime';
import { FormatCalType, RTFS } from '@/types/util';
import { calculateTime, customFormat, msStatus, toIso, toUtc } from './util';

export default class DateTime {
  private $d: Date;
  protected $l?: Date;
  private _config: Partial<DateConfig> = {};

  constructor(date?: Date | string | number, options?: DateTimeOptions) {
    if (date) this.$l = new Date();
    this.$d = this._create(date);
    //Config
    const dateConf = new Intl.DateTimeFormat().resolvedOptions();
    // console.log('dateConf :', dateConf);
    const colConf = Intl.Collator().resolvedOptions();
    //   const colConf1 = Intl.NumberFormat().resolvedOptions();
    const config = { ...dateConf, ...colConf, ...options };
    // console.log('config :', config);
    this._config = config as DateConfig;
  }

  protected _create(date?: Date | string | number): Date {
    if (date) {
      if (date instanceof Date) {
        return date;
      } else if (typeof date === 'string') {
        return new Date(date);
      } else if (typeof date === 'number') {
        return new Date(date);
      } else {
        throw new Error('Given date formate not support!');
      }
    } else {
      return new Date();
    }
  }

  /**
   * Clone the DateTime object
   * @param withDate Old or New Date object. Otherwise creating new DateTime object
   * @param withOptions DateTimeOptions
   * @returns The clone of the DateTime object
   */
  public clone(
    withDate?: Date | string | number,
    withOptions?: DateTimeOptions
  ): DateTime {
    return new DateTime(withDate, withOptions || this._config);
  }

  /**
   * It return String of the date Universal Coordinated Time or UTC format
   * @return String of UTC
   */
  public utc() {
    return toUtc(this.$d);
  }

  /**
   * It return String of the date International Organization for Standardization (ISO) format
   * @return String of ISO
   */
  public iso() {
    return toIso(this.$d);
  }

  /**
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   * @return number of milliseconds
   */
  public getTime() {
    return this.$d.getTime();
  }

  public now(f?: string) {
    return customFormat(this?.$d || this?.$l, f, {
      timeZone: this._config?.timeZone,
    }).format;
  }

  public local() {
    return new Date().toISOString();
  }

  public tz() {
    return this._config.timeZone;
  }

  public status(style: RTFS = 'long'): string {
    const target = (!!this?.$l && this.$d.getTime()) || 0;
    const local = this.$l?.getTime() || this.$d.getTime();
    const compareValue = local - target;
    const { value, unit } = msStatus(compareValue);

    const rtf = new Intl.RelativeTimeFormat(this._config.locale, {
      style,
    });

    return target === 0 || compareValue === 0 ? 'now' : rtf.format(value, unit);
  }
  /**
   * Manipulate the DateTime object
   * @param item Number of item[s] to addition
   * @param additionTo year, month, week, day, hour, minute, second
   * @returns new instance of DateTime object
   */
  public plus(item: number, additionTo: FormatCalType) {
    const mDate = calculateTime(this?.$d, item, additionTo);
    return new DateTime(mDate, this._config);
  }
  /**
   * Manipulate the DateTime object
   * @param item Number of item[s] to subtract
   * @param subtractTo year, month, week, day, hour, minute, second
   * @returns new instance of DateTime object
   */
  public minus(item: number, subtractTo: FormatCalType) {
    const mDate = calculateTime(this?.$d, item, subtractTo, 'sub');
    return new DateTime(mDate, this._config);
  }

  public format(f = 'YYYY-MM-DD hh:mm:ss A') {
    // console.log('this._config :', this._config);
    return customFormat(this?.$d || this?.$l, f, {
      locales: this._config.locale,
      timeZone: this._config.timeZone,
    }).format;
  }

  // public parse(f = 'YYYY-MM-DD hh:mm:ss A') {
  //   // console.log('this._config :', this._config);
  //   return customFormat(this?.$d || this?.$l, f, {
  //     locales: this._config.locale,
  //     timeZone: this._config.timeZone,
  //   }).format;
  // }
}
