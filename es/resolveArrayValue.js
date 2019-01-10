import hyphenateProperty from './hyphenateProperty'

export default function resolveArrayValue(
  property,
  value
) {
  const hyphenatedProperty = hyphenateProperty(property)

  return value.join(`;${hyphenatedProperty}:`)
}
