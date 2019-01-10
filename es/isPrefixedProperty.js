const regex = /^(Webkit|Moz|O|ms)/

export default function isPrefixedProperty(property) {
  return regex.test(property)
}
