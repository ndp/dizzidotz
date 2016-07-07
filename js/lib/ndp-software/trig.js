export const radiansPerPeriod = 2 * Math.PI

// Put `r` between -π and π
export const normalizeRadians = (r) => {
  if (Math.abs(r) < Math.pi) return r
  while (r < 0) r += radiansPerPeriod
  while (r > Math.PI) r -= radiansPerPeriod
  return r
}


export const ptToVector = function (pt) {
  const angle = Math.atan2(pt.y, pt.x) // note: unintuitive order is JS spec
  const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y)
  return [angle, dist]
}


export const vectorToPt = (angle, dist) => {
  return {
    x: dist * Math.cos(angle),
    y: dist * Math.sin(angle)
  }
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}



