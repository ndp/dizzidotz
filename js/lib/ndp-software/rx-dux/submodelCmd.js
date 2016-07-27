/*
 Create a handler that only cares about a sub-model, allowing separation
 of concerns around different parts of the model.

 Normal usage is:

 ```
 const state = {
 foos: [...]
 likes: 0
 }
 ...
 cmdBus$.on('incLikes', submodelCmd('likes', (state) => state + 1)
 ```

 [Experimental] It can also be partially applied, with just the function, as in:

 ```
 inc = submodelCmd((state) => state + 1)
 cmdBus$.on('incLikes', inc('likes')
 ```
 */
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


