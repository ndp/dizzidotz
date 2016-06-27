function svgArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end   = polarToCartesian(x, y, radius, startAngle)

  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    'L', x, y,
    'L', start.x, start.y
  ].join(' ')
}

