const assert = require('chai').assert;
const {ptToVector,vectorToPt, normalizeRadians} = require('../js/lib/ndp-software/trig.js')

const assertClose = (r, e) => {
  assert.equal(Math.abs(r - e) < 0.000000001, true, `Expect ${r} to be near ${e}.`)
}

const assertArrayClose = (r, e) => {
  e.forEach((_, i) => {
    assertClose(r[i], e[i])
  })
}

describe('normalizeRadians', function() {
  it("0", function() {
    assertClose(normalizeRadians(0), 0);
  });
  it("2π", function() {
    assertClose(normalizeRadians(Math.PI * 2), 0);
  });
  it("-2π", function() {
    assertClose(normalizeRadians(Math.PI * -2), 0);
  });
  it("4π", function() {
    assertClose(normalizeRadians(Math.PI * 4), 0);
  });

  it("1/2π", function() {
    assertClose(normalizeRadians(.5 * Math.PI), .5 * Math.PI);
  });

  it("5/2π", function() {
    assertClose(normalizeRadians(2.5 * Math.PI), .5 * Math.PI);
  });

  it("-3/2π", function() {
    assertClose(normalizeRadians(-1.5 * Math.PI), .5 * Math.PI);
  });

  it("-7/2π", function() {
    assertClose(normalizeRadians(-3.5 * Math.PI), .5 * Math.PI);
  });


  it("π", function() {
    assertClose(normalizeRadians(Math.PI), Math.PI);
  });
  it("3π", function() {
    assertClose(normalizeRadians(Math.PI * 3), Math.PI);
  });
  it("-π", function() {
    assertClose(normalizeRadians(Math.PI * -1), Math.PI);
  });
  it("3π", function() {
    assertClose(normalizeRadians(Math.PI * -3), Math.PI);
  });

})


describe('ptToVector', function() {
  it("ptToVector([1,1])", function() {
    assertArrayClose(ptToVector({x: 1, y: 1}), [Math.PI / 4, Math.sqrt(2)], "We expect values to be sqrt(2)");
  });

  it("ptToVector([-100,0])", function() {
    assertArrayClose(ptToVector({x: -100, y: 0}), [Math.PI, 100], "We expect values to be sqrt(2)");
  });

  it("ptToVector([-30,-40])", function() {
    assertArrayClose(ptToVector({x: -30, y: -40}), [-2.214297435588181, 50], "We expect values to be sqrt(2)");
  });

})

describe('vectorToPt', function() {
  it("vectorToPt([Math.PI / 4, Math.sqrt(2)])", function() {
    var r = vectorToPt(Math.PI / 4, Math.sqrt(2))
    assertArrayClose([r.x, r.y], [1, 1]);
  });

  it("vectorToPt([Math.PI, 100])", function() {
    var r = vectorToPt(Math.PI, 100)
    assertArrayClose([r.x, r.y], [-100, 0]);
  });

  it("vectorToPt([-2.214297435588181, 50])", function() {
    var r = vectorToPt(-2.214297435588181, 50)
    assertArrayClose([r.x, r.y], [-30, -40]);
  });

})

