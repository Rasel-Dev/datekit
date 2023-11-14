import { DateConfig, DateTimeOptions } from '@/types/datetime';
import { FormatCalType, RTFS } from '@/types/util';
import { calculateTime, customFormat, getIso, msStatus } from './util';

export default class DateTime {
  private $d: Date;
  protected $l?: Date;
  protected _temp?: Date;
  private _config: Partial<DateConfig> = {};

  constructor(date?: Date | string | number, options?: DateTimeOptions) {
    // if (date) {
    //   if (date instanceof Date) {
    //     this.$d = date;
    //   } else if (typeof date === 'string') {
    //     this.$d = new Date(date);
    //   } else if (typeof date === 'number') {
    //     this.$d = new Date(date);
    //   } else {
    //     throw new Error('Given date formate not support!');
    //   }
    // } else {
    //   this.$d = new Date();
    // }
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

  protected _updateState(): Date | undefined {
    const state = this?._temp;
    if (state) this._temp = undefined;
    return state;
  }

  /**
   * Clone the DateTime object
   * @param withDate Old or New Date object. Otherwise creating new Date object
   * @param withOptions DateTimeOptions
   * @returns The clone of the DateTime object
   */
  public clone(
    withDate?: Date | string | number,
    withOptions?: DateTimeOptions
  ): DateTime {
    return new DateTime(withDate, withOptions);
  }

  // private getTZoffset(): number {
  //   return this.$d.getTimezoneOffset();
  // }
  /**
   * It return String of the date Universal Coordinated Time or UTC format
   * @return String of UTC
   */
  public toUTC() {
    return this?._updateState()?.toISOString() || this.$d.toISOString();
  }

  /**
   * It return String of the date International Organization for Standardization (ISO) format
   * @return String of ISO
   */
  public toISO() {
    return getIso(this?._updateState() || this.$d);
  }
  /**
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   * @return number of milliseconds
   */
  public getTime() {
    return this?._updateState()?.getTime() || this.$d.getTime();
  }

  public now(f?: string) {
    return customFormat(this?._updateState() || this?.$d || this?.$l, f, {
      timeZone: this._config.timeZone,
    }).format;
  }

  public localTime() {
    return new Date().toUTCString();
  }

  public status(style: RTFS = 'long'): string {
    const target =
      this?._updateState()?.getTime() || (!!this?.$l && this.$d.getTime()) || 0;
    const local = this.$l?.getTime() || this.$d.getTime();
    const compareValue = local - target;
    const { value, unit } = msStatus(compareValue);

    const rTimeFormate = new Intl.RelativeTimeFormat(this._config.locale, {
      style,
    });

    return target === 0 || compareValue === 0
      ? 'now'
      : rTimeFormate.format(value, unit);
  }

  public plus(item: number, additionTo: FormatCalType) {
    this._temp = calculateTime(this?.$d, item, additionTo);
    return this;
  }

  public minus(item: number, subtractTo: FormatCalType) {
    this._temp = calculateTime(this?.$d, item, subtractTo, 'sub');
    return this;
  }

  public format(f = 'YYYY-MM-DD hh:mm:ss A') {
    // console.log('this._config.timeZone :', this._config.timeZone);
    return customFormat(this?._updateState() || this?.$d || this?.$l, f, {
      timeZone: this._config.timeZone,
    }).format;
  }
}
