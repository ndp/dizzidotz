# Pilota: RxJS Command Bus

<img style='float:right;width: 300px;' src='http://interviewmg.ru/wp-content/uploads/2012/03/amelia-earhart-big.jpg' />
The Pilota library provides a command dispatcher for use with RxJS 
streams. The **bus** receives and executes **command objects** that 
transform from one immutable state to another. See the "store" 
within the Redux framework for a similar pattern.

## Example

This shows a set of commands that increment and decrement a simple
 integer state:

```javascript
const state$ = new Rx.BehaviorSubject(0)
...
const bus$ = newCmdBus$(state$)
bus$.addHandler('increment', x => x + 1)
bus$.addHandler('decrement', x => x - 1)
...

// explicitly execute a command...
bus$.next('increment')

// ...or feed it directly from anther stream:
Rx.Observer.fromEvent(e, 'click').mapTo('decrement').subscribe(bus$)
```

## Usage Steps

#### 1. Represent state in a stream

Use an RxJS `BehaviorSubject` to represent the model or state. 

#### 2. Write Command Handlers

A command handler is a simple function:

```
(previous-state) => new-state
```

The function receives the current state (considered immutable)
and returns the new state based on the effect of the command. This simple
contract makes it quite easy to unit test the business logic.

The command handler is called within a context. The function can access
`this.name` to determine the name of the command. The triggering of
a command may add any number of additional attributes as needed.

The function normally returns the next state. This function can 
also return `undefined` to indicate no state change, in 
which case the state will not be modified.

#### 3. Create a Bus
 
Use `newCmdBus$` to create a new bus, providing a current state 
observer. The state must be a `Subject` -- or at least both an 
`Observer` and `Observable`. An `Rx.BehaviorSubject` works well.

#### 4. Register Command Handlers
 
The command bus provides a method to add mappings for command 
handlers, using `addHandler(name, handlerFn)`. 

The first paramater is the **name** of the command, which is a String, 
and you are free to use constants if that floats your boat. 

The second parameter is the command **handler**. It is responsible for
producing a new state from the current state. 

The name appears on the command bus, it triggers the given handler function.
 
In Redux paralance, the name of the command is called its "type". The
handler is a Redux "reducer" function.

A generic '*' handler name may be added to catch unassigned commands. It still
must conform to the contract of returning a new state.


#### 5. Trigger Commands on the Bus

The bus is an observer of commands, and if a handler is
available, it is called. Each command generates a new state.

Commands can be passed as simple strings:

```javascript
  bus$.next('increment')
```

or as objects with a `name` property:

```javascript
  bus$.next({ name: 'add', value: 1, other_data: 'abcdef', ... })
```

Using the object form, any additional data can be provided to the 
command function. This will appear in the context (`this`) of the
handler.

If there is no matching function, the no new state is triggered, 
and the command is ignored.

This is **push** style, and therefore not "responsive". It's more common 
to feed the command bus in response to an existing stream, such as:

```
Rx.Observable
  .fromEvent(elem, 'click')
  .mapTo('increment')
  .subscribe(bus$)
```


## Recipes

### Using an Object for dispatching

Internally `addHandler` simply builds a hashmap of the command names
to the functions that handle them. This can be DRYed by creating
the command bus from a Javascript object:

```javascript
const commands = {
                   increment: (x) => x + 1,
                   decrement: (x) => x - 1
                 }
const bus$     = newCmdBus$(state$, commands)
```

or simply:

```javascript
const bus$ = newCmdBus$(state$, {
                                  increment: (x) => x + 1,
                                  decrement: (x) => x - 1
                                })
```

### Extending

The dispatching strategy can be overriden by passing your
own dispatcher. See `newDispatcher` for the standard implementation.
Using this technique, the command bus can be object-oriented, where
each command is handled by a method of an object. Or it could be
implemented using a switch statement, as is common to Redux.


### Sub-models

The easiest technique to provide modularity is to
use separate command buses for different parts of the app.
This allows separation of concerns around different parts of the model.

Given that, basic support for nested states is available with 
`submodelCmd`. This is a wrapper for a handler:

```javascript
submodelCmd([property-name], [original-handler]) // => handler
```

To use this, create a function that only cares about a sub-model 
value, and does the appropriate reducing. Normal usage is:

```
const state = {
  foos: [...]
  likes: 0
}
...
cmdBus$.addHandler('incLikes', submodelCmd('likes', (state) => state + 1))
```

[Experimental] It can also be partially applied, with just the function, as in:

```
inc = submodelCmd((state) => state + 1)
cmdBus$.addHandler('incLikes', inc('likes')
```


## TODOs

* pull into its own repo
* combineReducer from Redux
* decide `addHandler` vs. `on`

## References

