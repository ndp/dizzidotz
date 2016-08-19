export function submodelCmd(property, fn) {
  if (typeof fn != 'undefined') {
    return function(state, ...props) {
      const result     = Object.assign({}, state)
      result[property] = fn(state[property], ...props)
      return result
    }
  } else {
    // If no property is provided, then we return a partially applied fn.
    fn = property
    return function(property) {
      return submodelCmd(property, fn)
    }
  }
}


