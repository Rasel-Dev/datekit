import DateKit from '../src/index'

describe('Type Check', () => {
  const dateKit = new DateKit()
  it('should return the current time in milliseconds', () => {
    expect(typeof dateKit.getTime()).toBe('number')
  })
  it('should return the current local time string', () => {
    expect(typeof dateKit.now()).toBe('string')
  })
  it('should return the current UTC time string', () => {
    expect(typeof dateKit.utc()).toBe('string')
  })
  it('should return the UTC [ 2023-11-20T04:35:00.000Z ] to local ISO format', () => {
    const clone = dateKit.clone('2023-11-20T04:35:00.000Z')
    expect(clone.iso()).toBe('2023-11-20T10:35:00')
  })
})

describe('Instance Check', () => {
  const dateKit = new DateKit()
  it('Clone should return new isntance', () => {
    const clone = dateKit.clone()
    expect(clone).toBeInstanceOf(DateKit)
  })
  it('Manipulation should return new isntance', () => {
    const plus = dateKit.plus(2, 'minute')
    const minus = dateKit.minus(2, 'minute')
    expect(plus).toBeInstanceOf(DateKit)
    expect(minus).toBeInstanceOf(DateKit)
  })
  it('Set TimeZone should return new isntance', () => {
    const tz = dateKit.tz('Asia/Dhaka')
    expect(tz).toBeInstanceOf(DateKit)
  })
})

describe('Manipulate', () => {
  const dateKit = new DateKit('2023-11-20T10:35:00')

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

describe('Time Status', () => {
  const dateKit = new DateKit('2023-11-20T10:35:00')
  it('should return the string', () => {
    expect(typeof dateKit.status()).toBe('string')
  })
})

describe('Format', () => {
  const dateKit = new DateKit('2023-11-09 10:35:00')
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
