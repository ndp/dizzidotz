# Pilota: RxJS Command Bus

<img src="http://interviewmg.ru/wp-content/uploads/2012/03/amelia-earhart-big.jpg" alt="Image of Amerlia Earhart" width="300" float="right">

The Pilota library provides a command dispatcher for use with RxJS streams. The **bus** receives and executes **command objects** that transform from one immutable state to another. See the "store" within the Redux framework for a similar pattern.

## Example

This shows a set of commands that increment and decrement a simple integer state:

```javascript
import {newCmdBus$} from 'pilota/cmdBus.js'

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

#### 1. Create the state stream

Use an RxJS `Subject` to represent the model or state. An `Rx.BehaviorSubject` works well.

#### 2. Create a Bus
```javascript 
const bus$ = newCmdBus$(state$)
```

#### 3. Trigger Commands on the Bus

Trigger the execution of a command using a **command objects**. This is any Javascript object with a `name` property, but it can-- and will often-- have other properties:

```javascript
bus$.next({ name: 'add', value: 1, other_data: 'abcdef', ... })
```

The name of the command should be a String. You are free to use constants if that floats your boat. 

If there are no other properties, a simple string may be used, and the command object will be created automatically:

```javascript
bus$.next('increment')
```

#### 4. Register a Command Handler

The command bus provides a method to map specific command names to given handler function:

```javascript
bus$.addHandler(name, handlerFn)
```

A command handler itself is a simple function with this signature:

```javascript
fn(previous-state, cmdObject) # => new-state
```

The command handler function receives the current state (considered immutable) and returns the new state based on the effect of the command. This simple contract makes it quite easy to unit test the business logic. 

## Working with the Command Bus

The name appears on the command bus, it triggers the given handler function. In Redux parlance, the name of the command is called its "type", and the handler is a "reducer" function.

#### Wildcard

A generic '*' handler name may be added to catch unassigned commands. It still must conform to the contract of returning a new state. This presumably could be used to write your own dispatcher in a `switch` statement.

#### Non-matching Command Behavior

If there is no matching function, and no wildcard was registered, then no new state is triggered, and the command is ignored.

#### Reactive

The examples are **push** style, and therefore not "reactive". It's more common to feed the command bus in response to an existing stream, such as:

```javascript
Rx.Observable
  .fromEvent(elem, 'click')
  .mapTo('increment')
  .subscribe(bus$)
```

#### Using an Object for Dispatching

Internally `addHandler` simply builds a hashmap of the command names to the functions that handle them. This can be DRYed by creating the command bus from a Javascript object:

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



## Writing Command Handlers

The bus is an observer of commands, and if a handler is available, it is called. Each command generates a new state.

Each handler receives the command object as a second parameter. Therefore, a handler for this command:

```javascript
  bus$.next({ name: 'add', value: 1, other_data: 'abcdef', ... })
```

might look like:

```javascript
  bus$.addHandler('add', function(state, cmdObj) {
    return state + cmdObj.value
  })
```

#### Using the context

This second parameter can often be ignored. In fact, it is also provided as the "context" or `this` of the handler. The function can access `this.name` to determine the name of the command. The additional attributes will be included in the context as well. For example:

```javascript
 function addProperty(state) {
   return Object.assign({}, state, { this.key: this.value }
 }
```


#### No-ops

The function normally returns the next state. This function can also return `undefined` to indicate no state change, in which case the state will not be modified.

#### Sub-models

The easiest technique to provide modularity is to use separate command buses for different parts of the app. This allows separation of concerns around different parts of the model.

Given that, basic support for nested states is available with  `submodelCmd`. This is a wrapper for a handler:

```javascript
submodelCmd([property-name], [original-handler]) // => handler
```

To use this, create a function that only cares about a sub-model value, and does the appropriate reducing. Normal usage is:

```javascript
const state = {
  foos: [...]
  likes: 0
}
...
cmdBus$.addHandler('incLikes', submodelCmd('likes', (state) => state + 1))
```

[Experimental] It can also be partially applied, with just the function, as in:

```javascript
inc = submodelCmd((state) => state + 1)
cmdBus$.addHandler('incLikes', inc('likes')
```


## Extending

The dispatching strategy can be overriden by passing your own dispatcher. See `newDispatcher` for the standard implementation. Using this technique, the command bus can be object-oriented, where each command is handled by a method of an object. Or it could be implemented using a switch statement, as is common to Redux.




## TODOs

* pull into its own repo
* combineReducer from Redux
* decide `addHandler` vs. `on`

## References

