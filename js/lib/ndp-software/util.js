const log = (x) => (y,z) => console.log(x, y, z)

function precondition(x, msg) {
  if (!x) throw msg
}
