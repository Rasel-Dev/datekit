import datekit from '../src/index'
import DateKit from '../src/utils/datekit'

describe('Type Check', () => {
  it('should return the current time in milliseconds', () => {
    expect(typeof datekit().getTime()).toBe('number')
  })
  it('should return the current local time string', () => {
    expect(typeof datekit().now()).toBe('string')
  })
  it('should return the current UTC time string', () => {
    expect(typeof datekit().utc()).toBe('string')
  })
  it('should return the UTC [ 2023-11-20T04:35:00.000Z ] to local ISO format', () => {
    const clone = datekit().clone('2023-11-20T04:35:00.000Z')
    expect(clone.iso()).toBe('2023-11-20T10:35:00')
  })
})

describe('Instance Check', () => {
  it('Clone should return new isntance', () => {
    const clone = datekit().clone()
    expect(clone).toBeInstanceOf(DateKit)
  })
  it('Manipulation should return new isntance', () => {
    const plus = datekit().plus(2, 'minute')
    const minus = datekit().minus(2, 'minute')
    expect(plus).toBeInstanceOf(DateKit)
    expect(minus).toBeInstanceOf(DateKit)
  })
  it('Set TimeZone should return new isntance', () => {
    const tz = datekit().tz('Asia/Dhaka')
    expect(tz).toBeInstanceOf(DateKit)
  })
})

describe('Manipulate', () => {
  const dateKit = datekit('2023-11-20T10:35:00')

  it('Add 2 hour 5 minute to 2023-11-20T10:35:00 (ISO)', () => {
    expect(dateKit.iso()).toBe('2023-11-20T10:35:00')
    expect(dateKit.plus(2, 'hour').plus(5, 'minute').iso()).toBe(
      '2023-11-20T12:40:00'
    )
  })
  it('Add 2 weeks to 2023-11-20T10:35:00 (ISO)', () => {
    expect(dateKit.plus(2, 'week').iso()).toBe('2023-12-04T10:35:00')
  })
  it('Subtract 5 minute from 2023-11-20T10:35:00 (ISO)', () => {
    expect(dateKit.minus(5, 'minute').iso()).toBe('2023-11-20T10:30:00')
  })
})

describe('Start & End', () => {
  const dateKit = datekit('2023-11-09 10:35:00')
  it('Start & End of Year', () => {
    expect(dateKit.startOf('year').format()).toBe('2023-01-01T00:00:00')
    expect(dateKit.endOf('year').format()).toBe('2023-12-31T23:59:59')
  })
  it('Start & End of Month', () => {
    expect(dateKit.startOf('month').format()).toBe('2023-11-01T00:00:00')
    expect(dateKit.endOf('month').format()).toBe('2023-11-30T23:59:59')
  })
  it('Start & End of Week', () => {
    expect(dateKit.startOf('week').format()).toBe('2023-11-05T00:00:00')
    expect(dateKit.endOf('week').format()).toBe('2023-11-11T23:59:59')
  })
  it('Start & End of Day/Date', () => {
    expect(dateKit.startOf('day').format()).toBe('2023-11-09T00:00:00')
    expect(dateKit.endOf('day').format()).toBe('2023-11-09T23:59:59')
  })
})

describe('Time Status', () => {
  it('should return the string', () => {
    expect(typeof datekit('2023-11-20T10:35:00').status()).toBe('string')
  })
})

describe('Format', () => {
  const dateKit = datekit('2023-11-09 10:35:00')
  it('Formats [Year, Month, Day, Hour, Minute, Second]', () => {
    expect(dateKit.format('YYYY')).toBe('2023')
    expect(dateKit.format('MMM')).toBe('Nov')
    expect(dateKit.format('D')).toBe('9')
    expect(dateKit.format('hh')).toBe('10')
    expect(dateKit.format('mm')).toBe('35')
    expect(dateKit.format('s')).toBe('0')
  })

  it('Local formats', () => {
    expect(dateKit.format('LT')).toBe('10:35 AM')
    expect(dateKit.format('LTS')).toBe('10:35:00 AM')
    expect(dateKit.format('L')).toBe('11/09/2023')
    expect(dateKit.format('LL')).toBe('November 9, 2023')
    expect(dateKit.format('l')).toBe('11/9/2023')
    expect(dateKit.format('ll')).toBe('Nov 9, 2023')
  })
})
