import {polarToCartesian} from './trig.js'

/* An arc */
/* eslint-disable max-params */
export function svgArc(x, y, radius, startAngle, endAngle) {
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


/* Partial donut */
/* eslint-disable max-params */
export function svgClippedArc(x, y,
                       innerRadius, outerRadius,
                       startAngle, endAngle) {

  const startOuter = polarToCartesian(x, y, outerRadius, endAngle)
  const endOuter   = polarToCartesian(x, y, outerRadius, startAngle)
  const startInner = polarToCartesian(x, y, innerRadius, endAngle)
  const endInner   = polarToCartesian(x, y, innerRadius, startAngle)

  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, arcSweep, 1, startInner.x, startInner.y,
    'Z'
  ].join(' ')
}

