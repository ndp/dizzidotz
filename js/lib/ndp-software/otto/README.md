# Otto: RxJS Command Bus

This library provides a dispatcher/command pattern built on top of 
RxJS streams. The *bus* receives and executes *command objects* that 
uses a  BehaviorSubject to transform from one immutable state to 
another. See the "store" within the Redux framework for a similar
pattern.

## Usage

### Example

If the state were a simple integer, this code would
increment and decrement it:

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

#### 1. Write Command Handlers

A command handler is a simple function:

```
(state, commandObject) => new state
```

The function should take the current state (consider it immutable)
and return a new state based on the effect of the command. This simple
contract makes it quite easy to unit test the business logic.

The `commandObject` always has a *name* property that was used to 
identify it (you will see below). It may have any number of additional
attributes provided during the command triggering.

This function can return `undefined` to indicate no state change, in 
which case the state will not be modified.

#### 2. Create a Bus
 
Use `newCmdBus$` to create a new bus, providing a current state 
observer. The state must be a `Subject` -- or at least both an 
`Observer` and `Observable`. An `Rx.BehaviorSubject` works well.

#### 3. Register Command Handlers
 
The command bus provides a method to add mappings for command 
handlers, using `addHandler(name, fn)`. 

The first paramater is the *name* of the command (called the "type
in Redux). It's a String, and you are free to use constants if
that floats your boat. The name triggers the given handler function (the 
"reducer" in Redux parlance). 

A generic '*' handler may be added to catch unassigned commands. It still
must conform to the contract of returning a new state.

The second parameter is the command *handler*. It is responsible for
producing a new state from the current state. 

#### 4. Trigger Commands on the Command Bus

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
command function.

If there is no matching function, the no new state is triggered.

This is *push* style, and therefore no "responsive". It's more common 
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
each command is handled by a method of an object.


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
cmdBus$.on('incLikes', submodelCmd('likes', (state) => state + 1)
```

[Experimental] It can also be partially applied, with just the function, as in:

```
inc = submodelCmd((state) => state + 1)
cmdBus$.on('incLikes', inc('likes')
```


## References

* [Otto Mann](https://en.wikipedia.org/wiki/Otto_Mann)