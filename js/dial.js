function newDial(dom, model$) {

  model$.subscribe(function(x) {
    const startAngle   = 0
    const value        = x * 350 + startAngle
    const tempoReading = dom.querySelector('.reading')
    tempoReading
        .setAttribute('d', svgClippedArc(50, 50, 30, 45, startAngle, value))

  })
  // INTENT
  Rx.Observable
      .fromEvent(dom, 'click')
      .map(e => {
             return {x: e.layerX - 50, y: e.layerY - 50}
           })
      .map(pt => ptToVector(pt)[0])
      .map(r=>r + Math.PI / 2)       // 0..2π
      .map(normalizeRadians)
      .map(r=> r < 0 ? r + 2 * Math.PI : r)
      .map(r=>r * 0.5 / Math.PI)    // normalize [0..1]
      .subscribe(model$)
}




