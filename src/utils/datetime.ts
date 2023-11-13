import { DateConfig, DateTimeOptions } from '@/types/datetime';
import { FormatCalType, RTFS } from '@/types/util';
import { SPLITTER_REGX } from './constant';
import { calculateTime, customFormat, msStatus } from './util';

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

  //   public init(date?: Date | string | number) {
  //     if (date) {
  //       if (date instanceof Date) {
  //         this.$d = date;
  //       } else if (typeof date === 'string') {
  //         this.$d = new Date(date);
  //       } else if (typeof date === 'number') {
  //         this.$d = new Date(date);
  //       } else {
  //         throw new Error('Given date formate not support!');
  //       }
  //     } else {
  //       this.$d = new Date();
  //     }
  //     //Config
  //     const dateConf = Intl.DateTimeFormat().resolvedOptions();
  //     const colConf = Intl.Collator().resolvedOptions();
  //     //   const colConf1 = Intl.NumberFormat().resolvedOptions();
  //     const config = { ...dateConf, ...colConf };
  //     // console.log('config :', config);
  //     this._config = config as DateConfig;
  //   }

  // private getTZoffset(): number {
  //   return this.$d.getTimezoneOffset();
  // }

  public toUTC() {
    return this?._temp?.toUTCString() || this.$d.toUTCString();
  }

  public toISO() {
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');
    // console.log('Last Week       @@    ', this.$d.toUTCString());
    // console.log('Last Week       @@    ', weekStartDate(this.$d).toUTCString());
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');
    // console.log('``````````````````````````````````');

    // console.log(new Date(this.$d.valueOf()));
    // console.log(new Date(this.$d.valueOf() + MILLISECONDS_A_HOUR));

    return this?._temp?.toISOString() || this.$d.toISOString();
  }

  public getTime() {
    return this?._temp?.getTime() || this.$d.getTime();
  }

  public now(format?: string) {
    console.log('--------------------------------------------');
    console.log('| ', format?.split(SPLITTER_REGX), ' |');
    console.log('--------------------------------------------');
    // // console.log('timeZone :', this.timeZone());
    // // console.log(this.getTZoffset());
    // console.log(
    //   'locale',
    //   this.$d.toLocaleString('en-US', {
    //     timeZone: this._config.timeZone,
    //     // timeZoneName: 'shortOffset',
    //   })
    // );
    // // console.log('UTC :', this.getUtc());

    return this.$d.toUTCString();
  }

  public localTime() {
    return new Date().toUTCString();
  }

  public status(style: RTFS = 'long'): string {
    const target =
      this?._temp?.getTime() || (!!this?.$l && this.$d.getTime()) || 0;
    const local = this.$l?.getTime() || this.$d.getTime();

    const compareValue = local - target;
    // console.log('compareValue :', compareValue, target);
    const { value, unit } = msStatus(compareValue);
    // console.log('msStatus(compareValue); :', msStatus(compareValue));
    // const usage = this._config?.usage as
    //   | Intl.RelativeTimeFormatStyle
    //   | undefined;
    // console.log('usage :', usage);

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
    this._temp = undefined;
    return customFormat(this?._temp || this?.$d, f).format;
  }
}
