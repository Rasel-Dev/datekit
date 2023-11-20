import DateTime from '../src/index'

describe('Core API', () => {
  const dateTime = new DateTime()
  it('should return the current time', () => {
    expect(typeof dateTime.now()).toBe('string')
  })
  it('should return the UTC to local ISO format', () => {
    const clone = dateTime.clone('2023-11-20T04:35:00.000Z')
    expect(clone.iso()).toBe('2023-11-20T10:35:00')
  })
})

describe('Manipulate', () => {
  const dateTime = new DateTime('2023-11-20T10:35:00').plus(2, 'hour')
  it('should return extra 2 hour 5 minute datetime', () => {
    expect(dateTime.iso()).toBe('2023-11-20T12:35:00')
    expect(dateTime.plus(5, 'minute').iso()).toBe('2023-11-20T12:40:00')
    expect(dateTime.minus(5, 'minute').iso()).toBe('2023-11-20T12:30:00')
  })
  it('should return the UTC format', () => {
    expect(dateTime.utc()).toBe('2023-11-20T06:35:00Z')
  })
})

describe('Format', () => {
  const dateTime = new DateTime('2023-11-09 10:35:00')
  it('Format [Year, Month, Day, Hour, Minute, Second]', () => {
    expect(dateTime.format('YYYY')).toBe('2023')
    expect(dateTime.format('MMM')).toBe('Nov')
    expect(dateTime.format('D')).toBe('9')
    expect(dateTime.format('hh')).toBe('10')
    expect(dateTime.format('mm')).toBe('35')
    expect(dateTime.format('s')).toBe('0')
  })

  it('Local format', () => {
    expect(dateTime.format('LT')).toBe('10:35 AM')
    expect(dateTime.format('LTS')).toBe('10:35:00 AM')
    expect(dateTime.format('L')).toBe('11/09/2023')
    expect(dateTime.format('LL')).toBe('November 9, 2023')
    expect(dateTime.format('l')).toBe('11/9/2023')
    expect(dateTime.format('ll')).toBe('Nov 9, 2023')
  })
})
