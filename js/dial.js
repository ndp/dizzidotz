function newDial(dom, model$) {

  model$.subscribe(function(x) {
    const startAngle   = 0
    const value        = x * 270 + startAngle
    const tempoReading = dom.querySelector('.reading')
    tempoReading
        .setAttribute('d', svgArc(50, 50, 45, startAngle, value))

  })
  // INTENT
  Rx.Observable
      .fromEvent(dom, 'click')
      .map(e => {
             return {x: e.layerX - 50, y: e.layerY - 50}
           })
      .map(pt => ptToVector(pt)[0])
      .map(normalizeRadians)
      .filter(r => r >= -Math.PI / 2)  // [-.5π..π]
      .map(r=>r + Math.PI / 2)         // 0..3/2π
      .map(r=>r * .66665 / Math.PI)    // normalize [0..1]
      .subscribe(model$)
}




