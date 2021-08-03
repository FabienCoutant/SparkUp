export const serializeUSDCFor = (value: number | string, isTargetSolidity: boolean):number => {
  if (typeof value === 'string') {
    value = parseInt(value)
  }
  if (isTargetSolidity) {
    return value * 10 ** 6
  } else {
    return (value / 10 ** 6)
  }
}
