import DateTime from './utils/datetime';

const date = new DateTime('2023-11-18 03:56:16 AM', {
  // locale: 'bn',
  // timeZone: 'America/New_York',
});
// const date1 = date.clone('2023-11-15 01:00:00');
// console.log('New Format', date.format('YYYY-MM-DDTHH:mm:ssZ'));
// console.log(date.utc());
// console.log(date.tz());

// const manipulate = date.minus(2, 'month');

// console.log('Manipulate - ', manipulate.format());
// console.log('Manipulate - ', manipulate.status());
// date.status('hours');
// console.log('x - ', date.format('LLLL'));
// console.log('x - ', date.format('llll'));
// console.log('y - ', date1.format('YY-MM-DD hh:mm:ss A'));
// console.log('--------------------------------------------');
// console.log('x - ', date.iso());
console.log('fmt - ', date.format('lll'));
// console.log('iso - ', date.tz());
console.log('iso - ', date.iso());
console.log('now - ', date.now());
console.log('Add - now - ', date.plus(1, 'hour').now());
// console.log('local - ', date.local());
console.log('utc - ', date.utc());
// console.log('y - ', date1.utc());

// console.log('UTC - ', date.toUTC());
// console.log('y - ', date.minus(1, 'hour').format('YY-MM-DD hh:mm:ss'));
// console.log('x - ', date.status('long'));
// console.log('y - ', date.status('hours'));
// const cal1 = new DateTime('2024-06-28 16:48:00', {
//   timeZone: 'America/Los_Angeles',
// });

// console.log('--------------------------------------------');
// console.log('|     ', date.toUTC(), '      |');
// console.log('--------------------------------------------');
// console.log('|       ', date.toISO(), '         |');
// console.log('--------------------------------------------');

// const space = Array(10).fill(' ');
// console.log(space.join(''), 'Hello World');
// const example = new Date('2023-11-11 16:08:03');
// const { w, h } = extract(example);
// console.log('extract(example) :', extract(example));

// console.log(weekend(w, 'long'));
// console.log(customFormat(example).format);

// console.log(customFormat(calculateTime(example, 9, 'hour')).format);

// format('YY-MM-DD hh:mm:ss A');

//

// const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
// });

// const options = dateTimeFormat.resolvedOptions();

// const { locale, ...others } = options;

// const d = new Date().toLocaleString(options.locale, {
//   timeZone: 'America/Los_Angeles',
//   //   dateStyle: 'full', // Wednesday, November 8, 2023 [ but "Can't set option dayPeriod when dateStyle is used" ]
//   //   dayPeriod: 'short', // in the afternoon
//   day: 'numeric',
// });

// console.log(d);
