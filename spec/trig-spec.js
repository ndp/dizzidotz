const assertClose = (assert, r, e) => {
  assert.equal(Math.abs(r - e) < 0.000000001, true, `Expect ${r} to be near ${e}.`)
}

const assertArrayClose = (assert, r, e) => {
  e.forEach((_, i) => {
    assertClose(assert, r[i], e[i])
  })
}

QUnit.test("normalizeRadians 0", (assert) => {
  assertClose(assert, normalizeRadians(0), 0);
});
QUnit.test("normalizeRadians 2π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 2), 0);
});
QUnit.test("normalizeRadians -2π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -2), 0);
});
QUnit.test("normalizeRadians 4π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 4), 0);
});

QUnit.test("normalizeRadians 1/2π", (assert) => {
  assertClose(assert, normalizeRadians(.5 * Math.PI), .5 * Math.PI);
});

QUnit.test("normalizeRadians 5/2π", (assert) => {
  assertClose(assert, normalizeRadians(2.5 * Math.PI), .5 * Math.PI);
});

QUnit.test("normalizeRadians -3/2π", (assert) => {
  assertClose(assert, normalizeRadians(-1.5 * Math.PI), .5 * Math.PI);
});

QUnit.test("normalizeRadians -7/2π", (assert) => {
  assertClose(assert, normalizeRadians(-3.5 * Math.PI), .5 * Math.PI);
});


QUnit.test("normalizeRadians π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI), Math.PI);
});
QUnit.test("normalizeRadians 3π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 3), Math.PI);
});
QUnit.test("normalizeRadians -π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -1), Math.PI);
});
QUnit.test("normalizeRadians 3π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -3), Math.PI);
});


////////////////////////////////////////////////

QUnit.test("ptToVector([1,1])", (assert) => {
  assertArrayClose(assert, ptToVector({x: 1, y: 1}), [Math.PI / 4, Math.sqrt(2)], "We expect values to be sqrt(2)");
});

QUnit.test("ptToVector([-100,0])", (assert) => {
  assertArrayClose(assert, ptToVector({x: -100, y: 0}), [Math.PI, 100], "We expect values to be sqrt(2)");
});

QUnit.test("ptToVector([-30,-40])", (assert) => {
  assertArrayClose(assert, ptToVector({x: -30, y: -40}), [-2.214297435588181, 50], "We expect values to be sqrt(2)");
});

////////////////////////////////////////////////

QUnit.test("vectorToPt([Math.PI / 4, Math.sqrt(2)])", (assert) => {
  var r = vectorToPt(Math.PI / 4, Math.sqrt(2))
  assertArrayClose(assert, [r.x, r.y], [1, 1]);
});

QUnit.test("vectorToPt([Math.PI, 100])", (assert) => {
  var r = vectorToPt(Math.PI, 100)
  assertArrayClose(assert, [r.x, r.y], [-100, 0]);
});

QUnit.test("vectorToPt([-2.214297435588181, 50])", (assert) => {
  var r = vectorToPt(-2.214297435588181, 50)
  assertArrayClose(assert, [r.x, r.y], [-30, -40]);
});

