const regex = /-webkit-|-moz-|-ms-/

export default function isPrefixedValue(value) {
  return typeof value === 'string' && regex.test(value)
}
