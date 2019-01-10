const prefixRegex = /(-ms-|-webkit-|-moz-|-o-)/g

export default function unprefixValue(value) {
  if (typeof value === 'string') {
    return value.replace(prefixRegex, '')
  }

  return value
}
