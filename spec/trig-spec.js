const assertClose = (assert, r, e, m) => {
  assert.equal(Math.abs(r - e) < 0.000000001, true, m)
}

QUnit.test("normalizeRadians 0", (assert) => {
  assertClose(assert, normalizeRadians(0), 0, "We expect values to be 0");
});
QUnit.test("normalizeRadians 2π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 2), 0, "We expect values to be 0");
});
QUnit.test("normalizeRadians -2π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -2), 0, "We expect values to be 0");
});
QUnit.test("normalizeRadians 4π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 4), 0, "We expect values to be 0");
});

QUnit.test("normalizeRadians 1/2π", (assert) => {
  assertClose(assert, normalizeRadians(.5*Math.PI), .5*Math.PI, "We expect values to be .5*π");
});

QUnit.test("normalizeRadians 5/2π", (assert) => {
  assertClose(assert, normalizeRadians(2.5*Math.PI), .5*Math.PI, "We expect values to be .5*π");
});

QUnit.test("normalizeRadians -3/2π", (assert) => {
  assertClose(assert, normalizeRadians(-1.5*Math.PI), .5*Math.PI, "We expect values to be .5*π");
});

QUnit.test("normalizeRadians -7/2π", (assert) => {
  assertClose(assert, normalizeRadians(-3.5*Math.PI), .5*Math.PI, "We expect values to be .5*π");
});


QUnit.test("normalizeRadians π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI), Math.PI, "We expect values to be π");
});
QUnit.test("normalizeRadians 3π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * 3), Math.PI, "We expect values to be π");
});
QUnit.test("normalizeRadians -π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -1), Math.PI, "We expect values to be π");
});
QUnit.test("normalizeRadians 3π", (assert) => {
  assertClose(assert, normalizeRadians(Math.PI * -3), Math.PI, "We expect values to be π");
});
