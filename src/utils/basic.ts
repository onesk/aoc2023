export function sgnBigInt (a: bigint): number {
  if (a < 0n) {
    return -1
  }

  if (a > 0n) {
    return 1
  }

  return 0
}

export function minimum<N> (arr: N[]): N | null {
  let min: N | null = null
  for (const cur of arr) {
    if (cur != null && (min == null || cur < min)) {
      min = cur
    }
  }

  return min
}
