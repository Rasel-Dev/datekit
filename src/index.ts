import DateKit from './utils/datekit'

const datekit = (d?: any, c?: any) => {
  if (d instanceof DateKit) return d.clone()
  const config = typeof c === 'object' ? c : undefined
  return new DateKit(d ? new Date(d) : undefined, config)
}

export default datekit
