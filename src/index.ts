import DateTime from './utils/datetime'
export default DateTime
// import { DateTimeInput, DateTimeOptions } from './types/datetime'
// import { RTFS, UnitType } from './types/util'
// import * as C from './utils/constant'
// import Util from './utils/util'

// export default class DateTime {
//   private $d: Date
//   protected $l?: Date
//   private _config: Partial<DateTimeOptions> = {}

//   constructor(date?: DateTimeInput, options?: DateTimeOptions) {
//     if (date) this.$l = new Date()
//     this.$d = this._create(date)
//     //Config
//     const { locale, calendar } = new Intl.DateTimeFormat().resolvedOptions()
//     const config = {
//       locale,
//       calendar,
//       ...options,
//       offset: Util.offs(this.$d).z,
//     }
//     // console.log('config :', config);
//     this._config = config as DateTimeOptions
//   }

//   protected _create(date?: DateTimeInput): Date {
//     if (date) {
//       if (date instanceof Date) {
//         return date
//       } else if (typeof date === 'string') {
//         return new Date(date)
//       } else if (typeof date === 'number') {
//         return new Date(date)
//       } else {
//         throw new Error('Given date formate not support!')
//       }
//     } else {
//       return new Date()
//     }
//   }

//   /**
//    * Get or set timezone. When you set timezone it will return new instance of DateTime object
//    * @param timeZone String of time zone
//    * @returns timezone string | new instance of DateTime class
//    */
//   public tz(timeZone?: string) {
//     if (!timeZone) return this._config?.timeZone || Util.offs(this?.$d).z
//     return new DateTime(this.$d, { ...this._config, timeZone })
//   }

//   /**
//    * Clone the DateTime object
//    * @param withDate Old or New Date object. Otherwise creating new DateTime object
//    * @param withOptions DateTimeOptions
//    * @returns The clone of the DateTime object
//    */
//   public clone(
//     withDate?: Date | string | number,
//     withOptions?: DateTimeOptions
//   ): DateTime {
//     return new DateTime(withDate, withOptions || this._config)
//   }

//   /**
//    * It return String of the date Universal Coordinated Time or UTC time
//    * @return String of UTC
//    */
//   public utc() {
//     return Util.fmt(this.$d, undefined, {
//       locale: this._config.locale,
//       timeZone: 'UTC',
//     }).format
//   }

//   /**
//    * It return String of the date International Organization for Standardization (ISO) time
//    * @return String of ISO
//    */
//   public iso() {
//     return Util.iso(this.$d)
//   }

//   /**
//    * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
//    * @return number of milliseconds
//    */
//   public getTime() {
//     return this.$d.getTime()
//   }
//   /**
//    * This method return current datetime in ISO format
//    */
//   public now() {
//     return Util.fmt(this?.$l || this?.$d, undefined, {
//       timeZone: this._config?.timeZone,
//     }).format
//   }

//   public status(style: RTFS = 'long'): string {
//     const target = (!!this?.$l && this.$d.getTime()) || 0
//     const local = this.$l?.getTime() || this.$d.getTime()
//     const compareValue = local - target
//     const { value, unit } = Util.status(compareValue, this?.$l || this?.$d)

//     const rtf = new Intl.RelativeTimeFormat(this._config.locale, {
//       style,
//     })

//     return target === 0 || compareValue === 0 ? 'now' : rtf.format(value, unit)
//   }

//   /**
//    * Manipulate the DateTime object
//    * @param item Number of item[s] to addition
//    * @param additionTo year, month, week, day, hour, minute, second
//    * @returns new instance of DateTime object
//    */
//   public plus(item: number, additionTo: UnitType) {
//     const mDate = Util.cal(this?.$d, item, additionTo)
//     return new DateTime(mDate, this._config)
//   }

//   /**
//    * Manipulate the DateTime object
//    * @param item Number of item[s] to subtract
//    * @param subtractTo year, month, week, day, hour, minute, second
//    * @returns new instance of DateTime object
//    */
//   public minus(item: number, subtractTo: UnitType) {
//     const mDate = Util.cal(this?.$d, item, subtractTo, 'sub')
//     return new DateTime(mDate, this._config)
//   }

//   public diff(item: DateTimeInput, unit?: UnitType, float = false) {
//     const that = new Date(item)
//     const thatTime = that.getTime()
//     const thisTime = this.getTime()
//     const millisecondsDiff = thatTime - thisTime

//     const monthsDiff = () =>
//       (that.getFullYear() - this.$d.getFullYear()) * 12 +
//       (that.getMonth() - this.$d.getMonth())

//     let res: number
//     switch (unit) {
//       case C.UNITS.y:
//         res = monthsDiff() / 12
//         break
//       // case UNITSq:
//       //   res = 0;
//       //   break;
//       case C.UNITS.M:
//         res = monthsDiff()
//         break
//       case C.UNITS.w:
//         res = millisecondsDiff / C.MILLISECONDS_A_WEEK
//         break
//       case C.UNITS.d:
//         res = millisecondsDiff / C.MILLISECONDS_A_DAY
//         break
//       case C.UNITS.h:
//         res = millisecondsDiff / C.MILLISECONDS_A_HOUR
//         break
//       case C.UNITS.m:
//         res = millisecondsDiff / C.MILLISECONDS_A_MINUTE
//         break
//       case C.UNITS.s:
//         res = millisecondsDiff / C.MILLISECONDS_A_SECOND
//         break
//       default:
//         res = millisecondsDiff
//         break
//     }

//     return !float ? Math.floor(res) : +res.toFixed(3)
//   }

//   public format(f?: string) {
//     return Util.fmt(this.$d, f, {
//       locale: this._config.locale,
//       timeZone: this._config.timeZone,
//     }).format
//   }

//   // public parse(f = 'YYYY-MM-DD hh:mm:ss A') {
//   //   // console.log('this._config :', this._config);
//   //   return customFormat(this?.$d || this?.$l, f, {
//   //     locales: this._config.locale,
//   //     timeZone: this._config.timeZone,
//   //   }).format;
//   // }
// }

// const tampus = new DateTime();

// console.log(`--------------------------------`);
// // console.log(`UTC Time: ${utcTimeString}`);
// console.log('UTC Time: ', tampus.utc());
// console.log(`--------------------------------`);
// console.log('NOW Time: ', tampus.now());
// console.log('Locl fmt: ', tampus.format());
// console.log('Locl iso: ', tampus.iso());
// console.log(`--------------------------------`);
// console.log('Locl dif: ', tampus.diff('2020-11-19 12:07:00', 'month', true));
// console.log(`--------------------------------`);
