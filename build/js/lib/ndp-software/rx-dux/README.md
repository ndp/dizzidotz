# Command Bus

Create a bus that receives and executes commands that transform
the state. See the "store" within the Redux framework for a similar
pattern (or many functional programming ideas before that).

## Usage

### Creating a Bus

```
const bus$ = newCmdBus$(state$)
bus$.addReducer('increment', (state) => state + 1)
...
bus$.next('increment')
```

1. Use `newCmdBus$` to create a new bus, providing a current state 
observer. The state must be a `Subject` -- or at least both an 
`Observer` and `Observable`. An `Rx.BehaviorSubject` works well.

2. Register command handlers with `addReducer`. Provide the name
of the command and a function. *Commands are identified with strings
.* Only one command per name. The reducer function should know
 how to project the state given the current state and the command, ie.
```
(state, cmd) => new state
```

The bus will listen for commands; each command generates
a new state. If it finds a matching command, it calls that
reducer function to transform the state.
If there is no matching function, then the same state is
returned. Hint: use `distinct` to ignore insignificant "changes",
including no-ops from missing listeners.

Example:
If the state were an integer, this system would
increment and decrement:

```
const state$ = new Rx.BehaviorSubject(0)

const bus$ = newCmdBus$(state$)
bus$.addReducer('increment', x => x + 1)
bus$.addReducer('decrement', x => x - 1)

bus$.next('increment')
...
```

The bus can also be fed from other streams, as in:

```
Rx.Observable
.fromEvent(elem, 'click')
.map('increment')
.subscribe(bus$)
```

The dispatching strategy can be overriden by passing your
own dispatcher. See `newDispatcher` for the standard implementation.
Using this technique, the command bus can be object-oriented, where
each command is handled by a method of an object.

Basic support for nested states is available with `submodelCmd`.
This is a wrapper for a reducer that takes the property of the main
state being used. Another technique that might be more useful is to
use separate command buses for different parts of the app.
