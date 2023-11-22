# DateKit

A simple and small datetime library. Those who want to do small tasks with time can easily use this library. It uses JavaScript's built-in functions. There are no third party modules.

## Features

- Get time - Current datetime, ISO, UTC
- Manipulate - Add or Subtract datetime
- Status - Status of the time you given
- Formatting datetime

## Table of Contents

- [Introduction](https://github.com/Rasel-Dev/dt-parse#introduction)
- [Installation](https://github.com/Rasel-Dev/dt-parse#installation)
- [Usage](https://github.com/Rasel-Dev/dt-parse#usage)
  - [Get Date & Time](https://github.com/Rasel-Dev/dt-parse#get-date--time)
  - [Formatting Date & Time](https://github.com/Rasel-Dev/dt-parse#formatting-date--time)
  - [Manipulate Date & Time](https://github.com/Rasel-Dev/dt-parse#manipulate-date--time)
  - [Set TimeZone](https://github.com/Rasel-Dev/dt-parse#set-timezone)
  - [Format Strings](https://github.com/Rasel-Dev/dt-parse#format-strings)

## Introduction

DateKit is a lightweight and easy-to-use JavaScript library designed to simplify date and time operations. Whether you need to manipulate dates, obtain the current date and time, or customize the datetime format, DateKit has got you covered.

## Installation

To use DateKit in your project, you can include it via a script tag or install it using npm:

### Script Tag

```
<script src="path/to/datekit.js"></script>
```

### NPM

```
npm install datekit
```

## Usage

### Get Date & Time

```
// Get current timestemps in milliseconds.
datekit.getTime() // [ e.g. 1700454900000 ] in milliseconds

// Get current date & time
datekit.now() // [ e.g. 2023-11-22T17:53:01 ]
```

ISO & UTC

```
// Get local date & time.
datekit.iso() // [ e.g. 2023-11-20T10:35:00 ]

// Get UTC date & time
datekit.utc() // [ e.g. 2023-11-20T04:35:00.000Z ]
```

### Formatting Date & Time

You can customise your date & time like `'YYYY-MM-DD HH:mm:ssA'` see [more format strings](https://github.com/Rasel-Dev/dt-parse#format-strings)

```
datekit.format('YYYY-MM-DD HH:mm:ssA') // [ e.g. 2023-11-20 10:35:00PM ]

datekit.format('YYYY-MM-DD') // [ e.g. 2023-11-20 ]

datekit.format('HH:mm:ss A') // [ e.g. 10:35:00 PM ]

// locals

datekit.format('LTS') // [ e.g. 10:35:00 PM ]

datekit.format('LL') // [ e.g. November 20, 2023 ]
```

### Manipulate Date & Time

Addition date & time :

```
const date = datekit.plus(5, 'minute')
date.iso() // return datetime with extra 5 minutes
```

Subtraction date & time :

```
const date = datekit.minus(5, 'minute')
date.iso() // return datetime with less 5 minutes
```

Addition & Subtraction together :

```
const date = datekit.plus(15, 'minute').minus(5, 'minute')
date.iso() // return datetime with extra 10 minutes
```

### Set TimeZone

```
const dateTz = datekit.tz('Asia/Dhaka')

dateTz.now() // get current date & time based on TimeZone

// or

datekit.tz('Asia/Dhaka').now() // get current date & time based on TimeZone

```

### Format Strings

Available format strings

> Date formats

| Formats | Returns  | Results       |
| ------- | :------: | ------------- |
| YYYY    |   2023   | full year     |
| YY      |    23    | 2 digit year  |
| MMMM    | November | month long    |
| MMM     |   Nov    | month short   |
| MM      |    11    | 2 digit month |
| M       |    11    | month number  |
| DDDD    |  Sunday  | weekday long  |
| DDD     |   Sun    | weekday short |
| DD      |    05    | 2 digit day   |
| D       |    5     | day number    |

> Time formats

| Formats | Returns | Results        |
| ------- | :-----: | -------------- |
| HH      |   03    | 2 digit hour   |
| hh      |    3    | hour number    |
| mm      |   09    | 2 digit minute |
| m       |    9    | minute number  |
| ss      |   08    | 2 digit second |
| s       |    8    | second number  |
| a       |  AM/PM  | Meridiem       |
| A       |  AM/PM  | Meridiem       |

> Local formats

| Local | Format string             |
| ----- | ------------------------- |
| LT    | h:mm A                    |
| LTS   | h:mm:ss A                 |
| LLLL  | DDDD, MMMM D, YYYY h:mm A |
| LLL   | MMMM D, YYYY h:mm A       |
| LL    | MMMM D, YYYY              |
| L     | MM/DD/YYYY                |
| llll  | DDD, MMM D, YYYY h:mm A   |
| lll   | MMM D, YYYY h:mm A        |
| ll    | MMM D, YYYY               |
| l     | M/D/YYYY                  |
