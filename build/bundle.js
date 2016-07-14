/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(56);
	__webpack_require__(356);
	__webpack_require__(357);
	__webpack_require__(358);
	__webpack_require__(384);
	__webpack_require__(388);
	__webpack_require__(390);
	__webpack_require__(391);
	__webpack_require__(389);
	__webpack_require__(392);
	module.exports = __webpack_require__(58);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.playState$ = undefined;
	
	var _Observable = __webpack_require__(4);
	
	var _BehaviorSubject = __webpack_require__(21);
	
	__webpack_require__(26);
	
	__webpack_require__(29);
	
	__webpack_require__(31);
	
	__webpack_require__(33);
	
	var _cmdBus = __webpack_require__(35);
	
	// MODEL
	var STORE_KEY = 'play-pause';
	var playState$ = exports.playState$ = new _BehaviorSubject.BehaviorSubject(localStorage[STORE_KEY] || 'playing');
	playState$.subscribe(function (x) {
	    return localStorage[STORE_KEY] = x;
	});
	
	var playStateBus$ = (0, _cmdBus.newCmdBus$)(playState$);
	playStateBus$.on('toggle', function (state) {
	    return state == 'playing' ? 'paused' : 'playing';
	});
	
	// VIEW
	var playPauseEl = document.getElementById('play-pause');
	
	playState$.subscribe(function (x) {
	    playPauseEl.className = playPauseEl.className.replace(/playing|paused/, x); // x = 'playing' or 'paused'
	});
	
	// INTENT
	var playPauseClicks$ = _Observable.Observable.fromEvent(playPauseEl, 'click').do(function (e) {
	    return e.preventDefault();
	});
	playPauseClicks$.mapTo('toggle').subscribe(playStateBus$);
	
	var playPauseKeypress$ = _Observable.Observable.fromEvent(document, 'keypress').filter(function (e) {
	    return e.keyCode == 32;
	}) // space
	.mapTo('toggle').subscribe(playStateBus$);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Observable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _root = __webpack_require__(5);
	
	var _toSubscriber = __webpack_require__(7);
	
	var _symbolObservable = __webpack_require__(18);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	
	var Observable = exports.Observable = function () {
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is  called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	
	    function Observable(subscribe) {
	        _classCallCheck(this, Observable);
	
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	
	
	    _createClass(Observable, [{
	        key: 'lift',
	        value: function lift(operator) {
	            var observable = new Observable();
	            observable.source = this;
	            observable.operator = operator;
	            return observable;
	        }
	        /**
	         * Registers handlers for handling emitted values, error and completions from the observable, and
	         *  executes the observable's subscriber function, which will take action to set up the underlying data stream
	         * @method subscribe
	         * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
	         *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
	         * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
	         *  the error will be thrown as unhandled
	         * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
	         * @return {ISubscription} a subscription reference to the registered handlers
	         */
	
	    }, {
	        key: 'subscribe',
	        value: function subscribe(observerOrNext, error, complete) {
	            var operator = this.operator;
	
	            var sink = (0, _toSubscriber.toSubscriber)(observerOrNext, error, complete);
	            if (operator) {
	                operator.call(sink, this);
	            } else {
	                sink.add(this._subscribe(sink));
	            }
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	            return sink;
	        }
	        /**
	         * @method forEach
	         * @param {Function} next a handler for each value emitted by the observable
	         * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	         * @return {Promise} a promise that either resolves on observable completion or
	         *  rejects with the handled error
	         */
	
	    }, {
	        key: 'forEach',
	        value: function forEach(next, PromiseCtor) {
	            var _this = this;
	
	            if (!PromiseCtor) {
	                if (_root.root.Rx && _root.root.Rx.config && _root.root.Rx.config.Promise) {
	                    PromiseCtor = _root.root.Rx.config.Promise;
	                } else if (_root.root.Promise) {
	                    PromiseCtor = _root.root.Promise;
	                }
	            }
	            if (!PromiseCtor) {
	                throw new Error('no Promise impl found');
	            }
	            return new PromiseCtor(function (resolve, reject) {
	                var subscription = _this.subscribe(function (value) {
	                    if (subscription) {
	                        // if there is a subscription, then we can surmise
	                        // the next handling is asynchronous. Any errors thrown
	                        // need to be rejected explicitly and unsubscribe must be
	                        // called manually
	                        try {
	                            next(value);
	                        } catch (err) {
	                            reject(err);
	                            subscription.unsubscribe();
	                        }
	                    } else {
	                        // if there is NO subscription, then we're getting a nexted
	                        // value synchronously during subscription. We can just call it.
	                        // If it errors, Observable's `subscribe` imple will ensure the
	                        // unsubscription logic is called, then synchronously rethrow the error.
	                        // After that, Promise will trap the error and send it
	                        // down the rejection path.
	                        next(value);
	                    }
	                }, reject, resolve);
	            });
	        }
	    }, {
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            return this.source.subscribe(subscriber);
	        }
	        /**
	         * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	         * @method Symbol.observable
	         * @return {Observable} this instance of the observable
	         */
	
	    }, {
	        key: _symbolObservable2.default,
	        value: function value() {
	            return this;
	        }
	    }]);
	
	    return Observable;
	}();
	// HACK: Since TypeScript inherits static properties too, we have to
	// fight against TypeScript here so Subject can have a different static create signature
	/**
	 * Creates a new cold Observable by calling the Observable constructor
	 * @static true
	 * @owner Observable
	 * @method create
	 * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	 * @return {Observable} a new cold observable
	 */
	
	
	Observable.create = function (subscribe) {
	    return new Observable(subscribe);
	};
	//# sourceMappingURL=Observable.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	};
	var root = exports.root = objectTypes[typeof self === 'undefined' ? 'undefined' : _typeof(self)] && self || objectTypes[typeof window === 'undefined' ? 'undefined' : _typeof(window)] && window;
	/* tslint:disable:no-unused-variable */
	var freeExports = objectTypes[ false ? 'undefined' : _typeof(exports)] && exports && !exports.nodeType && exports;
	var freeModule = objectTypes[ false ? 'undefined' : _typeof(module)] && module && !module.nodeType && module;
	var freeGlobal = objectTypes[typeof global === 'undefined' ? 'undefined' : _typeof(global)] && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    exports.root = root = freeGlobal;
	}
	//# sourceMappingURL=root.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toSubscriber = toSubscriber;
	
	var _Subscriber = __webpack_require__(8);
	
	var _rxSubscriber = __webpack_require__(17);
	
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof _Subscriber.Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[_rxSubscriber.$$rxSubscriber]) {
	            return nextOrObserver[_rxSubscriber.$$rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new _Subscriber.Subscriber();
	    }
	    return new _Subscriber.Subscriber(nextOrObserver, error, complete);
	}
	//# sourceMappingURL=toSubscriber.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Subscriber = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _isFunction = __webpack_require__(9);
	
	var _Subscription2 = __webpack_require__(10);
	
	var _Observer = __webpack_require__(16);
	
	var _rxSubscriber = __webpack_require__(17);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Implements the {@link Observer} interface and extends the
	 * {@link Subscription} class. While the {@link Observer} is the public API for
	 * consuming the values of an {@link Observable}, all Observers get converted to
	 * a Subscriber, in order to provide Subscription-like capabilities such as
	 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	 * implementing operators, but it is rarely used as a public API.
	 *
	 * @class Subscriber<T>
	 */
	
	var Subscriber = exports.Subscriber = function (_Subscription) {
	    _inherits(Subscriber, _Subscription);
	
	    /**
	     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	     * defined Observer or a `next` callback function.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     */
	
	    function Subscriber(destinationOrNext, error, complete) {
	        _classCallCheck(this, Subscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Subscriber).call(this));
	
	        _this.syncErrorValue = null;
	        _this.syncErrorThrown = false;
	        _this.syncErrorThrowable = false;
	        _this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                _this.destination = _Observer.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    _this.destination = _Observer.empty;
	                    break;
	                }
	                if ((typeof destinationOrNext === 'undefined' ? 'undefined' : _typeof(destinationOrNext)) === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        _this.destination = destinationOrNext;
	                        _this.destination.add(_this);
	                    } else {
	                        _this.syncErrorThrowable = true;
	                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                _this.syncErrorThrowable = true;
	                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
	                break;
	        }
	        return _this;
	    }
	
	    _createClass(Subscriber, [{
	        key: _rxSubscriber.$$rxSubscriber,
	        value: function value() {
	            return this;
	        }
	        /**
	         * A static factory for a Subscriber, given a (potentially partial) definition
	         * of an Observer.
	         * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	         * @param {function(e: ?any): void} [error] The `error` callback of an
	         * Observer.
	         * @param {function(): void} [complete] The `complete` callback of an
	         * Observer.
	         * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	         * Observer represented by the given arguments.
	         */
	
	    }, {
	        key: 'next',
	
	        /**
	         * The {@link Observer} callback to receive notifications of type `next` from
	         * the Observable, with a value. The Observable may call this method 0 or more
	         * times.
	         * @param {T} [value] The `next` value.
	         * @return {void}
	         */
	        value: function next(value) {
	            if (!this.isStopped) {
	                this._next(value);
	            }
	        }
	        /**
	         * The {@link Observer} callback to receive notifications of type `error` from
	         * the Observable, with an attached {@link Error}. Notifies the Observer that
	         * the Observable has experienced an error condition.
	         * @param {any} [err] The `error` exception.
	         * @return {void}
	         */
	
	    }, {
	        key: 'error',
	        value: function error(err) {
	            if (!this.isStopped) {
	                this.isStopped = true;
	                this._error(err);
	            }
	        }
	        /**
	         * The {@link Observer} callback to receive a valueless notification of type
	         * `complete` from the Observable. Notifies the Observer that the Observable
	         * has finished sending push-based notifications.
	         * @return {void}
	         */
	
	    }, {
	        key: 'complete',
	        value: function complete() {
	            if (!this.isStopped) {
	                this.isStopped = true;
	                this._complete();
	            }
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe() {
	            if (this.isUnsubscribed) {
	                return;
	            }
	            this.isStopped = true;
	            _get(Object.getPrototypeOf(Subscriber.prototype), 'unsubscribe', this).call(this);
	        }
	    }, {
	        key: '_next',
	        value: function _next(value) {
	            this.destination.next(value);
	        }
	    }, {
	        key: '_error',
	        value: function _error(err) {
	            this.destination.error(err);
	            this.unsubscribe();
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            this.destination.complete();
	            this.unsubscribe();
	        }
	    }], [{
	        key: 'create',
	        value: function create(next, error, complete) {
	            var subscriber = new Subscriber(next, error, complete);
	            subscriber.syncErrorThrowable = false;
	            return subscriber;
	        }
	    }]);
	
	    return Subscriber;
	}(_Subscription2.Subscription);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var SafeSubscriber = function (_Subscriber) {
	    _inherits(SafeSubscriber, _Subscriber);
	
	    function SafeSubscriber(_parent, observerOrNext, error, complete) {
	        _classCallCheck(this, SafeSubscriber);
	
	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SafeSubscriber).call(this));
	
	        _this2._parent = _parent;
	        var next = void 0;
	        var context = _this2;
	        if ((0, _isFunction.isFunction)(observerOrNext)) {
	            next = observerOrNext;
	        } else if (observerOrNext) {
	            context = observerOrNext;
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if ((0, _isFunction.isFunction)(context.unsubscribe)) {
	                _this2.add(context.unsubscribe.bind(context));
	            }
	            context.unsubscribe = _this2.unsubscribe.bind(_this2);
	        }
	        _this2._context = context;
	        _this2._next = next;
	        _this2._error = error;
	        _this2._complete = complete;
	        return _this2;
	    }
	
	    _createClass(SafeSubscriber, [{
	        key: 'next',
	        value: function next(value) {
	            if (!this.isStopped && this._next) {
	                var _parent = this._parent;
	
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._next, value);
	                } else if (this.__tryOrSetError(_parent, this._next, value)) {
	                    this.unsubscribe();
	                }
	            }
	        }
	    }, {
	        key: 'error',
	        value: function error(err) {
	            if (!this.isStopped) {
	                var _parent = this._parent;
	
	                if (this._error) {
	                    if (!_parent.syncErrorThrowable) {
	                        this.__tryOrUnsub(this._error, err);
	                        this.unsubscribe();
	                    } else {
	                        this.__tryOrSetError(_parent, this._error, err);
	                        this.unsubscribe();
	                    }
	                } else if (!_parent.syncErrorThrowable) {
	                    this.unsubscribe();
	                    throw err;
	                } else {
	                    _parent.syncErrorValue = err;
	                    _parent.syncErrorThrown = true;
	                    this.unsubscribe();
	                }
	            }
	        }
	    }, {
	        key: 'complete',
	        value: function complete() {
	            if (!this.isStopped) {
	                var _parent = this._parent;
	
	                if (this._complete) {
	                    if (!_parent.syncErrorThrowable) {
	                        this.__tryOrUnsub(this._complete);
	                        this.unsubscribe();
	                    } else {
	                        this.__tryOrSetError(_parent, this._complete);
	                        this.unsubscribe();
	                    }
	                } else {
	                    this.unsubscribe();
	                }
	            }
	        }
	    }, {
	        key: '__tryOrUnsub',
	        value: function __tryOrUnsub(fn, value) {
	            try {
	                fn.call(this._context, value);
	            } catch (err) {
	                this.unsubscribe();
	                throw err;
	            }
	        }
	    }, {
	        key: '__tryOrSetError',
	        value: function __tryOrSetError(parent, fn, value) {
	            try {
	                fn.call(this._context, value);
	            } catch (err) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: '_unsubscribe',
	        value: function _unsubscribe() {
	            var _parent = this._parent;
	
	            this._context = null;
	            this._parent = null;
	            _parent.unsubscribe();
	        }
	    }]);
	
	    return SafeSubscriber;
	}(Subscriber);
	//# sourceMappingURL=Subscriber.js.map

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isFunction = isFunction;
	function isFunction(x) {
	    return typeof x === 'function';
	}
	//# sourceMappingURL=isFunction.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Subscription = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _isArray = __webpack_require__(11);
	
	var _isObject = __webpack_require__(12);
	
	var _isFunction = __webpack_require__(9);
	
	var _tryCatch = __webpack_require__(13);
	
	var _errorObject = __webpack_require__(14);
	
	var _UnsubscriptionError = __webpack_require__(15);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Represents a disposable resource, such as the execution of an Observable. A
	 * Subscription has one important method, `unsubscribe`, that takes no argument
	 * and just disposes the resource held by the subscription.
	 *
	 * Additionally, subscriptions may be grouped together through the `add()`
	 * method, which will attach a child Subscription to the current Subscription.
	 * When a Subscription is unsubscribed, all its children (and its grandchildren)
	 * will be unsubscribed as well.
	 *
	 * @class Subscription
	 */
	
	var Subscription = exports.Subscription = function () {
	    /**
	     * @param {function(): void} [unsubscribe] A function describing how to
	     * perform the disposal of resources when the `unsubscribe` method is called.
	     */
	
	    function Subscription(unsubscribe) {
	        _classCallCheck(this, Subscription);
	
	        /**
	         * A flag to indicate whether this Subscription has already been unsubscribed.
	         * @type {boolean}
	         */
	        this.isUnsubscribed = false;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    /**
	     * Disposes the resources held by the subscription. May, for instance, cancel
	     * an ongoing Observable execution or cancel any other type of work that
	     * started when the Subscription was created.
	     * @return {void}
	     */
	
	
	    _createClass(Subscription, [{
	        key: 'unsubscribe',
	        value: function unsubscribe() {
	            var hasErrors = false;
	            var errors = void 0;
	            if (this.isUnsubscribed) {
	                return;
	            }
	            this.isUnsubscribed = true;
	            var _unsubscribe = this._unsubscribe;
	            var _subscriptions = this._subscriptions;
	
	            this._subscriptions = null;
	            if ((0, _isFunction.isFunction)(_unsubscribe)) {
	                var trial = (0, _tryCatch.tryCatch)(_unsubscribe).call(this);
	                if (trial === _errorObject.errorObject) {
	                    hasErrors = true;
	                    (errors = errors || []).push(_errorObject.errorObject.e);
	                }
	            }
	            if ((0, _isArray.isArray)(_subscriptions)) {
	                var index = -1;
	                var len = _subscriptions.length;
	                while (++index < len) {
	                    var sub = _subscriptions[index];
	                    if ((0, _isObject.isObject)(sub)) {
	                        var _trial = (0, _tryCatch.tryCatch)(sub.unsubscribe).call(sub);
	                        if (_trial === _errorObject.errorObject) {
	                            hasErrors = true;
	                            errors = errors || [];
	                            var err = _errorObject.errorObject.e;
	                            if (err instanceof _UnsubscriptionError.UnsubscriptionError) {
	                                errors = errors.concat(err.errors);
	                            } else {
	                                errors.push(err);
	                            }
	                        }
	                    }
	                }
	            }
	            if (hasErrors) {
	                throw new _UnsubscriptionError.UnsubscriptionError(errors);
	            }
	        }
	        /**
	         * Adds a tear down to be called during the unsubscribe() of this
	         * Subscription.
	         *
	         * If the tear down being added is a subscription that is already
	         * unsubscribed, is the same reference `add` is being called on, or is
	         * `Subscription.EMPTY`, it will not be added.
	         *
	         * If this subscription is already in an `isUnsubscribed` state, the passed
	         * tear down logic will be executed immediately.
	         *
	         * @param {TeardownLogic} teardown The additional logic to execute on
	         * teardown.
	         * @return {Subscription} Returns the Subscription used or created to be
	         * added to the inner subscriptions list. This Subscription can be used with
	         * `remove()` to remove the passed teardown logic from the inner subscriptions
	         * list.
	         */
	
	    }, {
	        key: 'add',
	        value: function add(teardown) {
	            if (!teardown || teardown === this || teardown === Subscription.EMPTY) {
	                return;
	            }
	            var sub = teardown;
	            switch (typeof teardown === 'undefined' ? 'undefined' : _typeof(teardown)) {
	                case 'function':
	                    sub = new Subscription(teardown);
	                case 'object':
	                    if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
	                        break;
	                    } else if (this.isUnsubscribed) {
	                        sub.unsubscribe();
	                    } else {
	                        (this._subscriptions || (this._subscriptions = [])).push(sub);
	                    }
	                    break;
	                default:
	                    throw new Error('Unrecognized teardown ' + teardown + ' added to Subscription.');
	            }
	            return sub;
	        }
	        /**
	         * Removes a Subscription from the internal list of subscriptions that will
	         * unsubscribe during the unsubscribe process of this Subscription.
	         * @param {Subscription} subscription The subscription to remove.
	         * @return {void}
	         */
	
	    }, {
	        key: 'remove',
	        value: function remove(subscription) {
	            // HACK: This might be redundant because of the logic in `add()`
	            if (subscription == null || subscription === this || subscription === Subscription.EMPTY) {
	                return;
	            }
	            var subscriptions = this._subscriptions;
	            if (subscriptions) {
	                var subscriptionIndex = subscriptions.indexOf(subscription);
	                if (subscriptionIndex !== -1) {
	                    subscriptions.splice(subscriptionIndex, 1);
	                }
	            }
	        }
	    }]);
	
	    return Subscription;
	}();
	
	Subscription.EMPTY = function (empty) {
	    empty.isUnsubscribed = true;
	    return empty;
	}(new Subscription());
	//# sourceMappingURL=Subscription.js.map

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isArray = exports.isArray = Array.isArray || function (x) {
	  return x && typeof x.length === 'number';
	};
	//# sourceMappingURL=isArray.js.map

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.isObject = isObject;
	function isObject(x) {
	    return x != null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
	}
	//# sourceMappingURL=isObject.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.tryCatch = tryCatch;
	
	var _errorObject = __webpack_require__(14);
	
	var tryCatchTarget = void 0;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    } catch (e) {
	        _errorObject.errorObject.e = e;
	        return _errorObject.errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}
	;
	//# sourceMappingURL=tryCatch.js.map

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// typeof any so that it we don't have to cast when comparing a result to the error object
	var errorObject = exports.errorObject = { e: {} };
	//# sourceMappingURL=errorObject.js.map

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * An error thrown when one or more errors have occurred during the
	 * `unsubscribe` of a {@link Subscription}.
	 */
	
	var UnsubscriptionError = exports.UnsubscriptionError = function (_Error) {
	    _inherits(UnsubscriptionError, _Error);
	
	    function UnsubscriptionError(errors) {
	        _classCallCheck(this, UnsubscriptionError);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UnsubscriptionError).call(this));
	
	        _this.errors = errors;
	        var err = Error.call(_this, errors ? errors.length + ' errors occurred during unsubscription:\n  ' + errors.map(function (err, i) {
	            return i + 1 + ') ' + err.toString();
	        }).join('\n  ') : '');
	        _this.name = err.name = 'UnsubscriptionError';
	        _this.stack = err.stack;
	        _this.message = err.message;
	        return _this;
	    }
	
	    return UnsubscriptionError;
	}(Error);
	//# sourceMappingURL=UnsubscriptionError.js.map

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var empty = exports.empty = {
	    isUnsubscribed: true,
	    next: function next(value) {},
	    error: function error(err) {
	        throw err;
	    },
	    complete: function complete() {}
	};
	//# sourceMappingURL=Observer.js.map

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$$rxSubscriber = undefined;
	
	var _root = __webpack_require__(5);
	
	var _Symbol = _root.root.Symbol;
	var $$rxSubscriber = exports.$$rxSubscriber = typeof _Symbol === 'function' && typeof _Symbol.for === 'function' ? _Symbol.for('rxSubscriber') : '@@rxSubscriber';
	//# sourceMappingURL=rxSubscriber.js.map

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _ponyfill = __webpack_require__(20);
	
	var _ponyfill2 = _interopRequireDefault(_ponyfill);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var root = undefined; /* global window */
	
	if (typeof global !== 'undefined') {
		root = global;
	} else if (typeof window !== 'undefined') {
		root = window;
	}
	
	var result = (0, _ponyfill2.default)(root);
	exports.default = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;
	
		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BehaviorSubject = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Subject2 = __webpack_require__(22);
	
	var _throwError = __webpack_require__(25);
	
	var _ObjectUnsubscribedError = __webpack_require__(23);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * @class BehaviorSubject<T>
	 */
	
	var BehaviorSubject = exports.BehaviorSubject = function (_Subject) {
	    _inherits(BehaviorSubject, _Subject);
	
	    function BehaviorSubject(_value) {
	        _classCallCheck(this, BehaviorSubject);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BehaviorSubject).call(this));
	
	        _this._value = _value;
	        return _this;
	    }
	
	    _createClass(BehaviorSubject, [{
	        key: 'getValue',
	        value: function getValue() {
	            if (this.hasError) {
	                (0, _throwError.throwError)(this.thrownError);
	            } else if (this.isUnsubscribed) {
	                (0, _throwError.throwError)(new _ObjectUnsubscribedError.ObjectUnsubscribedError());
	            } else {
	                return this._value;
	            }
	        }
	    }, {
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var subscription = _get(Object.getPrototypeOf(BehaviorSubject.prototype), '_subscribe', this).call(this, subscriber);
	            if (subscription && !subscription.isUnsubscribed) {
	                subscriber.next(this._value);
	            }
	            return subscription;
	        }
	    }, {
	        key: 'next',
	        value: function next(value) {
	            _get(Object.getPrototypeOf(BehaviorSubject.prototype), 'next', this).call(this, this._value = value);
	        }
	    }, {
	        key: 'value',
	        get: function get() {
	            return this.getValue();
	        }
	    }]);

	    return BehaviorSubject;
	}(_Subject2.Subject);
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AnonymousSubject = exports.Subject = exports.SubjectSubscriber = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable2 = __webpack_require__(4);
	
	var _Subscriber2 = __webpack_require__(8);
	
	var _Subscription = __webpack_require__(10);
	
	var _ObjectUnsubscribedError = __webpack_require__(23);
	
	var _SubjectSubscription = __webpack_require__(24);
	
	var _rxSubscriber = __webpack_require__(17);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * @class SubjectSubscriber<T>
	 */
	
	var SubjectSubscriber = exports.SubjectSubscriber = function (_Subscriber) {
	    _inherits(SubjectSubscriber, _Subscriber);
	
	    function SubjectSubscriber(destination) {
	        _classCallCheck(this, SubjectSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SubjectSubscriber).call(this, destination));
	
	        _this.destination = destination;
	        return _this;
	    }
	
	    return SubjectSubscriber;
	}(_Subscriber2.Subscriber);
	/**
	 * @class Subject<T>
	 */
	
	
	var Subject = exports.Subject = function (_Observable) {
	    _inherits(Subject, _Observable);
	
	    function Subject() {
	        _classCallCheck(this, Subject);
	
	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Subject).call(this));
	
	        _this2.observers = [];
	        _this2.isUnsubscribed = false;
	        _this2.isStopped = false;
	        _this2.hasError = false;
	        _this2.thrownError = null;
	        return _this2;
	    }
	
	    _createClass(Subject, [{
	        key: _rxSubscriber.$$rxSubscriber,
	        value: function value() {
	            return new SubjectSubscriber(this);
	        }
	    }, {
	        key: 'lift',
	        value: function lift(operator) {
	            var subject = new AnonymousSubject(this, this);
	            subject.operator = operator;
	            return subject;
	        }
	    }, {
	        key: 'next',
	        value: function next(value) {
	            if (this.isUnsubscribed) {
	                throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
	            }
	            if (!this.isStopped) {
	                var observers = this.observers;
	
	                var len = observers.length;
	                var copy = observers.slice();
	                for (var i = 0; i < len; i++) {
	                    copy[i].next(value);
	                }
	            }
	        }
	    }, {
	        key: 'error',
	        value: function error(err) {
	            if (this.isUnsubscribed) {
	                throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
	            }
	            this.hasError = true;
	            this.thrownError = err;
	            this.isStopped = true;
	            var observers = this.observers;
	
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].error(err);
	            }
	            this.observers.length = 0;
	        }
	    }, {
	        key: 'complete',
	        value: function complete() {
	            if (this.isUnsubscribed) {
	                throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
	            }
	            this.isStopped = true;
	            var observers = this.observers;
	
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].complete();
	            }
	            this.observers.length = 0;
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe() {
	            this.isStopped = true;
	            this.isUnsubscribed = true;
	            this.observers = null;
	        }
	    }, {
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            if (this.isUnsubscribed) {
	                throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
	            } else if (this.hasError) {
	                subscriber.error(this.thrownError);
	                return _Subscription.Subscription.EMPTY;
	            } else if (this.isStopped) {
	                subscriber.complete();
	                return _Subscription.Subscription.EMPTY;
	            } else {
	                this.observers.push(subscriber);
	                return new _SubjectSubscription.SubjectSubscription(this, subscriber);
	            }
	        }
	    }, {
	        key: 'asObservable',
	        value: function asObservable() {
	            var observable = new _Observable2.Observable();
	            observable.source = this;
	            return observable;
	        }
	    }]);
	
	    return Subject;
	}(_Observable2.Observable);
	
	Subject.create = function (destination, source) {
	    return new AnonymousSubject(destination, source);
	};
	/**
	 * @class AnonymousSubject<T>
	 */
	
	var AnonymousSubject = exports.AnonymousSubject = function (_Subject) {
	    _inherits(AnonymousSubject, _Subject);
	
	    function AnonymousSubject(destination, source) {
	        _classCallCheck(this, AnonymousSubject);
	
	        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(AnonymousSubject).call(this));
	
	        _this3.destination = destination;
	        _this3.source = source;
	        return _this3;
	    }
	
	    _createClass(AnonymousSubject, [{
	        key: 'next',
	        value: function next(value) {
	            var destination = this.destination;
	
	            if (destination && destination.next) {
	                destination.next(value);
	            }
	        }
	    }, {
	        key: 'error',
	        value: function error(err) {
	            var destination = this.destination;
	
	            if (destination && destination.error) {
	                this.destination.error(err);
	            }
	        }
	    }, {
	        key: 'complete',
	        value: function complete() {
	            var destination = this.destination;
	
	            if (destination && destination.complete) {
	                this.destination.complete();
	            }
	        }
	    }, {
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var source = this.source;
	
	            if (source) {
	                return this.source.subscribe(subscriber);
	            } else {
	                return _Subscription.Subscription.EMPTY;
	            }
	        }
	    }]);
	
	    return AnonymousSubject;
	}(Subject);
	//# sourceMappingURL=Subject.js.map

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * An error thrown when an action is invalid because the object has been
	 * unsubscribed.
	 *
	 * @see {@link Subject}
	 * @see {@link BehaviorSubject}
	 *
	 * @class ObjectUnsubscribedError
	 */
	
	var ObjectUnsubscribedError = exports.ObjectUnsubscribedError = function (_Error) {
	    _inherits(ObjectUnsubscribedError, _Error);
	
	    function ObjectUnsubscribedError() {
	        var _this;
	
	        _classCallCheck(this, ObjectUnsubscribedError);
	
	        var err = (_this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectUnsubscribedError).call(this, 'object unsubscribed')), _this);
	        _this.name = err.name = 'ObjectUnsubscribedError';
	        _this.stack = err.stack;
	        _this.message = err.message;
	        return _this;
	    }
	
	    return ObjectUnsubscribedError;
	}(Error);
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SubjectSubscription = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Subscription2 = __webpack_require__(10);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var SubjectSubscription = exports.SubjectSubscription = function (_Subscription) {
	    _inherits(SubjectSubscription, _Subscription);
	
	    function SubjectSubscription(subject, subscriber) {
	        _classCallCheck(this, SubjectSubscription);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SubjectSubscription).call(this));
	
	        _this.subject = subject;
	        _this.subscriber = subscriber;
	        _this.isUnsubscribed = false;
	        return _this;
	    }
	
	    _createClass(SubjectSubscription, [{
	        key: 'unsubscribe',
	        value: function unsubscribe() {
	            if (this.isUnsubscribed) {
	                return;
	            }
	            this.isUnsubscribed = true;
	            var subject = this.subject;
	            var observers = subject.observers;
	            this.subject = null;
	            if (!observers || observers.length === 0 || subject.isStopped || subject.isUnsubscribed) {
	                return;
	            }
	            var subscriberIndex = observers.indexOf(this.subscriber);
	            if (subscriberIndex !== -1) {
	                observers.splice(subscriberIndex, 1);
	            }
	        }
	    }]);

	    return SubjectSubscription;
	}(_Subscription2.Subscription);
	//# sourceMappingURL=SubjectSubscription.js.map

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.throwError = throwError;
	function throwError(e) {
	  throw e;
	}
	//# sourceMappingURL=throwError.js.map

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _fromEvent = __webpack_require__(27);
	
	_Observable.Observable.fromEvent = _fromEvent.fromEvent;
	//# sourceMappingURL=fromEvent.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fromEvent = undefined;
	
	var _FromEventObservable = __webpack_require__(28);
	
	var fromEvent = exports.fromEvent = _FromEventObservable.FromEventObservable.create;
	//# sourceMappingURL=fromEvent.js.map

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FromEventObservable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable2 = __webpack_require__(4);
	
	var _tryCatch = __webpack_require__(13);
	
	var _errorObject = __webpack_require__(14);
	
	var _Subscription = __webpack_require__(10);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function isNodeStyleEventEmmitter(sourceObj) {
	    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
	}
	function isJQueryStyleEventEmitter(sourceObj) {
	    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
	}
	function isNodeList(sourceObj) {
	    return !!sourceObj && sourceObj.toString() === '[object NodeList]';
	}
	function isHTMLCollection(sourceObj) {
	    return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
	}
	function isEventTarget(sourceObj) {
	    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	
	var FromEventObservable = exports.FromEventObservable = function (_Observable) {
	    _inherits(FromEventObservable, _Observable);
	
	    function FromEventObservable(sourceObj, eventName, selector) {
	        _classCallCheck(this, FromEventObservable);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FromEventObservable).call(this));
	
	        _this.sourceObj = sourceObj;
	        _this.eventName = eventName;
	        _this.selector = selector;
	        return _this;
	    }
	    /**
	     * Creates an Observable that emits events of a specific type coming from the
	     * given event target.
	     *
	     * <span class="informal">Creates an Observable from DOM events, or Node
	     * EventEmitter events or others.</span>
	     *
	     * <img src="./img/fromEvent.png" width="100%">
	     *
	     * Creates an Observable by attaching an event listener to an "event target",
	     * which may be an object with `addEventListener` and `removeEventListener`,
	     * a Node.js EventEmitter, a jQuery style EventEmitter, a NodeList from the
	     * DOM, or an HTMLCollection from the DOM. The event handler is attached when
	     * the output Observable is subscribed, and removed when the Subscription is
	     * unsubscribed.
	     *
	     * @example <caption>Emits clicks happening on the DOM document</caption>
	     * var clicks = Rx.Observable.fromEvent(document, 'click');
	     * clicks.subscribe(x => console.log(x));
	     *
	     * @see {@link from}
	     * @see {@link fromEventPattern}
	     *
	     * @param {EventTargetLike} target The DOMElement, event target, Node.js
	     * EventEmitter, NodeList or HTMLCollection to attach the event handler to.
	     * @param {string} eventName The event name of interest, being emitted by the
	     * `target`.
	     * @param {function(...args: any): T} [selector] An optional function to
	     * post-process results. It takes the arguments from the event handler and
	     * should return a single value.
	     * @return {Observable<T>}
	     * @static true
	     * @name fromEvent
	     * @owner Observable
	     */
	
	
	    _createClass(FromEventObservable, [{
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var sourceObj = this.sourceObj;
	            var eventName = this.eventName;
	            var selector = this.selector;
	            var handler = selector ? function () {
	                var result = (0, _tryCatch.tryCatch)(selector).apply(undefined, arguments);
	                if (result === _errorObject.errorObject) {
	                    subscriber.error(_errorObject.errorObject.e);
	                } else {
	                    subscriber.next(result);
	                }
	            } : function (e) {
	                return subscriber.next(e);
	            };
	            FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber);
	        }
	    }], [{
	        key: 'create',
	        value: function create(target, eventName, selector) {
	            return new FromEventObservable(target, eventName, selector);
	        }
	    }, {
	        key: 'setupSubscription',
	        value: function setupSubscription(sourceObj, eventName, handler, subscriber) {
	            var unsubscribe = void 0;
	            if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
	                for (var i = 0, len = sourceObj.length; i < len; i++) {
	                    FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber);
	                }
	            } else if (isEventTarget(sourceObj)) {
	                (function () {
	                    var source = sourceObj;
	                    sourceObj.addEventListener(eventName, handler);
	                    unsubscribe = function unsubscribe() {
	                        return source.removeEventListener(eventName, handler);
	                    };
	                })();
	            } else if (isJQueryStyleEventEmitter(sourceObj)) {
	                (function () {
	                    var source = sourceObj;
	                    sourceObj.on(eventName, handler);
	                    unsubscribe = function unsubscribe() {
	                        return source.off(eventName, handler);
	                    };
	                })();
	            } else if (isNodeStyleEventEmmitter(sourceObj)) {
	                (function () {
	                    var source = sourceObj;
	                    sourceObj.addListener(eventName, handler);
	                    unsubscribe = function unsubscribe() {
	                        return source.removeListener(eventName, handler);
	                    };
	                })();
	            }
	            subscriber.add(new _Subscription.Subscription(unsubscribe));
	        }
	    }]);

	    return FromEventObservable;
	}(_Observable2.Observable);
	//# sourceMappingURL=FromEventObservable.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _do2 = __webpack_require__(30);
	
	_Observable.Observable.prototype.do = _do2._do;
	//# sourceMappingURL=do.js.map

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports._do = _do;
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Perform a side effect for every emission on the source Observable, but return
	 * an Observable that is identical to the source.
	 *
	 * <span class="informal">Intercepts each emission on the source and runs a
	 * function, but returns an output which is identical to the source.</span>
	 *
	 * <img src="./img/do.png" width="100%">
	 *
	 * Returns a mirrored Observable of the source Observable, but modified so that
	 * the provided Observer is called to perform a side effect for every value,
	 * error, and completion emitted by the source. Any errors that are thrown in
	 * the aforementioned Observer or handlers are safely sent down the error path
	 * of the output Observable.
	 *
	 * This operator is useful for debugging your Observables for the correct values
	 * or performing other side effects.
	 *
	 * Note: this is different to a `subscribe` on the Observable. If the Observable
	 * returned by `do` is not subscribed, the side effects specified by the
	 * Observer will never happen. `do` therefore simply spies on existing
	 * execution, it does not trigger an execution to happen like `subscribe` does.
	 *
	 * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var positions = clicks
	 *   .do(ev => console.log(ev))
	 *   .map(ev => ev.clientX);
	 * positions.subscribe(x => console.log(x));
	 *
	 * @see {@link map}
	 * @see {@link subscribe}
	 *
	 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
	 * callback for `next`.
	 * @param {function} [error] Callback for errors in the source.
	 * @param {function} [complete] Callback for the completion of the source.
	 * @return {Observable} An Observable identical to the source, but runs the
	 * specified Observer or callback(s) for each item.
	 * @method do
	 * @name do
	 * @owner Observable
	 */
	function _do(nextOrObserver, error, complete) {
	    return this.lift(new DoOperator(nextOrObserver, error, complete));
	}
	
	var DoOperator = function () {
	    function DoOperator(nextOrObserver, error, complete) {
	        _classCallCheck(this, DoOperator);
	
	        this.nextOrObserver = nextOrObserver;
	        this.error = error;
	        this.complete = complete;
	    }
	
	    _createClass(DoOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
	        }
	    }]);
	
	    return DoOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var DoSubscriber = function (_Subscriber) {
	    _inherits(DoSubscriber, _Subscriber);
	
	    function DoSubscriber(destination, nextOrObserver, error, complete) {
	        _classCallCheck(this, DoSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DoSubscriber).call(this, destination));
	
	        var safeSubscriber = new _Subscriber2.Subscriber(nextOrObserver, error, complete);
	        safeSubscriber.syncErrorThrowable = true;
	        _this.add(safeSubscriber);
	        _this.safeSubscriber = safeSubscriber;
	        return _this;
	    }
	
	    _createClass(DoSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            var safeSubscriber = this.safeSubscriber;
	
	            safeSubscriber.next(value);
	            if (safeSubscriber.syncErrorThrown) {
	                this.destination.error(safeSubscriber.syncErrorValue);
	            } else {
	                this.destination.next(value);
	            }
	        }
	    }, {
	        key: '_error',
	        value: function _error(err) {
	            var safeSubscriber = this.safeSubscriber;
	
	            safeSubscriber.error(err);
	            if (safeSubscriber.syncErrorThrown) {
	                this.destination.error(safeSubscriber.syncErrorValue);
	            } else {
	                this.destination.error(err);
	            }
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            var safeSubscriber = this.safeSubscriber;
	
	            safeSubscriber.complete();
	            if (safeSubscriber.syncErrorThrown) {
	                this.destination.error(safeSubscriber.syncErrorValue);
	            } else {
	                this.destination.complete();
	            }
	        }
	    }]);

	    return DoSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=do.js.map

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _mapTo = __webpack_require__(32);
	
	_Observable.Observable.prototype.mapTo = _mapTo.mapTo;
	//# sourceMappingURL=mapTo.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.mapTo = mapTo;
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Emits the given constant value on the output Observable every time the source
	 * Observable emits a value.
	 *
	 * <span class="informal">Like {@link map}, but it maps every source value to
	 * the same output value every time.</span>
	 *
	 * <img src="./img/mapTo.png" width="100%">
	 *
	 * Takes a constant `value` as argument, and emits that whenever the source
	 * Observable emits a value. In other words, ignores the actual source value,
	 * and simply uses the emission moment to know when to emit the given `value`.
	 *
	 * @example <caption>Map every every click to the string 'Hi'</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var greetings = clicks.mapTo('Hi');
	 * greetings.subscribe(x => console.log(x));
	 *
	 * @see {@link map}
	 *
	 * @param {any} value The value to map each source value to.
	 * @return {Observable} An Observable that emits the given `value` every time
	 * the source Observable emits something.
	 * @method mapTo
	 * @owner Observable
	 */
	function mapTo(value) {
	    return this.lift(new MapToOperator(value));
	}
	
	var MapToOperator = function () {
	    function MapToOperator(value) {
	        _classCallCheck(this, MapToOperator);
	
	        this.value = value;
	    }
	
	    _createClass(MapToOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new MapToSubscriber(subscriber, this.value));
	        }
	    }]);
	
	    return MapToOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var MapToSubscriber = function (_Subscriber) {
	    _inherits(MapToSubscriber, _Subscriber);
	
	    function MapToSubscriber(destination, value) {
	        _classCallCheck(this, MapToSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapToSubscriber).call(this, destination));
	
	        _this.value = value;
	        return _this;
	    }
	
	    _createClass(MapToSubscriber, [{
	        key: '_next',
	        value: function _next(x) {
	            this.destination.next(this.value);
	        }
	    }]);

	    return MapToSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=mapTo.js.map

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _filter = __webpack_require__(34);
	
	_Observable.Observable.prototype.filter = _filter.filter;
	//# sourceMappingURL=filter.js.map

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.filter = filter;
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Filter items emitted by the source Observable by only emitting those that
	 * satisfy a specified predicate.
	 *
	 * <span class="informal">Like
	 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * it only emits a value from the source if it passes a criterion function.</span>
	 *
	 * <img src="./img/filter.png" width="100%">
	 *
	 * Similar to the well-known `Array.prototype.filter` method, this operator
	 * takes values from the source Observable, passes them through a `predicate`
	 * function and only emits those values that yielded `true`.
	 *
	 * @example <caption>Emit only click events whose target was a DIV element</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
	 * clicksOnDivs.subscribe(x => console.log(x));
	 *
	 * @see {@link distinct}
	 * @see {@link distinctKey}
	 * @see {@link distinctUntilChanged}
	 * @see {@link distinctUntilKeyChanged}
	 * @see {@link ignoreElements}
	 * @see {@link partition}
	 * @see {@link skip}
	 *
	 * @param {function(value: T, index: number): boolean} predicate A function that
	 * evaluates each value emitted by the source Observable. If it returns `true`,
	 * the value is emitted, if `false` the value is not passed to the output
	 * Observable. The `index` parameter is the number `i` for the i-th source
	 * emission that has happened since the subscription, starting from the number
	 * `0`.
	 * @param {any} [thisArg] An optional argument to determine the value of `this`
	 * in the `predicate` function.
	 * @return {Observable} An Observable of values from the source that were
	 * allowed by the `predicate` function.
	 * @method filter
	 * @owner Observable
	 */
	function filter(predicate, thisArg) {
	    return this.lift(new FilterOperator(predicate, thisArg));
	}
	
	var FilterOperator = function () {
	    function FilterOperator(predicate, thisArg) {
	        _classCallCheck(this, FilterOperator);
	
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	    }
	
	    _createClass(FilterOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	        }
	    }]);
	
	    return FilterOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var FilterSubscriber = function (_Subscriber) {
	    _inherits(FilterSubscriber, _Subscriber);
	
	    function FilterSubscriber(destination, predicate, thisArg) {
	        _classCallCheck(this, FilterSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FilterSubscriber).call(this, destination));
	
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.count = 0;
	        _this.predicate = predicate;
	        return _this;
	    }
	    // the try catch block below is left specifically for
	    // optimization and perf reasons. a tryCatcher is not necessary here.
	
	
	    _createClass(FilterSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            var result = void 0;
	            try {
	                result = this.predicate.call(this.thisArg, value, this.count++);
	            } catch (err) {
	                this.destination.error(err);
	                return;
	            }
	            if (result) {
	                this.destination.next(value);
	            }
	        }
	    }]);

	    return FilterSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=filter.js.map

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newCmdBus$ = newCmdBus$;
	
	var _Subject = __webpack_require__(22);
	
	__webpack_require__(36);
	
	__webpack_require__(38);
	
	var _asap = __webpack_require__(45);
	
	var _async = __webpack_require__(54);
	
	function precondition(x, msg) {
	  if (!x) throw msg;
	} /*
	   # Command Bus
	  
	   Create a bus that receives and executes commands that transform
	   the state.
	  
	   Caller provides the current
	   state when creating the bus. The state must be a `Subject`--
	   or at least both an `Observer` and `Observable`. A `Rx.BehaviorSubject`
	   works quite well.
	  
	   Commands are identified with strings.
	  
	   Register listeners with `addListener`. Provide the name
	   of the command and a function. Only one command per name.
	   The listener itself should know how to project the
	   state given the current state and the command, ie.
	   ```
	   (state, cmd) => new state
	   ```
	  
	   The bus will listen for commands; each command generates
	   a new state. If it finds a matching command, it calls that
	   function to transform the state.
	   If there is no matching listener, then the same state is
	   returned. Hint: use `distinct` to ignore insignificant "changes",
	   including no-ops from missing listeners.
	  
	   Example:
	   If the state were an integer, this system would
	   increment and decrement:
	  
	   ```
	   const state$ = new Rx.BehaviorSubject(0)
	  
	   const bus$ = newCmdBus$(state$)
	   bus$.addListener('increment', x => x + 1)
	   bus$.addListener('decrement', x => x - 1)
	  
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
	   */
	
	function isFunction(x) {
	  return typeof x === 'function';
	}
	
	function newCmdBus$(state$) {
	  var cmdBus$ = new _Subject.Subject(_async.async);
	  var listeners = {};
	
	  cmdBus$.addListener = function (cmdName, fn) {
	    precondition(cmdName, 'Listeners require a command name');
	    precondition(isFunction(fn), 'Listeners require a projection function');
	    listeners[cmdName] = fn;
	  };
	
	  cmdBus$.on = cmdBus$.addListener; // alias
	
	  cmdBus$.map(function (cmd) {
	    return typeof cmd == 'string' ? { name: cmd } : cmd;
	  }).withLatestFrom(state$, function (cmd, state) {
	    var fn = listeners[cmd.name];
	    return fn ? fn(state, cmd) : state;
	  }).subscribe(state$);
	
	  cmdBus$.subscribe(function (v) {
	    console.log('cmdBus$next:', v);
	  }, function (v) {
	    console.log('cmdBus$error:', v);
	  }, function (v) {
	    console.log('cmdBus$complete:', v);
	  });
	
	  return cmdBus$;
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _map = __webpack_require__(37);
	
	_Observable.Observable.prototype.map = _map.map;
	//# sourceMappingURL=map.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.map = map;
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Applies a given `project` function to each value emitted by the source
	 * Observable, and emits the resulting values as an Observable.
	 *
	 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
	 * it passes each source value through a transformation function to get
	 * corresponding output values.</span>
	 *
	 * <img src="./img/map.png" width="100%">
	 *
	 * Similar to the well known `Array.prototype.map` function, this operator
	 * applies a projection to each value and emits that projection in the output
	 * Observable.
	 *
	 * @example <caption>Map every every click to the clientX position of that click</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var positions = clicks.map(ev => ev.clientX);
	 * positions.subscribe(x => console.log(x));
	 *
	 * @see {@link mapTo}
	 * @see {@link pluck}
	 *
	 * @param {function(value: T, index: number): R} project The function to apply
	 * to each `value` emitted by the source Observable. The `index` parameter is
	 * the number `i` for the i-th emission that has happened since the
	 * subscription, starting from the number `0`.
	 * @param {any} [thisArg] An optional argument to define what `this` is in the
	 * `project` function.
	 * @return {Observable<R>} An Observable that emits the values from the source
	 * Observable transformed by the given `project` function.
	 * @method map
	 * @owner Observable
	 */
	function map(project, thisArg) {
	    if (typeof project !== 'function') {
	        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	    }
	    return this.lift(new MapOperator(project, thisArg));
	}
	
	var MapOperator = function () {
	    function MapOperator(project, thisArg) {
	        _classCallCheck(this, MapOperator);
	
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	
	    _createClass(MapOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	        }
	    }]);
	
	    return MapOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var MapSubscriber = function (_Subscriber) {
	    _inherits(MapSubscriber, _Subscriber);
	
	    function MapSubscriber(destination, project, thisArg) {
	        _classCallCheck(this, MapSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapSubscriber).call(this, destination));
	
	        _this.project = project;
	        _this.count = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    // NOTE: This looks unoptimized, but it's actually purposefully NOT
	    // using try/catch optimizations.
	
	
	    _createClass(MapSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            var result = void 0;
	            try {
	                result = this.project.call(this.thisArg, value, this.count++);
	            } catch (err) {
	                this.destination.error(err);
	                return;
	            }
	            this.destination.next(result);
	        }
	    }]);

	    return MapSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=map.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _withLatestFrom = __webpack_require__(39);
	
	_Observable.Observable.prototype.withLatestFrom = _withLatestFrom.withLatestFrom;
	//# sourceMappingURL=withLatestFrom.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.withLatestFrom = withLatestFrom;
	
	var _OuterSubscriber2 = __webpack_require__(40);
	
	var _subscribeToResult = __webpack_require__(41);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Combines the source Observable with other Observables to create an Observable
	 * whose values are calculated from the latest values of each, only when the
	 * source emits.
	 *
	 * <span class="informal">Whenever the source Observable emits a value, it
	 * computes a formula using that value plus the latest values from other input
	 * Observables, then emits the output of that formula.</span>
	 *
	 * <img src="./img/withLatestFrom.png" width="100%">
	 *
	 * `withLatestFrom` combines each value from the source Observable (the
	 * instance) with the latest values from the other input Observables only when
	 * the source emits a value, optionally using a `project` function to determine
	 * the value to be emitted on the output Observable. All input Observables must
	 * emit at least one value before the output Observable will emit a value.
	 *
	 * @example <caption>On every click event, emit an array with the latest timer event plus the click event</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var timer = Rx.Observable.interval(1000);
	 * var result = clicks.withLatestFrom(timer);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link combineLatest}
	 *
	 * @param {Observable} other An input Observable to combine with the source
	 * Observable. More than one input Observables may be given as argument.
	 * @param {Function} [project] Projection function for combining values
	 * together. Receives all values in order of the Observables passed, where the
	 * first parameter is a value from the source Observable. (e.g.
	 * `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not
	 * passed, arrays will be emitted on the output Observable.
	 * @return {Observable} An Observable of projected values from the most recent
	 * values from each input Observable, or an array of the most recent values from
	 * each input Observable.
	 * @method withLatestFrom
	 * @owner Observable
	 */
	function withLatestFrom() {
	    var project = void 0;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	    }
	
	    if (typeof args[args.length - 1] === 'function') {
	        project = args.pop();
	    }
	    var observables = args;
	    return this.lift(new WithLatestFromOperator(observables, project));
	}
	/* tslint:enable:max-line-length */
	
	var WithLatestFromOperator = function () {
	    function WithLatestFromOperator(observables, project) {
	        _classCallCheck(this, WithLatestFromOperator);
	
	        this.observables = observables;
	        this.project = project;
	    }
	
	    _createClass(WithLatestFromOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
	        }
	    }]);
	
	    return WithLatestFromOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var WithLatestFromSubscriber = function (_OuterSubscriber) {
	    _inherits(WithLatestFromSubscriber, _OuterSubscriber);
	
	    function WithLatestFromSubscriber(destination, observables, project) {
	        _classCallCheck(this, WithLatestFromSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WithLatestFromSubscriber).call(this, destination));
	
	        _this.observables = observables;
	        _this.project = project;
	        _this.toRespond = [];
	        var len = observables.length;
	        _this.values = new Array(len);
	        for (var i = 0; i < len; i++) {
	            _this.toRespond.push(i);
	        }
	        for (var _i = 0; _i < len; _i++) {
	            var observable = observables[_i];
	            _this.add((0, _subscribeToResult.subscribeToResult)(_this, observable, observable, _i));
	        }
	        return _this;
	    }
	
	    _createClass(WithLatestFromSubscriber, [{
	        key: 'notifyNext',
	        value: function notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	            this.values[outerIndex] = innerValue;
	            var toRespond = this.toRespond;
	            if (toRespond.length > 0) {
	                var found = toRespond.indexOf(outerIndex);
	                if (found !== -1) {
	                    toRespond.splice(found, 1);
	                }
	            }
	        }
	    }, {
	        key: 'notifyComplete',
	        value: function notifyComplete() {
	            // noop
	        }
	    }, {
	        key: '_next',
	        value: function _next(value) {
	            if (this.toRespond.length === 0) {
	                var _args = [value].concat(_toConsumableArray(this.values));
	                if (this.project) {
	                    this._tryProject(_args);
	                } else {
	                    this.destination.next(_args);
	                }
	            }
	        }
	    }, {
	        key: '_tryProject',
	        value: function _tryProject(args) {
	            var result = void 0;
	            try {
	                result = this.project.apply(this, args);
	            } catch (err) {
	                this.destination.error(err);
	                return;
	            }
	            this.destination.next(result);
	        }
	    }]);

	    return WithLatestFromSubscriber;
	}(_OuterSubscriber2.OuterSubscriber);
	//# sourceMappingURL=withLatestFrom.js.map

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.OuterSubscriber = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var OuterSubscriber = exports.OuterSubscriber = function (_Subscriber) {
	    _inherits(OuterSubscriber, _Subscriber);
	
	    function OuterSubscriber() {
	        _classCallCheck(this, OuterSubscriber);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(OuterSubscriber).apply(this, arguments));
	    }
	
	    _createClass(OuterSubscriber, [{
	        key: 'notifyNext',
	        value: function notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	            this.destination.next(innerValue);
	        }
	    }, {
	        key: 'notifyError',
	        value: function notifyError(error, innerSub) {
	            this.destination.error(error);
	        }
	    }, {
	        key: 'notifyComplete',
	        value: function notifyComplete(innerSub) {
	            this.destination.complete();
	        }
	    }]);

	    return OuterSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=OuterSubscriber.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.subscribeToResult = subscribeToResult;
	
	var _root = __webpack_require__(5);
	
	var _isArray = __webpack_require__(11);
	
	var _isPromise = __webpack_require__(42);
	
	var _Observable = __webpack_require__(4);
	
	var _iterator2 = __webpack_require__(43);
	
	var _InnerSubscriber = __webpack_require__(44);
	
	var _symbolObservable = __webpack_require__(18);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	    var destination = new _InnerSubscriber.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    if (destination.isUnsubscribed) {
	        return;
	    }
	    if (result instanceof _Observable.Observable) {
	        if (result._isScalar) {
	            destination.next(result.value);
	            destination.complete();
	            return;
	        } else {
	            return result.subscribe(destination);
	        }
	    }
	    if ((0, _isArray.isArray)(result)) {
	        for (var i = 0, len = result.length; i < len && !destination.isUnsubscribed; i++) {
	            destination.next(result[i]);
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    } else if ((0, _isPromise.isPromise)(result)) {
	        result.then(function (value) {
	            if (!destination.isUnsubscribed) {
	                destination.next(value);
	                destination.complete();
	            }
	        }, function (err) {
	            return destination.error(err);
	        }).then(null, function (err) {
	            // Escaping the Promise trap: globally throw unhandled errors
	            _root.root.setTimeout(function () {
	                throw err;
	            });
	        });
	        return destination;
	    } else if (typeof result[_iterator2.$$iterator] === 'function') {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	            for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var item = _step.value;
	
	                destination.next(item);
	                if (destination.isUnsubscribed) {
	                    break;
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    } else if (typeof result[_symbolObservable2.default] === 'function') {
	        var obs = result[_symbolObservable2.default]();
	        if (typeof obs.subscribe !== 'function') {
	            destination.error('invalid observable');
	        } else {
	            return obs.subscribe(new _InnerSubscriber.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
	        }
	    } else {
	        destination.error(new TypeError('unknown type returned'));
	    }
	}
	//# sourceMappingURL=subscribeToResult.js.map

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isPromise = isPromise;
	function isPromise(value) {
	    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	//# sourceMappingURL=isPromise.js.map

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$$iterator = undefined;
	
	var _root = __webpack_require__(5);
	
	var $$iterator = exports.$$iterator = void 0;
	var _Symbol = _root.root.Symbol;
	if (typeof _Symbol === 'function') {
	    if (_Symbol.iterator) {
	        exports.$$iterator = $$iterator = _Symbol.iterator;
	    } else if (typeof _Symbol.for === 'function') {
	        exports.$$iterator = $$iterator = _Symbol.for('iterator');
	    }
	} else {
	    if (_root.root.Set && typeof new _root.root.Set()['@@iterator'] === 'function') {
	        // Bug for mozilla version
	        exports.$$iterator = $$iterator = '@@iterator';
	    } else if (_root.root.Map) {
	        // es6-shim specific logic
	        var keys = Object.getOwnPropertyNames(_root.root.Map.prototype);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (key !== 'entries' && key !== 'size' && _root.root.Map.prototype[key] === _root.root.Map.prototype['entries']) {
	                exports.$$iterator = $$iterator = key;
	                break;
	            }
	        }
	    } else {
	        exports.$$iterator = $$iterator = '@@iterator';
	    }
	}
	//# sourceMappingURL=iterator.js.map

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.InnerSubscriber = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var InnerSubscriber = exports.InnerSubscriber = function (_Subscriber) {
	    _inherits(InnerSubscriber, _Subscriber);
	
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        _classCallCheck(this, InnerSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InnerSubscriber).call(this));
	
	        _this.parent = parent;
	        _this.outerValue = outerValue;
	        _this.outerIndex = outerIndex;
	        _this.index = 0;
	        return _this;
	    }
	
	    _createClass(InnerSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	        }
	    }, {
	        key: '_error',
	        value: function _error(error) {
	            this.parent.notifyError(error, this);
	            this.unsubscribe();
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            this.parent.notifyComplete(this);
	            this.unsubscribe();
	        }
	    }]);

	    return InnerSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=InnerSubscriber.js.map

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.asap = undefined;
	
	var _AsapScheduler = __webpack_require__(46);
	
	var asap = exports.asap = new _AsapScheduler.AsapScheduler();
	//# sourceMappingURL=asap.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AsapScheduler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _AsapAction = __webpack_require__(47);
	
	var _QueueScheduler2 = __webpack_require__(52);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AsapScheduler = exports.AsapScheduler = function (_QueueScheduler) {
	    _inherits(AsapScheduler, _QueueScheduler);
	
	    function AsapScheduler() {
	        _classCallCheck(this, AsapScheduler);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(AsapScheduler).apply(this, arguments));
	    }
	
	    _createClass(AsapScheduler, [{
	        key: 'scheduleNow',
	        value: function scheduleNow(work, state) {
	            return new _AsapAction.AsapAction(this, work).schedule(state);
	        }
	    }]);

	    return AsapScheduler;
	}(_QueueScheduler2.QueueScheduler);
	//# sourceMappingURL=AsapScheduler.js.map

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AsapAction = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Immediate = __webpack_require__(48);
	
	var _FutureAction2 = __webpack_require__(51);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var AsapAction = exports.AsapAction = function (_FutureAction) {
	    _inherits(AsapAction, _FutureAction);
	
	    function AsapAction() {
	        _classCallCheck(this, AsapAction);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(AsapAction).apply(this, arguments));
	    }
	
	    _createClass(AsapAction, [{
	        key: '_schedule',
	        value: function _schedule(state) {
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            if (delay > 0) {
	                return _get(Object.getPrototypeOf(AsapAction.prototype), '_schedule', this).call(this, state, delay);
	            }
	            this.delay = delay;
	            this.state = state;
	            var scheduler = this.scheduler;
	
	            scheduler.actions.push(this);
	            if (!scheduler.scheduledId) {
	                scheduler.scheduledId = _Immediate.Immediate.setImmediate(function () {
	                    scheduler.scheduledId = null;
	                    scheduler.flush();
	                });
	            }
	            return this;
	        }
	    }, {
	        key: '_unsubscribe',
	        value: function _unsubscribe() {
	            var scheduler = this.scheduler;
	            var scheduledId = scheduler.scheduledId;
	            var actions = scheduler.actions;
	
	            _get(Object.getPrototypeOf(AsapAction.prototype), '_unsubscribe', this).call(this);
	            if (actions.length === 0) {
	                scheduler.active = false;
	                if (scheduledId != null) {
	                    scheduler.scheduledId = null;
	                    _Immediate.Immediate.clearImmediate(scheduledId);
	                }
	            }
	        }
	    }]);

	    return AsapAction;
	}(_FutureAction2.FutureAction);
	//# sourceMappingURL=AsapAction.js.map

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(clearImmediate, setImmediate) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Immediate = exports.ImmediateDefinition = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Some credit for this helper goes to http://github.com/YuzuJS/setImmediate
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */
	
	
	var _root = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ImmediateDefinition = exports.ImmediateDefinition = function () {
	    function ImmediateDefinition(root) {
	        _classCallCheck(this, ImmediateDefinition);
	
	        this.root = root;
	        if (root.setImmediate && typeof root.setImmediate === 'function') {
	            this.setImmediate = root.setImmediate.bind(root);
	            this.clearImmediate = root.clearImmediate.bind(root);
	        } else {
	            this.nextHandle = 1;
	            this.tasksByHandle = {};
	            this.currentlyRunningATask = false;
	            // Don't get fooled by e.g. browserify environments.
	            if (this.canUseProcessNextTick()) {
	                // For Node.js before 0.9
	                this.setImmediate = this.createProcessNextTickSetImmediate();
	            } else if (this.canUsePostMessage()) {
	                // For non-IE10 modern browsers
	                this.setImmediate = this.createPostMessageSetImmediate();
	            } else if (this.canUseMessageChannel()) {
	                // For web workers, where supported
	                this.setImmediate = this.createMessageChannelSetImmediate();
	            } else if (this.canUseReadyStateChange()) {
	                // For IE 6–8
	                this.setImmediate = this.createReadyStateChangeSetImmediate();
	            } else {
	                // For older browsers
	                this.setImmediate = this.createSetTimeoutSetImmediate();
	            }
	            var ci = function clearImmediate(handle) {
	                delete clearImmediate.instance.tasksByHandle[handle];
	            };
	            ci.instance = this;
	            this.clearImmediate = ci;
	        }
	    }
	
	    _createClass(ImmediateDefinition, [{
	        key: 'identify',
	        value: function identify(o) {
	            return this.root.Object.prototype.toString.call(o);
	        }
	    }, {
	        key: 'canUseProcessNextTick',
	        value: function canUseProcessNextTick() {
	            return this.identify(this.root.process) === '[object process]';
	        }
	    }, {
	        key: 'canUseMessageChannel',
	        value: function canUseMessageChannel() {
	            return Boolean(this.root.MessageChannel);
	        }
	    }, {
	        key: 'canUseReadyStateChange',
	        value: function canUseReadyStateChange() {
	            var document = this.root.document;
	            return Boolean(document && 'onreadystatechange' in document.createElement('script'));
	        }
	    }, {
	        key: 'canUsePostMessage',
	        value: function canUsePostMessage() {
	            var root = this.root;
	            // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	            // where `root.postMessage` means something completely different and can't be used for this purpose.
	            if (root.postMessage && !root.importScripts) {
	                var postMessageIsAsynchronous = true;
	                var oldOnMessage = root.onmessage;
	                root.onmessage = function () {
	                    postMessageIsAsynchronous = false;
	                };
	                root.postMessage('', '*');
	                root.onmessage = oldOnMessage;
	                return postMessageIsAsynchronous;
	            }
	            return false;
	        }
	        // This function accepts the same arguments as setImmediate, but
	        // returns a function that requires no arguments.
	
	    }, {
	        key: 'partiallyApplied',
	        value: function partiallyApplied(handler) {
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }
	
	            var fn = function result() {
	                var handler = result.handler;
	                var args = result.args;
	
	                if (typeof handler === 'function') {
	                    handler.apply(undefined, args);
	                } else {
	                    new Function('' + handler)();
	                }
	            };
	            fn.handler = handler;
	            fn.args = args;
	            return fn;
	        }
	    }, {
	        key: 'addFromSetImmediateArguments',
	        value: function addFromSetImmediateArguments(args) {
	            this.tasksByHandle[this.nextHandle] = this.partiallyApplied.apply(undefined, args);
	            return this.nextHandle++;
	        }
	    }, {
	        key: 'createProcessNextTickSetImmediate',
	        value: function createProcessNextTickSetImmediate() {
	            var fn = function setImmediate() {
	                var instance = setImmediate.instance;
	
	                var handle = instance.addFromSetImmediateArguments(arguments);
	                instance.root.process.nextTick(instance.partiallyApplied(instance.runIfPresent, handle));
	                return handle;
	            };
	            fn.instance = this;
	            return fn;
	        }
	    }, {
	        key: 'createPostMessageSetImmediate',
	        value: function createPostMessageSetImmediate() {
	            // Installs an event handler on `global` for the `message` event: see
	            // * https://developer.mozilla.org/en/DOM/window.postMessage
	            // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	            var root = this.root;
	            var messagePrefix = 'setImmediate$' + root.Math.random() + '$';
	            var onGlobalMessage = function globalMessageHandler(event) {
	                var instance = globalMessageHandler.instance;
	                if (event.source === root && typeof event.data === 'string' && event.data.indexOf(messagePrefix) === 0) {
	                    instance.runIfPresent(+event.data.slice(messagePrefix.length));
	                }
	            };
	            onGlobalMessage.instance = this;
	            root.addEventListener('message', onGlobalMessage, false);
	            var fn = function setImmediate() {
	                var messagePrefix = setImmediate.messagePrefix;
	                var instance = setImmediate.instance;
	
	                var handle = instance.addFromSetImmediateArguments(arguments);
	                instance.root.postMessage(messagePrefix + handle, '*');
	                return handle;
	            };
	            fn.instance = this;
	            fn.messagePrefix = messagePrefix;
	            return fn;
	        }
	    }, {
	        key: 'runIfPresent',
	        value: function runIfPresent(handle) {
	            // From the spec: 'Wait until any invocations of this algorithm started before this one have completed.'
	            // So if we're currently running a task, we'll need to delay this invocation.
	            if (this.currentlyRunningATask) {
	                // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	                // 'too much recursion' error.
	                this.root.setTimeout(this.partiallyApplied(this.runIfPresent, handle), 0);
	            } else {
	                var task = this.tasksByHandle[handle];
	                if (task) {
	                    this.currentlyRunningATask = true;
	                    try {
	                        task();
	                    } finally {
	                        this.clearImmediate(handle);
	                        this.currentlyRunningATask = false;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'createMessageChannelSetImmediate',
	        value: function createMessageChannelSetImmediate() {
	            var _this = this;
	
	            var channel = new this.root.MessageChannel();
	            channel.port1.onmessage = function (event) {
	                var handle = event.data;
	                _this.runIfPresent(handle);
	            };
	            var fn = function setImmediate() {
	                var channel = setImmediate.channel;
	                var instance = setImmediate.instance;
	
	                var handle = instance.addFromSetImmediateArguments(arguments);
	                channel.port2.postMessage(handle);
	                return handle;
	            };
	            fn.channel = channel;
	            fn.instance = this;
	            return fn;
	        }
	    }, {
	        key: 'createReadyStateChangeSetImmediate',
	        value: function createReadyStateChangeSetImmediate() {
	            var fn = function setImmediate() {
	                var instance = setImmediate.instance;
	                var root = instance.root;
	                var doc = root.document;
	                var html = doc.documentElement;
	                var handle = instance.addFromSetImmediateArguments(arguments);
	                // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	                // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	                var script = doc.createElement('script');
	                script.onreadystatechange = function () {
	                    instance.runIfPresent(handle);
	                    script.onreadystatechange = null;
	                    html.removeChild(script);
	                    script = null;
	                };
	                html.appendChild(script);
	                return handle;
	            };
	            fn.instance = this;
	            return fn;
	        }
	    }, {
	        key: 'createSetTimeoutSetImmediate',
	        value: function createSetTimeoutSetImmediate() {
	            var fn = function setImmediate() {
	                var instance = setImmediate.instance;
	                var handle = instance.addFromSetImmediateArguments(arguments);
	                instance.root.setTimeout(instance.partiallyApplied(instance.runIfPresent, handle), 0);
	                return handle;
	            };
	            fn.instance = this;
	            return fn;
	        }
	    }]);
	
	    return ImmediateDefinition;
	}();
	
	var Immediate = exports.Immediate = new ImmediateDefinition(_root.root);
	//# sourceMappingURL=Immediate.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49).clearImmediate, __webpack_require__(49).setImmediate))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(50).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49).setImmediate, __webpack_require__(49).clearImmediate))

/***/ },
/* 50 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FutureAction = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _root = __webpack_require__(5);
	
	var _Subscription2 = __webpack_require__(10);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var FutureAction = exports.FutureAction = function (_Subscription) {
	    _inherits(FutureAction, _Subscription);
	
	    function FutureAction(scheduler, work) {
	        _classCallCheck(this, FutureAction);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FutureAction).call(this));
	
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.pending = false;
	        return _this;
	    }
	
	    _createClass(FutureAction, [{
	        key: 'execute',
	        value: function execute() {
	            if (this.isUnsubscribed) {
	                this.error = new Error('executing a cancelled action');
	            } else {
	                try {
	                    this.work(this.state);
	                } catch (e) {
	                    this.unsubscribe();
	                    this.error = e;
	                }
	            }
	        }
	    }, {
	        key: 'schedule',
	        value: function schedule(state) {
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            if (this.isUnsubscribed) {
	                return this;
	            }
	            return this._schedule(state, delay);
	        }
	    }, {
	        key: '_schedule',
	        value: function _schedule(state) {
	            var _this2 = this;
	
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            // Always replace the current state with the new state.
	            this.state = state;
	            // Set the pending flag indicating that this action has been scheduled, or
	            // has recursively rescheduled itself.
	            this.pending = true;
	            var id = this.id;
	            // If this action has an intervalID and the specified delay matches the
	            // delay we used to create the intervalID, don't call `setInterval` again.
	            if (id != null && this.delay === delay) {
	                return this;
	            }
	            this.delay = delay;
	            // If this action has an intervalID, but was rescheduled with a different
	            // `delay` time, cancel the current intervalID and call `setInterval` with
	            // the new `delay` time.
	            if (id != null) {
	                this.id = null;
	                _root.root.clearInterval(id);
	            }
	            //
	            // Important implementation note:
	            //
	            // By default, FutureAction only executes once. However, Actions have the
	            // ability to be rescheduled from within the scheduled callback (mimicking
	            // recursion for asynchronous methods). This allows us to implement single
	            // and repeated actions with the same code path without adding API surface
	            // area, and implement tail-call optimization over asynchronous boundaries.
	            //
	            // However, JS runtimes make a distinction between intervals scheduled by
	            // repeatedly calling `setTimeout` vs. a single `setInterval` call, with
	            // the latter providing a better guarantee of precision.
	            //
	            // In order to accommodate both single and repeatedly rescheduled actions,
	            // use `setInterval` here for both cases. By default, the interval will be
	            // canceled after its first execution, or if the action schedules itself to
	            // run again with a different `delay` time.
	            //
	            // If the action recursively schedules itself to run again with the same
	            // `delay` time, the interval is not canceled, but allowed to loop again.
	            // The check of whether the interval should be canceled or not is run every
	            // time the interval is executed. The first time an action fails to
	            // reschedule itself, the interval is canceled.
	            //
	            this.id = _root.root.setInterval(function () {
	                _this2.pending = false;
	                var id = _this2.id;
	                var scheduler = _this2.scheduler;
	
	                scheduler.actions.push(_this2);
	                scheduler.flush();
	                //
	                // Terminate this interval if the action didn't reschedule itself.
	                // Don't call `this.unsubscribe()` here, because the action could be
	                // rescheduled later. For example:
	                //
	                // ```
	                // scheduler.schedule(function doWork(counter) {
	                //   /* ... I'm a busy worker bee ... */
	                //   var originalAction = this;
	                //   /* wait 100ms before rescheduling this action again */
	                //   setTimeout(function () {
	                //     originalAction.schedule(counter + 1);
	                //   }, 100);
	                // }, 1000);
	                // ```
	                if (_this2.pending === false && id != null) {
	                    _this2.id = null;
	                    _root.root.clearInterval(id);
	                }
	            }, delay);
	            return this;
	        }
	    }, {
	        key: '_unsubscribe',
	        value: function _unsubscribe() {
	            this.pending = false;
	            var id = this.id;
	            var scheduler = this.scheduler;
	            var actions = scheduler.actions;
	
	            var index = actions.indexOf(this);
	            if (id != null) {
	                this.id = null;
	                _root.root.clearInterval(id);
	            }
	            if (index !== -1) {
	                actions.splice(index, 1);
	            }
	            this.work = null;
	            this.state = null;
	            this.scheduler = null;
	        }
	    }]);

	    return FutureAction;
	}(_Subscription2.Subscription);
	//# sourceMappingURL=FutureAction.js.map

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.QueueScheduler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _QueueAction = __webpack_require__(53);
	
	var _FutureAction = __webpack_require__(51);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var QueueScheduler = exports.QueueScheduler = function () {
	    function QueueScheduler() {
	        _classCallCheck(this, QueueScheduler);
	
	        this.active = false;
	        this.actions = []; // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
	        this.scheduledId = null;
	    }
	
	    _createClass(QueueScheduler, [{
	        key: 'now',
	        value: function now() {
	            return Date.now();
	        }
	    }, {
	        key: 'flush',
	        value: function flush() {
	            if (this.active || this.scheduledId) {
	                return;
	            }
	            this.active = true;
	            var actions = this.actions;
	            // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
	            for (var action = null; action = actions.shift();) {
	                action.execute();
	                if (action.error) {
	                    this.active = false;
	                    throw action.error;
	                }
	            }
	            this.active = false;
	        }
	    }, {
	        key: 'schedule',
	        value: function schedule(work) {
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var state = arguments[2];
	
	            return delay <= 0 ? this.scheduleNow(work, state) : this.scheduleLater(work, delay, state);
	        }
	    }, {
	        key: 'scheduleNow',
	        value: function scheduleNow(work, state) {
	            return new _QueueAction.QueueAction(this, work).schedule(state);
	        }
	    }, {
	        key: 'scheduleLater',
	        value: function scheduleLater(work, delay, state) {
	            return new _FutureAction.FutureAction(this, work).schedule(state, delay);
	        }
	    }]);

	    return QueueScheduler;
	}();
	//# sourceMappingURL=QueueScheduler.js.map

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.QueueAction = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _FutureAction2 = __webpack_require__(51);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var QueueAction = exports.QueueAction = function (_FutureAction) {
	    _inherits(QueueAction, _FutureAction);
	
	    function QueueAction() {
	        _classCallCheck(this, QueueAction);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(QueueAction).apply(this, arguments));
	    }
	
	    _createClass(QueueAction, [{
	        key: '_schedule',
	        value: function _schedule(state) {
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            if (delay > 0) {
	                return _get(Object.getPrototypeOf(QueueAction.prototype), '_schedule', this).call(this, state, delay);
	            }
	            this.delay = delay;
	            this.state = state;
	            var scheduler = this.scheduler;
	            scheduler.actions.push(this);
	            scheduler.flush();
	            return this;
	        }
	    }]);

	    return QueueAction;
	}(_FutureAction2.FutureAction);
	//# sourceMappingURL=QueueAction.js.map

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.async = undefined;
	
	var _AsyncScheduler = __webpack_require__(55);
	
	var async = exports.async = new _AsyncScheduler.AsyncScheduler();
	//# sourceMappingURL=async.js.map

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AsyncScheduler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FutureAction = __webpack_require__(51);
	
	var _QueueScheduler2 = __webpack_require__(52);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AsyncScheduler = exports.AsyncScheduler = function (_QueueScheduler) {
	    _inherits(AsyncScheduler, _QueueScheduler);
	
	    function AsyncScheduler() {
	        _classCallCheck(this, AsyncScheduler);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(AsyncScheduler).apply(this, arguments));
	    }
	
	    _createClass(AsyncScheduler, [{
	        key: 'scheduleNow',
	        value: function scheduleNow(work, state) {
	            return new _FutureAction.FutureAction(this, work).schedule(state, 0);
	        }
	    }]);

	    return AsyncScheduler;
	}(_QueueScheduler2.QueueScheduler);
	//# sourceMappingURL=AsyncScheduler.js.map

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createTonalities = createTonalities;
	
	var _generators = __webpack_require__(57);
	
	var generators = _interopRequireWildcard(_generators);
	
	var _util = __webpack_require__(355);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function createTonalities() {
	  // equal tempered scale
	  var semitone = Math.pow(2, 1 / 12);
	  // ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
	
	  var semitoneAbove = function semitoneAbove(ν) {
	    return ν * semitone;
	  };
	  var majorSecondAbove = function majorSecondAbove(ν) {
	    return ν * semitone * semitone;
	  };
	  var minorThirdAbove = function minorThirdAbove(ν) {
	    return ν * Math.pow(semitone, 3);
	  };
	  var majorThirdAbove = function majorThirdAbove(ν) {
	    return ν * 5.0 / 4.0;
	  };
	  var perfectFourthAbove = function perfectFourthAbove(ν) {
	    return ν * 4.0 / 3.0;
	  };
	  var flatFiveAbove = function flatFiveAbove(ν) {
	    return ν * Math.pow(semitone, 6);
	  };
	  var perfectFifthAbove = function perfectFifthAbove(ν) {
	    return ν * 3.0 / 2.0;
	  };
	  var minorSixthAbove = function minorSixthAbove(ν) {
	    return ν * Math.pow(semitone, 8);
	  };
	  var majorSixthAbove = function majorSixthAbove(ν) {
	    return ν * Math.pow(semitone, 9);
	  };
	  var minorSeventhAbove = function minorSeventhAbove(ν) {
	    return ν * Math.pow(semitone, 10);
	  };
	  var majorSeventhAbove = function majorSeventhAbove(ν) {
	    return ν * Math.pow(semitone, 11);
	  };
	
	  function buildOctaves(lo, hi) {
	    var octaveIter = generators.doubleIter(lo);
	    var notes = generators.whileLessThan(octaveIter, hi);
	    return [].concat(_toConsumableArray(notes));
	  }
	
	  function buildRange(lo, hi) {
	    return [].concat(_toConsumableArray(generators.whileLessThan(generators.counterIter(lo), hi)));
	  }
	
	  // Give a name to the scale, and provide any number of
	  // functions to generate the notes above the tonic.
	  var buildTonality = function buildTonality() {
	    for (var _len = arguments.length, noteFns = Array(_len), _key = 0; _key < _len; _key++) {
	      noteFns[_key] = arguments[_key];
	    }
	
	    var all = [];
	    ν.octaves.forEach(function (a) {
	      all.push(a);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = noteFns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var f = _step.value;
	
	          all.push(f(a));
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    });
	    return all;
	  };
	
	  var ν = {
	    octaves: buildOctaves(110, 4000) // [110, 220, 440, 880, 1760, 3520]
	  };
	  ν['fifths'] = buildTonality(perfectFifthAbove);
	  ν['perfect'] = buildTonality(perfectFourthAbove, perfectFifthAbove);
	  ν['majorTriad'] = buildTonality(majorThirdAbove, perfectFifthAbove);
	  ν['major'] = buildTonality(majorSecondAbove, majorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, majorSeventhAbove);
	  ν['harmonicMinor'] = buildTonality(majorSecondAbove, minorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, minorSeventhAbove);
	  ν['blues'] = buildTonality(minorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSeventhAbove);
	  ν['chromatic'] = buildTonality(semitoneAbove, majorSecondAbove, minorThirdAbove, majorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSixthAbove, majorSixthAbove, minorSeventhAbove, majorSeventhAbove);
	
	  ν['continuous'] = buildRange(100, 4000);
	
	  var tonalityCalculator = function tonalityCalculator(tonalityName) {
	    return function (x) {
	      var s = ν[tonalityName];
	      return s[Math.floor((0, _util.Math_within)(x, 0, 1) * s.length)];
	    };
	  };
	
	  var fns = {};
	  for (var t in ν) {
	    fns[t] = tonalityCalculator(t);
	  }return fns;
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ownPropertiesIter = exports.whileLessThan = exports.takeWhile = exports.counterIter = exports.doubleIter = exports.iterateWith = undefined;
	
	__webpack_require__(58);
	
	var iterateWith = exports.iterateWith = function iterateWith(fn) {
	  return regeneratorRuntime.mark(function _callee(x) {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            if (false) {
	              _context.next = 6;
	              break;
	            }
	
	            _context.next = 3;
	            return x;
	
	          case 3:
	            x = fn(x);
	            _context.next = 0;
	            break;
	
	          case 6:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee, this);
	  });
	};
	
	// Starting with the given number, yields a number doubling each time.
	// Given a fn, returns an iterator that calls that function for each step
	// of an iteration.
	var doubleIter = exports.doubleIter = iterateWith(function (x) {
	  return x * 2;
	});
	
	// Starting with a given number, yields numbers increasing by ones
	var counterIter = exports.counterIter = iterateWith(function (x) {
	  return x + 1;
	});
	
	// Given an iterator and a function, yields iterator value until
	/// function returns false.
	var takeWhile = exports.takeWhile = regeneratorRuntime.mark(function takeWhile(it, fn) {
	  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;
	
	  return regeneratorRuntime.wrap(function takeWhile$(_context2) {
	    while (1) {
	      switch (_context2.prev = _context2.next) {
	        case 0:
	          _iteratorNormalCompletion = true;
	          _didIteratorError = false;
	          _iteratorError = undefined;
	          _context2.prev = 3;
	          _iterator = it[Symbol.iterator]();
	
	        case 5:
	          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	            _context2.next = 16;
	            break;
	          }
	
	          x = _step.value;
	
	          if (!fn(x)) {
	            _context2.next = 12;
	            break;
	          }
	
	          _context2.next = 10;
	          return x;
	
	        case 10:
	          _context2.next = 13;
	          break;
	
	        case 12:
	          return _context2.abrupt("return");
	
	        case 13:
	          _iteratorNormalCompletion = true;
	          _context2.next = 5;
	          break;
	
	        case 16:
	          _context2.next = 22;
	          break;
	
	        case 18:
	          _context2.prev = 18;
	          _context2.t0 = _context2["catch"](3);
	          _didIteratorError = true;
	          _iteratorError = _context2.t0;
	
	        case 22:
	          _context2.prev = 22;
	          _context2.prev = 23;
	
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	
	        case 25:
	          _context2.prev = 25;
	
	          if (!_didIteratorError) {
	            _context2.next = 28;
	            break;
	          }
	
	          throw _iteratorError;
	
	        case 28:
	          return _context2.finish(25);
	
	        case 29:
	          return _context2.finish(22);
	
	        case 30:
	        case "end":
	          return _context2.stop();
	      }
	    }
	  }, takeWhile, this, [[3, 18, 22, 30], [23,, 25, 29]]);
	});
	
	// Calls iterator until number is less than the max value provided.
	var whileLessThan = exports.whileLessThan = function whileLessThan(it, max) {
	  return takeWhile(it, function (x) {
	    return x < max;
	  });
	};
	
	var ownPropertiesIter = exports.ownPropertiesIter = function ownPropertiesIter(x) {
	  return regeneratorRuntime.mark(function _callee2() {
	    var p;
	    return regeneratorRuntime.wrap(function _callee2$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.t0 = regeneratorRuntime.keys(x);
	
	          case 1:
	            if ((_context3.t1 = _context3.t0()).done) {
	              _context3.next = 8;
	              break;
	            }
	
	            p = _context3.t1.value;
	
	            if (!x.hasOwnProperty(p)) {
	              _context3.next = 6;
	              break;
	            }
	
	            _context3.next = 6;
	            return p;
	
	          case 6:
	            _context3.next = 1;
	            break;
	
	          case 8:
	          case "end":
	            return _context3.stop();
	        }
	      }
	    }, _callee2, this);
	  });
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	__webpack_require__(59);
	
	__webpack_require__(351);
	
	__webpack_require__(352);
	
	/* eslint max-len: 0 */
	
	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;
	
	// Should be removed in the next major release:
	
	var DEFINE_PROPERTY = "defineProperty";
	function define(O, key, value) {
	  O[key] || Object[DEFINE_PROPERTY](O, key, {
	    writable: true,
	    configurable: true,
	    value: value
	  });
	}
	
	define(String.prototype, "padLeft", "".padStart);
	define(String.prototype, "padRight", "".padEnd);
	
	"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
	  [][key] && define(Array, key, Function.call.bind([][key]));
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	__webpack_require__(109);
	__webpack_require__(110);
	__webpack_require__(111);
	__webpack_require__(112);
	__webpack_require__(114);
	__webpack_require__(117);
	__webpack_require__(118);
	__webpack_require__(119);
	__webpack_require__(120);
	__webpack_require__(121);
	__webpack_require__(122);
	__webpack_require__(123);
	__webpack_require__(124);
	__webpack_require__(125);
	__webpack_require__(127);
	__webpack_require__(129);
	__webpack_require__(131);
	__webpack_require__(133);
	__webpack_require__(136);
	__webpack_require__(137);
	__webpack_require__(138);
	__webpack_require__(142);
	__webpack_require__(144);
	__webpack_require__(146);
	__webpack_require__(150);
	__webpack_require__(151);
	__webpack_require__(152);
	__webpack_require__(153);
	__webpack_require__(155);
	__webpack_require__(156);
	__webpack_require__(157);
	__webpack_require__(158);
	__webpack_require__(159);
	__webpack_require__(160);
	__webpack_require__(161);
	__webpack_require__(163);
	__webpack_require__(164);
	__webpack_require__(165);
	__webpack_require__(167);
	__webpack_require__(168);
	__webpack_require__(169);
	__webpack_require__(171);
	__webpack_require__(172);
	__webpack_require__(173);
	__webpack_require__(174);
	__webpack_require__(175);
	__webpack_require__(176);
	__webpack_require__(177);
	__webpack_require__(178);
	__webpack_require__(179);
	__webpack_require__(180);
	__webpack_require__(181);
	__webpack_require__(182);
	__webpack_require__(183);
	__webpack_require__(184);
	__webpack_require__(189);
	__webpack_require__(190);
	__webpack_require__(194);
	__webpack_require__(195);
	__webpack_require__(196);
	__webpack_require__(197);
	__webpack_require__(199);
	__webpack_require__(200);
	__webpack_require__(201);
	__webpack_require__(202);
	__webpack_require__(203);
	__webpack_require__(204);
	__webpack_require__(205);
	__webpack_require__(206);
	__webpack_require__(207);
	__webpack_require__(208);
	__webpack_require__(209);
	__webpack_require__(210);
	__webpack_require__(211);
	__webpack_require__(212);
	__webpack_require__(213);
	__webpack_require__(214);
	__webpack_require__(215);
	__webpack_require__(217);
	__webpack_require__(218);
	__webpack_require__(224);
	__webpack_require__(225);
	__webpack_require__(227);
	__webpack_require__(228);
	__webpack_require__(229);
	__webpack_require__(233);
	__webpack_require__(234);
	__webpack_require__(235);
	__webpack_require__(236);
	__webpack_require__(237);
	__webpack_require__(239);
	__webpack_require__(240);
	__webpack_require__(241);
	__webpack_require__(242);
	__webpack_require__(245);
	__webpack_require__(247);
	__webpack_require__(248);
	__webpack_require__(249);
	__webpack_require__(251);
	__webpack_require__(253);
	__webpack_require__(255);
	__webpack_require__(256);
	__webpack_require__(257);
	__webpack_require__(259);
	__webpack_require__(260);
	__webpack_require__(261);
	__webpack_require__(262);
	__webpack_require__(268);
	__webpack_require__(271);
	__webpack_require__(272);
	__webpack_require__(274);
	__webpack_require__(275);
	__webpack_require__(278);
	__webpack_require__(279);
	__webpack_require__(282);
	__webpack_require__(283);
	__webpack_require__(284);
	__webpack_require__(285);
	__webpack_require__(286);
	__webpack_require__(287);
	__webpack_require__(288);
	__webpack_require__(289);
	__webpack_require__(290);
	__webpack_require__(291);
	__webpack_require__(292);
	__webpack_require__(293);
	__webpack_require__(294);
	__webpack_require__(295);
	__webpack_require__(296);
	__webpack_require__(297);
	__webpack_require__(298);
	__webpack_require__(299);
	__webpack_require__(300);
	__webpack_require__(302);
	__webpack_require__(303);
	__webpack_require__(304);
	__webpack_require__(305);
	__webpack_require__(306);
	__webpack_require__(307);
	__webpack_require__(309);
	__webpack_require__(310);
	__webpack_require__(311);
	__webpack_require__(312);
	__webpack_require__(313);
	__webpack_require__(314);
	__webpack_require__(315);
	__webpack_require__(316);
	__webpack_require__(318);
	__webpack_require__(319);
	__webpack_require__(321);
	__webpack_require__(322);
	__webpack_require__(323);
	__webpack_require__(324);
	__webpack_require__(327);
	__webpack_require__(328);
	__webpack_require__(329);
	__webpack_require__(330);
	__webpack_require__(331);
	__webpack_require__(332);
	__webpack_require__(333);
	__webpack_require__(334);
	__webpack_require__(336);
	__webpack_require__(337);
	__webpack_require__(338);
	__webpack_require__(339);
	__webpack_require__(340);
	__webpack_require__(341);
	__webpack_require__(342);
	__webpack_require__(343);
	__webpack_require__(344);
	__webpack_require__(345);
	__webpack_require__(346);
	__webpack_require__(349);
	__webpack_require__(350);
	module.exports = __webpack_require__(66);

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(61)
	  , has            = __webpack_require__(62)
	  , DESCRIPTORS    = __webpack_require__(63)
	  , $export        = __webpack_require__(65)
	  , redefine       = __webpack_require__(75)
	  , META           = __webpack_require__(79).KEY
	  , $fails         = __webpack_require__(64)
	  , shared         = __webpack_require__(80)
	  , setToStringTag = __webpack_require__(81)
	  , uid            = __webpack_require__(76)
	  , wks            = __webpack_require__(82)
	  , wksExt         = __webpack_require__(83)
	  , wksDefine      = __webpack_require__(84)
	  , keyOf          = __webpack_require__(86)
	  , enumKeys       = __webpack_require__(99)
	  , isArray        = __webpack_require__(102)
	  , anObject       = __webpack_require__(69)
	  , toIObject      = __webpack_require__(89)
	  , toPrimitive    = __webpack_require__(73)
	  , createDesc     = __webpack_require__(74)
	  , _create        = __webpack_require__(103)
	  , gOPNExt        = __webpack_require__(106)
	  , $GOPD          = __webpack_require__(108)
	  , $DP            = __webpack_require__(68)
	  , $keys          = __webpack_require__(87)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(107).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(101).f  = $propertyIsEnumerable;
	  __webpack_require__(100).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(85)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(67)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 61 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 62 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(64)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(61)
	  , core      = __webpack_require__(66)
	  , hide      = __webpack_require__(67)
	  , redefine  = __webpack_require__(75)
	  , ctx       = __webpack_require__(77)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 66 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(68)
	  , createDesc = __webpack_require__(74);
	module.exports = __webpack_require__(63) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(69)
	  , IE8_DOM_DEFINE = __webpack_require__(71)
	  , toPrimitive    = __webpack_require__(73)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(63) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(70);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(63) && !__webpack_require__(64)(function(){
	  return Object.defineProperty(__webpack_require__(72)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(70)
	  , document = __webpack_require__(61).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(70);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(61)
	  , hide      = __webpack_require__(67)
	  , has       = __webpack_require__(62)
	  , SRC       = __webpack_require__(76)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);
	
	__webpack_require__(66).inspectSource = function(it){
	  return $toString.call(it);
	};
	
	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 76 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(78);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(76)('meta')
	  , isObject = __webpack_require__(70)
	  , has      = __webpack_require__(62)
	  , setDesc  = __webpack_require__(68).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(64)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(61)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(68).f
	  , has = __webpack_require__(62)
	  , TAG = __webpack_require__(82)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(80)('wks')
	  , uid        = __webpack_require__(76)
	  , Symbol     = __webpack_require__(61).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(82);

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(61)
	  , core           = __webpack_require__(66)
	  , LIBRARY        = __webpack_require__(85)
	  , wksExt         = __webpack_require__(83)
	  , defineProperty = __webpack_require__(68).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = false;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(87)
	  , toIObject = __webpack_require__(89);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(88)
	  , enumBugKeys = __webpack_require__(98);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(62)
	  , toIObject    = __webpack_require__(89)
	  , arrayIndexOf = __webpack_require__(93)(false)
	  , IE_PROTO     = __webpack_require__(97)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(90)
	  , defined = __webpack_require__(92);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(91);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 91 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(89)
	  , toLength  = __webpack_require__(94)
	  , toIndex   = __webpack_require__(96);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(95)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(95)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(80)('keys')
	  , uid    = __webpack_require__(76);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(87)
	  , gOPS    = __webpack_require__(100)
	  , pIE     = __webpack_require__(101);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 100 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 101 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(91);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(69)
	  , dPs         = __webpack_require__(104)
	  , enumBugKeys = __webpack_require__(98)
	  , IE_PROTO    = __webpack_require__(97)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(72)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(105).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(68)
	  , anObject = __webpack_require__(69)
	  , getKeys  = __webpack_require__(87);
	
	module.exports = __webpack_require__(63) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(61).document && document.documentElement;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(89)
	  , gOPN      = __webpack_require__(107).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(88)
	  , hiddenKeys = __webpack_require__(98).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(101)
	  , createDesc     = __webpack_require__(74)
	  , toIObject      = __webpack_require__(89)
	  , toPrimitive    = __webpack_require__(73)
	  , has            = __webpack_require__(62)
	  , IE8_DOM_DEFINE = __webpack_require__(71)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(63) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(103)});

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(63), 'Object', {defineProperty: __webpack_require__(68).f});

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(63), 'Object', {defineProperties: __webpack_require__(104)});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(89)
	  , $getOwnPropertyDescriptor = __webpack_require__(108).f;
	
	__webpack_require__(113)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(65)
	  , core    = __webpack_require__(66)
	  , fails   = __webpack_require__(64);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(115)
	  , $getPrototypeOf = __webpack_require__(116);
	
	__webpack_require__(113)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(92);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(62)
	  , toObject    = __webpack_require__(115)
	  , IE_PROTO    = __webpack_require__(97)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(115)
	  , $keys    = __webpack_require__(87);
	
	__webpack_require__(113)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(113)('getOwnPropertyNames', function(){
	  return __webpack_require__(106).f;
	});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(70)
	  , meta     = __webpack_require__(79).onFreeze;
	
	__webpack_require__(113)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(70)
	  , meta     = __webpack_require__(79).onFreeze;
	
	__webpack_require__(113)('seal', function($seal){
	  return function seal(it){
	    return $seal && isObject(it) ? $seal(meta(it)) : it;
	  };
	});

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(70)
	  , meta     = __webpack_require__(79).onFreeze;
	
	__webpack_require__(113)('preventExtensions', function($preventExtensions){
	  return function preventExtensions(it){
	    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
	  };
	});

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(70);
	
	__webpack_require__(113)('isFrozen', function($isFrozen){
	  return function isFrozen(it){
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.13 Object.isSealed(O)
	var isObject = __webpack_require__(70);
	
	__webpack_require__(113)('isSealed', function($isSealed){
	  return function isSealed(it){
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(70);
	
	__webpack_require__(113)('isExtensible', function($isExtensible){
	  return function isExtensible(it){
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(65);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(126)});

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(87)
	  , gOPS     = __webpack_require__(100)
	  , pIE      = __webpack_require__(101)
	  , toObject = __webpack_require__(115)
	  , IObject  = __webpack_require__(90)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(64)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(65);
	$export($export.S, 'Object', {is: __webpack_require__(128)});

/***/ },
/* 128 */
/***/ function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(65);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(130).set});

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(70)
	  , anObject = __webpack_require__(69);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(77)(Function.call, __webpack_require__(108).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(132)
	  , test    = {};
	test[__webpack_require__(82)('toStringTag')] = 'z';
	if(test + '' != '[object z]'){
	  __webpack_require__(75)(Object.prototype, 'toString', function toString(){
	    return '[object ' + classof(this) + ']';
	  }, true);
	}

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(91)
	  , TAG = __webpack_require__(82)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	var $export = __webpack_require__(65);
	
	$export($export.P, 'Function', {bind: __webpack_require__(134)});

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var aFunction  = __webpack_require__(78)
	  , isObject   = __webpack_require__(70)
	  , invoke     = __webpack_require__(135)
	  , arraySlice = [].slice
	  , factories  = {};
	
	var construct = function(F, len, args){
	  if(!(len in factories)){
	    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
	    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  } return factories[len](F, args);
	};
	
	module.exports = Function.bind || function bind(that /*, args... */){
	  var fn       = aFunction(this)
	    , partArgs = arraySlice.call(arguments, 1);
	  var bound = function(/* args... */){
	    var args = partArgs.concat(arraySlice.call(arguments));
	    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
	  };
	  if(isObject(fn.prototype))bound.prototype = fn.prototype;
	  return bound;
	};

/***/ },
/* 135 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(68).f
	  , createDesc = __webpack_require__(74)
	  , has        = __webpack_require__(62)
	  , FProto     = Function.prototype
	  , nameRE     = /^\s*function ([^ (]*)/
	  , NAME       = 'name';
	
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	
	// 19.2.4.2 name
	NAME in FProto || __webpack_require__(63) && dP(FProto, NAME, {
	  configurable: true,
	  get: function(){
	    try {
	      var that = this
	        , name = ('' + that).match(nameRE)[1];
	      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
	      return name;
	    } catch(e){
	      return '';
	    }
	  }
	});

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var isObject       = __webpack_require__(70)
	  , getPrototypeOf = __webpack_require__(116)
	  , HAS_INSTANCE   = __webpack_require__(82)('hasInstance')
	  , FunctionProto  = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if(!(HAS_INSTANCE in FunctionProto))__webpack_require__(68).f(FunctionProto, HAS_INSTANCE, {value: function(O){
	  if(typeof this != 'function' || !isObject(O))return false;
	  if(!isObject(this.prototype))return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
	  return false;
	}});

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var $export   = __webpack_require__(65)
	  , $parseInt = __webpack_require__(139);
	// 18.2.5 parseInt(string, radix)
	$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var $parseInt = __webpack_require__(61).parseInt
	  , $trim     = __webpack_require__(140).trim
	  , ws        = __webpack_require__(141)
	  , hex       = /^[\-+]?0[xX]/;
	
	module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
	  var string = $trim(String(str), 3);
	  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
	} : $parseInt;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65)
	  , defined = __webpack_require__(92)
	  , fails   = __webpack_require__(64)
	  , spaces  = __webpack_require__(141)
	  , space   = '[' + spaces + ']'
	  , non     = '\u200b\u0085'
	  , ltrim   = RegExp('^' + space + space + '*')
	  , rtrim   = RegExp(space + space + '*$');
	
	var exporter = function(KEY, exec, ALIAS){
	  var exp   = {};
	  var FORCE = fails(function(){
	    return !!spaces[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
	  if(ALIAS)exp[ALIAS] = fn;
	  $export($export.P + $export.F * FORCE, 'String', exp);
	};
	
	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function(string, TYPE){
	  string = String(defined(string));
	  if(TYPE & 1)string = string.replace(ltrim, '');
	  if(TYPE & 2)string = string.replace(rtrim, '');
	  return string;
	};
	
	module.exports = exporter;

/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var $export     = __webpack_require__(65)
	  , $parseFloat = __webpack_require__(143);
	// 18.2.4 parseFloat(string)
	$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var $parseFloat = __webpack_require__(61).parseFloat
	  , $trim       = __webpack_require__(140).trim;
	
	module.exports = 1 / $parseFloat(__webpack_require__(141) + '-0') !== -Infinity ? function parseFloat(str){
	  var string = $trim(String(str), 3)
	    , result = $parseFloat(string);
	  return result === 0 && string.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global            = __webpack_require__(61)
	  , has               = __webpack_require__(62)
	  , cof               = __webpack_require__(91)
	  , inheritIfRequired = __webpack_require__(145)
	  , toPrimitive       = __webpack_require__(73)
	  , fails             = __webpack_require__(64)
	  , gOPN              = __webpack_require__(107).f
	  , gOPD              = __webpack_require__(108).f
	  , dP                = __webpack_require__(68).f
	  , $trim             = __webpack_require__(140).trim
	  , NUMBER            = 'Number'
	  , $Number           = global[NUMBER]
	  , Base              = $Number
	  , proto             = $Number.prototype
	  // Opera ~12 has broken Object#toString
	  , BROKEN_COF        = cof(__webpack_require__(103)(proto)) == NUMBER
	  , TRIM              = 'trim' in String.prototype;
	
	// 7.1.3 ToNumber(argument)
	var toNumber = function(argument){
	  var it = toPrimitive(argument, false);
	  if(typeof it == 'string' && it.length > 2){
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0)
	      , third, radix, maxCode;
	    if(first === 43 || first === 45){
	      third = it.charCodeAt(2);
	      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if(first === 48){
	      switch(it.charCodeAt(1)){
	        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default : return +it;
	      }
	      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if(code < 48 || code > maxCode)return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};
	
	if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
	  $Number = function Number(value){
	    var it = arguments.length < 1 ? 0 : value
	      , that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
	        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for(var keys = __webpack_require__(63) ? gOPN(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys.length > j; j++){
	    if(has(Base, key = keys[j]) && !has($Number, key)){
	      dP($Number, key, gOPD(Base, key));
	    }
	  }
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  __webpack_require__(75)(global, NUMBER, $Number);
	}

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	var isObject       = __webpack_require__(70)
	  , setPrototypeOf = __webpack_require__(130).set;
	module.exports = function(that, target, C){
	  var P, S = target.constructor;
	  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
	    setPrototypeOf(that, P);
	  } return that;
	};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export      = __webpack_require__(65)
	  , anInstance   = __webpack_require__(147)
	  , toInteger    = __webpack_require__(95)
	  , aNumberValue = __webpack_require__(148)
	  , repeat       = __webpack_require__(149)
	  , $toFixed     = 1..toFixed
	  , floor        = Math.floor
	  , data         = [0, 0, 0, 0, 0, 0]
	  , ERROR        = 'Number.toFixed: incorrect invocation!'
	  , ZERO         = '0';
	
	var multiply = function(n, c){
	  var i  = -1
	    , c2 = c;
	  while(++i < 6){
	    c2 += n * data[i];
	    data[i] = c2 % 1e7;
	    c2 = floor(c2 / 1e7);
	  }
	};
	var divide = function(n){
	  var i = 6
	    , c = 0;
	  while(--i >= 0){
	    c += data[i];
	    data[i] = floor(c / n);
	    c = (c % n) * 1e7;
	  }
	};
	var numToString = function(){
	  var i = 6
	    , s = '';
	  while(--i >= 0){
	    if(s !== '' || i === 0 || data[i] !== 0){
	      var t = String(data[i]);
	      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
	    }
	  } return s;
	};
	var pow = function(x, n, acc){
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};
	var log = function(x){
	  var n  = 0
	    , x2 = x;
	  while(x2 >= 4096){
	    n += 12;
	    x2 /= 4096;
	  }
	  while(x2 >= 2){
	    n  += 1;
	    x2 /= 2;
	  } return n;
	};
	
	$export($export.P + $export.F * (!!$toFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128..toFixed(0) !== '1000000000000000128'
	) || !__webpack_require__(64)(function(){
	  // V8 ~ Android 4.3-
	  $toFixed.call({});
	})), 'Number', {
	  toFixed: function toFixed(fractionDigits){
	    var x = aNumberValue(this, ERROR)
	      , f = toInteger(fractionDigits)
	      , s = ''
	      , m = ZERO
	      , e, z, j, k;
	    if(f < 0 || f > 20)throw RangeError(ERROR);
	    if(x != x)return 'NaN';
	    if(x <= -1e21 || x >= 1e21)return String(x);
	    if(x < 0){
	      s = '-';
	      x = -x;
	    }
	    if(x > 1e-21){
	      e = log(x * pow(2, 69, 1)) - 69;
	      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if(e > 0){
	        multiply(0, z);
	        j = f;
	        while(j >= 7){
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while(j >= 23){
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        m = numToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        m = numToString() + repeat.call(ZERO, f);
	      }
	    }
	    if(f > 0){
	      k = m.length;
	      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
	    } else {
	      m = s + m;
	    } return m;
	  }
	});

/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var cof = __webpack_require__(91);
	module.exports = function(it, msg){
	  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
	  return +it;
	};

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(95)
	  , defined   = __webpack_require__(92);
	
	module.exports = function repeat(count){
	  var str = String(defined(this))
	    , res = ''
	    , n   = toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export      = __webpack_require__(65)
	  , $fails       = __webpack_require__(64)
	  , aNumberValue = __webpack_require__(148)
	  , $toPrecision = 1..toPrecision;
	
	$export($export.P + $export.F * ($fails(function(){
	  // IE7-
	  return $toPrecision.call(1, undefined) !== '1';
	}) || !$fails(function(){
	  // V8 ~ Android 4.3-
	  $toPrecision.call({});
	})), 'Number', {
	  toPrecision: function toPrecision(precision){
	    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
	    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
	  }
	});

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.1 Number.EPSILON
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.2 Number.isFinite(number)
	var $export   = __webpack_require__(65)
	  , _isFinite = __webpack_require__(61).isFinite;
	
	$export($export.S, 'Number', {
	  isFinite: function isFinite(it){
	    return typeof it == 'number' && _isFinite(it);
	  }
	});

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Number', {isInteger: __webpack_require__(154)});

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(70)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.4 Number.isNaN(number)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Number', {
	  isNaN: function isNaN(number){
	    return number != number;
	  }
	});

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export   = __webpack_require__(65)
	  , isInteger = __webpack_require__(154)
	  , abs       = Math.abs;
	
	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number){
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.6 Number.MAX_SAFE_INTEGER
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.10 Number.MIN_SAFE_INTEGER
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var $export     = __webpack_require__(65)
	  , $parseFloat = __webpack_require__(143);
	// 20.1.2.12 Number.parseFloat(string)
	$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	var $export   = __webpack_require__(65)
	  , $parseInt = __webpack_require__(139);
	// 20.1.2.13 Number.parseInt(string, radix)
	$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.3 Math.acosh(x)
	var $export = __webpack_require__(65)
	  , log1p   = __webpack_require__(162)
	  , sqrt    = Math.sqrt
	  , $acosh  = Math.acosh;
	
	$export($export.S + $export.F * !($acosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  && Math.floor($acosh(Number.MAX_VALUE)) == 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
	  && $acosh(Infinity) == Infinity
	), 'Math', {
	  acosh: function acosh(x){
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? Math.log(x) + Math.LN2
	      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});

/***/ },
/* 162 */
/***/ function(module, exports) {

	// 20.2.2.20 Math.log1p(x)
	module.exports = Math.log1p || function log1p(x){
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.5 Math.asinh(x)
	var $export = __webpack_require__(65)
	  , $asinh  = Math.asinh;
	
	function asinh(x){
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
	}
	
	// Tor Browser bug: Math.asinh(0) -> -0 
	$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.7 Math.atanh(x)
	var $export = __webpack_require__(65)
	  , $atanh  = Math.atanh;
	
	// Tor Browser bug: Math.atanh(-0) -> 0 
	$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
	  atanh: function atanh(x){
	    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
	  }
	});

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.9 Math.cbrt(x)
	var $export = __webpack_require__(65)
	  , sign    = __webpack_require__(166);
	
	$export($export.S, 'Math', {
	  cbrt: function cbrt(x){
	    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});

/***/ },
/* 166 */
/***/ function(module, exports) {

	// 20.2.2.28 Math.sign(x)
	module.exports = Math.sign || function sign(x){
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.11 Math.clz32(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  clz32: function clz32(x){
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.12 Math.cosh(x)
	var $export = __webpack_require__(65)
	  , exp     = Math.exp;
	
	$export($export.S, 'Math', {
	  cosh: function cosh(x){
	    return (exp(x = +x) + exp(-x)) / 2;
	  }
	});

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.14 Math.expm1(x)
	var $export = __webpack_require__(65)
	  , $expm1  = __webpack_require__(170);
	
	$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});

/***/ },
/* 170 */
/***/ function(module, exports) {

	// 20.2.2.14 Math.expm1(x)
	var $expm1 = Math.expm1;
	module.exports = (!$expm1
	  // Old FF bug
	  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || $expm1(-2e-17) != -2e-17
	) ? function expm1(x){
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
	} : $expm1;

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var $export   = __webpack_require__(65)
	  , sign      = __webpack_require__(166)
	  , pow       = Math.pow
	  , EPSILON   = pow(2, -52)
	  , EPSILON32 = pow(2, -23)
	  , MAX32     = pow(2, 127) * (2 - EPSILON32)
	  , MIN32     = pow(2, -126);
	
	var roundTiesToEven = function(n){
	  return n + 1 / EPSILON - 1 / EPSILON;
	};
	
	
	$export($export.S, 'Math', {
	  fround: function fround(x){
	    var $abs  = Math.abs(x)
	      , $sign = sign(x)
	      , a, result;
	    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	    a = (1 + EPSILON32 / EPSILON) * $abs;
	    result = a - (a - $abs);
	    if(result > MAX32 || result != result)return $sign * Infinity;
	    return $sign * result;
	  }
	});

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	var $export = __webpack_require__(65)
	  , abs     = Math.abs;
	
	$export($export.S, 'Math', {
	  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
	    var sum  = 0
	      , i    = 0
	      , aLen = arguments.length
	      , larg = 0
	      , arg, div;
	    while(i < aLen){
	      arg = abs(arguments[i++]);
	      if(larg < arg){
	        div  = larg / arg;
	        sum  = sum * div * div + 1;
	        larg = arg;
	      } else if(arg > 0){
	        div  = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.18 Math.imul(x, y)
	var $export = __webpack_require__(65)
	  , $imul   = Math.imul;
	
	// some WebKit versions fails with big numbers, some has wrong arity
	$export($export.S + $export.F * __webpack_require__(64)(function(){
	  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
	}), 'Math', {
	  imul: function imul(x, y){
	    var UINT16 = 0xffff
	      , xn = +x
	      , yn = +y
	      , xl = UINT16 & xn
	      , yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.21 Math.log10(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  log10: function log10(x){
	    return Math.log(x) / Math.LN10;
	  }
	});

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.20 Math.log1p(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {log1p: __webpack_require__(162)});

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.22 Math.log2(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  log2: function log2(x){
	    return Math.log(x) / Math.LN2;
	  }
	});

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.28 Math.sign(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {sign: __webpack_require__(166)});

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.30 Math.sinh(x)
	var $export = __webpack_require__(65)
	  , expm1   = __webpack_require__(170)
	  , exp     = Math.exp;
	
	// V8 near Chromium 38 has a problem with very small numbers
	$export($export.S + $export.F * __webpack_require__(64)(function(){
	  return !Math.sinh(-2e-17) != -2e-17;
	}), 'Math', {
	  sinh: function sinh(x){
	    return Math.abs(x = +x) < 1
	      ? (expm1(x) - expm1(-x)) / 2
	      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
	  }
	});

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.33 Math.tanh(x)
	var $export = __webpack_require__(65)
	  , expm1   = __webpack_require__(170)
	  , exp     = Math.exp;
	
	$export($export.S, 'Math', {
	  tanh: function tanh(x){
	    var a = expm1(x = +x)
	      , b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.34 Math.trunc(x)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  trunc: function trunc(it){
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	var $export        = __webpack_require__(65)
	  , toIndex        = __webpack_require__(96)
	  , fromCharCode   = String.fromCharCode
	  , $fromCodePoint = String.fromCodePoint;
	
	// length should be 1, old FF problem
	$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
	    var res  = []
	      , aLen = arguments.length
	      , i    = 0
	      , code;
	    while(aLen > i){
	      code = +arguments[i++];
	      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	var $export   = __webpack_require__(65)
	  , toIObject = __webpack_require__(89)
	  , toLength  = __webpack_require__(94);
	
	$export($export.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite){
	    var tpl  = toIObject(callSite.raw)
	      , len  = toLength(tpl.length)
	      , aLen = arguments.length
	      , res  = []
	      , i    = 0;
	    while(len > i){
	      res.push(String(tpl[i++]));
	      if(i < aLen)res.push(String(arguments[i]));
	    } return res.join('');
	  }
	});

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.1.3.25 String.prototype.trim()
	__webpack_require__(140)('trim', function($trim){
	  return function trim(){
	    return $trim(this, 3);
	  };
	});

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(185)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(186)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(95)
	  , defined   = __webpack_require__(92);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(85)
	  , $export        = __webpack_require__(65)
	  , redefine       = __webpack_require__(75)
	  , hide           = __webpack_require__(67)
	  , has            = __webpack_require__(62)
	  , Iterators      = __webpack_require__(187)
	  , $iterCreate    = __webpack_require__(188)
	  , setToStringTag = __webpack_require__(81)
	  , getPrototypeOf = __webpack_require__(116)
	  , ITERATOR       = __webpack_require__(82)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 187 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(103)
	  , descriptor     = __webpack_require__(74)
	  , setToStringTag = __webpack_require__(81)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(67)(IteratorPrototype, __webpack_require__(82)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $at     = __webpack_require__(185)(false);
	$export($export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	'use strict';
	var $export   = __webpack_require__(65)
	  , toLength  = __webpack_require__(94)
	  , context   = __webpack_require__(191)
	  , ENDS_WITH = 'endsWith'
	  , $endsWith = ''[ENDS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(193)(ENDS_WITH), 'String', {
	  endsWith: function endsWith(searchString /*, endPosition = @length */){
	    var that = context(this, searchString, ENDS_WITH)
	      , endPosition = arguments.length > 1 ? arguments[1] : undefined
	      , len    = toLength(that.length)
	      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
	      , search = String(searchString);
	    return $endsWith
	      ? $endsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	// helper for String#{startsWith, endsWith, includes}
	var isRegExp = __webpack_require__(192)
	  , defined  = __webpack_require__(92);
	
	module.exports = function(that, searchString, NAME){
	  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(defined(that));
	};

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.8 IsRegExp(argument)
	var isObject = __webpack_require__(70)
	  , cof      = __webpack_require__(91)
	  , MATCH    = __webpack_require__(82)('match');
	module.exports = function(it){
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
	};

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	var MATCH = __webpack_require__(82)('match');
	module.exports = function(KEY){
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch(e){
	    try {
	      re[MATCH] = false;
	      return !'/./'[KEY](re);
	    } catch(f){ /* empty */ }
	  } return true;
	};

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.7 String.prototype.includes(searchString, position = 0)
	'use strict';
	var $export  = __webpack_require__(65)
	  , context  = __webpack_require__(191)
	  , INCLUDES = 'includes';
	
	$export($export.P + $export.F * __webpack_require__(193)(INCLUDES), 'String', {
	  includes: function includes(searchString /*, position = 0 */){
	    return !!~context(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65);
	
	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(149)
	});

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	'use strict';
	var $export     = __webpack_require__(65)
	  , toLength    = __webpack_require__(94)
	  , context     = __webpack_require__(191)
	  , STARTS_WITH = 'startsWith'
	  , $startsWith = ''[STARTS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(193)(STARTS_WITH), 'String', {
	  startsWith: function startsWith(searchString /*, position = 0 */){
	    var that   = context(this, searchString, STARTS_WITH)
	      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
	      , search = String(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.2 String.prototype.anchor(name)
	__webpack_require__(198)('anchor', function(createHTML){
	  return function anchor(name){
	    return createHTML(this, 'a', 'name', name);
	  }
	});

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65)
	  , fails   = __webpack_require__(64)
	  , defined = __webpack_require__(92)
	  , quot    = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function(string, tag, attribute, value) {
	  var S  = String(defined(string))
	    , p1 = '<' + tag;
	  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	module.exports = function(NAME, exec){
	  var O = {};
	  O[NAME] = exec(createHTML);
	  $export($export.P + $export.F * fails(function(){
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.3 String.prototype.big()
	__webpack_require__(198)('big', function(createHTML){
	  return function big(){
	    return createHTML(this, 'big', '', '');
	  }
	});

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.4 String.prototype.blink()
	__webpack_require__(198)('blink', function(createHTML){
	  return function blink(){
	    return createHTML(this, 'blink', '', '');
	  }
	});

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.5 String.prototype.bold()
	__webpack_require__(198)('bold', function(createHTML){
	  return function bold(){
	    return createHTML(this, 'b', '', '');
	  }
	});

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.6 String.prototype.fixed()
	__webpack_require__(198)('fixed', function(createHTML){
	  return function fixed(){
	    return createHTML(this, 'tt', '', '');
	  }
	});

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.7 String.prototype.fontcolor(color)
	__webpack_require__(198)('fontcolor', function(createHTML){
	  return function fontcolor(color){
	    return createHTML(this, 'font', 'color', color);
	  }
	});

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.8 String.prototype.fontsize(size)
	__webpack_require__(198)('fontsize', function(createHTML){
	  return function fontsize(size){
	    return createHTML(this, 'font', 'size', size);
	  }
	});

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.9 String.prototype.italics()
	__webpack_require__(198)('italics', function(createHTML){
	  return function italics(){
	    return createHTML(this, 'i', '', '');
	  }
	});

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.10 String.prototype.link(url)
	__webpack_require__(198)('link', function(createHTML){
	  return function link(url){
	    return createHTML(this, 'a', 'href', url);
	  }
	});

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.11 String.prototype.small()
	__webpack_require__(198)('small', function(createHTML){
	  return function small(){
	    return createHTML(this, 'small', '', '');
	  }
	});

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.12 String.prototype.strike()
	__webpack_require__(198)('strike', function(createHTML){
	  return function strike(){
	    return createHTML(this, 'strike', '', '');
	  }
	});

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.13 String.prototype.sub()
	__webpack_require__(198)('sub', function(createHTML){
	  return function sub(){
	    return createHTML(this, 'sub', '', '');
	  }
	});

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.14 String.prototype.sup()
	__webpack_require__(198)('sup', function(createHTML){
	  return function sup(){
	    return createHTML(this, 'sup', '', '');
	  }
	});

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	// 20.3.3.1 / 15.9.4.4 Date.now()
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export     = __webpack_require__(65)
	  , toObject    = __webpack_require__(115)
	  , toPrimitive = __webpack_require__(73);
	
	$export($export.P + $export.F * __webpack_require__(64)(function(){
	  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
	}), 'Date', {
	  toJSON: function toJSON(key){
	    var O  = toObject(this)
	      , pv = toPrimitive(O);
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	var $export = __webpack_require__(65)
	  , fails   = __webpack_require__(64)
	  , getTime = Date.prototype.getTime;
	
	var lz = function(num){
	  return num > 9 ? num : '0' + num;
	};
	
	// PhantomJS / old WebKit has a broken implementations
	$export($export.P + $export.F * (fails(function(){
	  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
	}) || !fails(function(){
	  new Date(NaN).toISOString();
	})), 'Date', {
	  toISOString: function toISOString(){
	    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
	    var d = this
	      , y = d.getUTCFullYear()
	      , m = d.getUTCMilliseconds()
	      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
	    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	  }
	});

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	var DateProto    = Date.prototype
	  , INVALID_DATE = 'Invalid Date'
	  , TO_STRING    = 'toString'
	  , $toString    = DateProto[TO_STRING]
	  , getTime      = DateProto.getTime;
	if(new Date(NaN) + '' != INVALID_DATE){
	  __webpack_require__(75)(DateProto, TO_STRING, function toString(){
	    var value = getTime.call(this);
	    return value === value ? $toString.call(this) : INVALID_DATE;
	  });
	}

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	var TO_PRIMITIVE = __webpack_require__(82)('toPrimitive')
	  , proto        = Date.prototype;
	
	if(!(TO_PRIMITIVE in proto))__webpack_require__(67)(proto, TO_PRIMITIVE, __webpack_require__(216));

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var anObject    = __webpack_require__(69)
	  , toPrimitive = __webpack_require__(73)
	  , NUMBER      = 'number';
	
	module.exports = function(hint){
	  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
	  return toPrimitive(anObject(this), hint != NUMBER);
	};

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Array', {isArray: __webpack_require__(102)});

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(77)
	  , $export        = __webpack_require__(65)
	  , toObject       = __webpack_require__(115)
	  , call           = __webpack_require__(219)
	  , isArrayIter    = __webpack_require__(220)
	  , toLength       = __webpack_require__(94)
	  , createProperty = __webpack_require__(221)
	  , getIterFn      = __webpack_require__(222);
	
	$export($export.S + $export.F * !__webpack_require__(223)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(69);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(187)
	  , ITERATOR   = __webpack_require__(82)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(68)
	  , createDesc      = __webpack_require__(74);
	
	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(132)
	  , ITERATOR  = __webpack_require__(82)('iterator')
	  , Iterators = __webpack_require__(187);
	module.exports = __webpack_require__(66).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(82)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export        = __webpack_require__(65)
	  , createProperty = __webpack_require__(221);
	
	// WebKit Array.of isn't generic
	$export($export.S + $export.F * __webpack_require__(64)(function(){
	  function F(){}
	  return !(Array.of.call(F) instanceof F);
	}), 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of(/* ...args */){
	    var index  = 0
	      , aLen   = arguments.length
	      , result = new (typeof this == 'function' ? this : Array)(aLen);
	    while(aLen > index)createProperty(result, index, arguments[index++]);
	    result.length = aLen;
	    return result;
	  }
	});

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.13 Array.prototype.join(separator)
	var $export   = __webpack_require__(65)
	  , toIObject = __webpack_require__(89)
	  , arrayJoin = [].join;
	
	// fallback for not array-like strings
	$export($export.P + $export.F * (__webpack_require__(90) != Object || !__webpack_require__(226)(arrayJoin)), 'Array', {
	  join: function join(separator){
	    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
	  }
	});

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	var fails = __webpack_require__(64);
	
	module.exports = function(method, arg){
	  return !!method && fails(function(){
	    arg ? method.call(null, function(){}, 1) : method.call(null);
	  });
	};

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export    = __webpack_require__(65)
	  , html       = __webpack_require__(105)
	  , cof        = __webpack_require__(91)
	  , toIndex    = __webpack_require__(96)
	  , toLength   = __webpack_require__(94)
	  , arraySlice = [].slice;
	
	// fallback for not array-like ES3 strings and DOM objects
	$export($export.P + $export.F * __webpack_require__(64)(function(){
	  if(html)arraySlice.call(html);
	}), 'Array', {
	  slice: function slice(begin, end){
	    var len   = toLength(this.length)
	      , klass = cof(this);
	    end = end === undefined ? len : end;
	    if(klass == 'Array')return arraySlice.call(this, begin, end);
	    var start  = toIndex(begin, len)
	      , upTo   = toIndex(end, len)
	      , size   = toLength(upTo - start)
	      , cloned = Array(size)
	      , i      = 0;
	    for(; i < size; i++)cloned[i] = klass == 'String'
	      ? this.charAt(start + i)
	      : this[start + i];
	    return cloned;
	  }
	});

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export   = __webpack_require__(65)
	  , aFunction = __webpack_require__(78)
	  , toObject  = __webpack_require__(115)
	  , fails     = __webpack_require__(64)
	  , $sort     = [].sort
	  , test      = [1, 2, 3];
	
	$export($export.P + $export.F * (fails(function(){
	  // IE8-
	  test.sort(undefined);
	}) || !fails(function(){
	  // V8 bug
	  test.sort(null);
	  // Old WebKit
	}) || !__webpack_require__(226)($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn){
	    return comparefn === undefined
	      ? $sort.call(toObject(this))
	      : $sort.call(toObject(this), aFunction(comparefn));
	  }
	});

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export  = __webpack_require__(65)
	  , $forEach = __webpack_require__(230)(0)
	  , STRICT   = __webpack_require__(226)([].forEach, true);
	
	$export($export.P + $export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */){
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(77)
	  , IObject  = __webpack_require__(90)
	  , toObject = __webpack_require__(115)
	  , toLength = __webpack_require__(94)
	  , asc      = __webpack_require__(231);
	module.exports = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || asc;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(232);
	
	module.exports = function(original, length){
	  return new (speciesConstructor(original))(length);
	};

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(70)
	  , isArray  = __webpack_require__(102)
	  , SPECIES  = __webpack_require__(82)('species');
	
	module.exports = function(original){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $map    = __webpack_require__(230)(1);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */){
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $filter = __webpack_require__(230)(2);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */){
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $some   = __webpack_require__(230)(3);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].some, true), 'Array', {
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn /* , thisArg */){
	    return $some(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $every  = __webpack_require__(230)(4);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].every, true), 'Array', {
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn /* , thisArg */){
	    return $every(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $reduce = __webpack_require__(238);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */){
	    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	var aFunction = __webpack_require__(78)
	  , toObject  = __webpack_require__(115)
	  , IObject   = __webpack_require__(90)
	  , toLength  = __webpack_require__(94);
	
	module.exports = function(that, callbackfn, aLen, memo, isRight){
	  aFunction(callbackfn);
	  var O      = toObject(that)
	    , self   = IObject(O)
	    , length = toLength(O.length)
	    , index  = isRight ? length - 1 : 0
	    , i      = isRight ? -1 : 1;
	  if(aLen < 2)for(;;){
	    if(index in self){
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if(isRight ? index < 0 : length <= index){
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
	    memo = callbackfn(memo, self[index], index, O);
	  }
	  return memo;
	};

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(65)
	  , $reduce = __webpack_require__(238);
	
	$export($export.P + $export.F * !__webpack_require__(226)([].reduceRight, true), 'Array', {
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: function reduceRight(callbackfn /* , initialValue */){
	    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
	  }
	});

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export       = __webpack_require__(65)
	  , $indexOf      = __webpack_require__(93)(false)
	  , $native       = [].indexOf
	  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;
	
	$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(226)($native)), 'Array', {
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? $native.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments[1]);
	  }
	});

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export       = __webpack_require__(65)
	  , toIObject     = __webpack_require__(89)
	  , toInteger     = __webpack_require__(95)
	  , toLength      = __webpack_require__(94)
	  , $native       = [].lastIndexOf
	  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;
	
	$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(226)($native)), 'Array', {
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
	    // convert -0 to +0
	    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
	    var O      = toIObject(this)
	      , length = toLength(O.length)
	      , index  = length - 1;
	    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
	    if(index < 0)index = length + index;
	    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
	    return -1;
	  }
	});

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	var $export = __webpack_require__(65);
	
	$export($export.P, 'Array', {copyWithin: __webpack_require__(243)});
	
	__webpack_require__(244)('copyWithin');

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	'use strict';
	var toObject = __webpack_require__(115)
	  , toIndex  = __webpack_require__(96)
	  , toLength = __webpack_require__(94);
	
	module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
	  var O     = toObject(this)
	    , len   = toLength(O.length)
	    , to    = toIndex(target, len)
	    , from  = toIndex(start, len)
	    , end   = arguments.length > 2 ? arguments[2] : undefined
	    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
	    , inc   = 1;
	  if(from < to && to < from + count){
	    inc  = -1;
	    from += count - 1;
	    to   += count - 1;
	  }
	  while(count-- > 0){
	    if(from in O)O[to] = O[from];
	    else delete O[to];
	    to   += inc;
	    from += inc;
	  } return O;
	};

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = __webpack_require__(82)('unscopables')
	  , ArrayProto  = Array.prototype;
	if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(67)(ArrayProto, UNSCOPABLES, {});
	module.exports = function(key){
	  ArrayProto[UNSCOPABLES][key] = true;
	};

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	var $export = __webpack_require__(65);
	
	$export($export.P, 'Array', {fill: __webpack_require__(246)});
	
	__webpack_require__(244)('fill');

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	'use strict';
	var toObject = __webpack_require__(115)
	  , toIndex  = __webpack_require__(96)
	  , toLength = __webpack_require__(94);
	module.exports = function fill(value /*, start = 0, end = @length */){
	  var O      = toObject(this)
	    , length = toLength(O.length)
	    , aLen   = arguments.length
	    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
	    , end    = aLen > 2 ? arguments[2] : undefined
	    , endPos = end === undefined ? length : toIndex(end, length);
	  while(endPos > index)O[index++] = value;
	  return O;
	};

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	var $export = __webpack_require__(65)
	  , $find   = __webpack_require__(230)(5)
	  , KEY     = 'find'
	  , forced  = true;
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  find: function find(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(244)(KEY);

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	var $export = __webpack_require__(65)
	  , $find   = __webpack_require__(230)(6)
	  , KEY     = 'findIndex'
	  , forced  = true;
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  findIndex: function findIndex(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(244)(KEY);

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(250)('Array');

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(61)
	  , dP          = __webpack_require__(68)
	  , DESCRIPTORS = __webpack_require__(63)
	  , SPECIES     = __webpack_require__(82)('species');
	
	module.exports = function(KEY){
	  var C = global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(244)
	  , step             = __webpack_require__(252)
	  , Iterators        = __webpack_require__(187)
	  , toIObject        = __webpack_require__(89);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(186)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 252 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	var global            = __webpack_require__(61)
	  , inheritIfRequired = __webpack_require__(145)
	  , dP                = __webpack_require__(68).f
	  , gOPN              = __webpack_require__(107).f
	  , isRegExp          = __webpack_require__(192)
	  , $flags            = __webpack_require__(254)
	  , $RegExp           = global.RegExp
	  , Base              = $RegExp
	  , proto             = $RegExp.prototype
	  , re1               = /a/g
	  , re2               = /a/g
	  // "new" creates a new object, old webkit buggy here
	  , CORRECT_NEW       = new $RegExp(re1) !== re1;
	
	if(__webpack_require__(63) && (!CORRECT_NEW || __webpack_require__(64)(function(){
	  re2[__webpack_require__(82)('match')] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))){
	  $RegExp = function RegExp(p, f){
	    var tiRE = this instanceof $RegExp
	      , piRE = isRegExp(p)
	      , fiU  = f === undefined;
	    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
	      : inheritIfRequired(CORRECT_NEW
	        ? new Base(piRE && !fiU ? p.source : p, f)
	        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
	      , tiRE ? this : proto, $RegExp);
	  };
	  var proxy = function(key){
	    key in $RegExp || dP($RegExp, key, {
	      configurable: true,
	      get: function(){ return Base[key]; },
	      set: function(it){ Base[key] = it; }
	    });
	  };
	  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
	  proto.constructor = $RegExp;
	  $RegExp.prototype = proto;
	  __webpack_require__(75)(global, 'RegExp', $RegExp);
	}
	
	__webpack_require__(250)('RegExp');

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.2.5.3 get RegExp.prototype.flags
	var anObject = __webpack_require__(69);
	module.exports = function(){
	  var that   = anObject(this)
	    , result = '';
	  if(that.global)     result += 'g';
	  if(that.ignoreCase) result += 'i';
	  if(that.multiline)  result += 'm';
	  if(that.unicode)    result += 'u';
	  if(that.sticky)     result += 'y';
	  return result;
	};

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	__webpack_require__(256);
	var anObject    = __webpack_require__(69)
	  , $flags      = __webpack_require__(254)
	  , DESCRIPTORS = __webpack_require__(63)
	  , TO_STRING   = 'toString'
	  , $toString   = /./[TO_STRING];
	
	var define = function(fn){
	  __webpack_require__(75)(RegExp.prototype, TO_STRING, fn, true);
	};
	
	// 21.2.5.14 RegExp.prototype.toString()
	if(__webpack_require__(64)(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
	  define(function toString(){
	    var R = anObject(this);
	    return '/'.concat(R.source, '/',
	      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
	  });
	// FF44- RegExp#toString has a wrong name
	} else if($toString.name != TO_STRING){
	  define(function toString(){
	    return $toString.call(this);
	  });
	}

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	// 21.2.5.3 get RegExp.prototype.flags()
	if(__webpack_require__(63) && /./g.flags != 'g')__webpack_require__(68).f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: __webpack_require__(254)
	});

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	// @@match logic
	__webpack_require__(258)('match', 1, function(defined, MATCH, $match){
	  // 21.1.3.11 String.prototype.match(regexp)
	  return [function match(regexp){
	    'use strict';
	    var O  = defined(this)
	      , fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, $match];
	});

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var hide     = __webpack_require__(67)
	  , redefine = __webpack_require__(75)
	  , fails    = __webpack_require__(64)
	  , defined  = __webpack_require__(92)
	  , wks      = __webpack_require__(82);
	
	module.exports = function(KEY, length, exec){
	  var SYMBOL   = wks(KEY)
	    , fns      = exec(defined, SYMBOL, ''[KEY])
	    , strfn    = fns[0]
	    , rxfn     = fns[1];
	  if(fails(function(){
	    var O = {};
	    O[SYMBOL] = function(){ return 7; };
	    return ''[KEY](O) != 7;
	  })){
	    redefine(String.prototype, KEY, strfn);
	    hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function(string, arg){ return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function(string){ return rxfn.call(string, this); }
	    );
	  }
	};

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	// @@replace logic
	__webpack_require__(258)('replace', 2, function(defined, REPLACE, $replace){
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
	  return [function replace(searchValue, replaceValue){
	    'use strict';
	    var O  = defined(this)
	      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined
	      ? fn.call(searchValue, O, replaceValue)
	      : $replace.call(String(O), searchValue, replaceValue);
	  }, $replace];
	});

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	// @@search logic
	__webpack_require__(258)('search', 1, function(defined, SEARCH, $search){
	  // 21.1.3.15 String.prototype.search(regexp)
	  return [function search(regexp){
	    'use strict';
	    var O  = defined(this)
	      , fn = regexp == undefined ? undefined : regexp[SEARCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  }, $search];
	});

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	// @@split logic
	__webpack_require__(258)('split', 2, function(defined, SPLIT, $split){
	  'use strict';
	  var isRegExp   = __webpack_require__(192)
	    , _split     = $split
	    , $push      = [].push
	    , $SPLIT     = 'split'
	    , LENGTH     = 'length'
	    , LAST_INDEX = 'lastIndex';
	  if(
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ){
	    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
	    // based on es5-shim implementation, need to rework it
	    $split = function(separator, limit){
	      var string = String(this);
	      if(separator === undefined && limit === 0)return [];
	      // If `separator` is not a regex, use native split
	      if(!isRegExp(separator))return _split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var separator2, match, lastIndex, lastLength, i;
	      // Doesn't need flags gy, but they don't hurt
	      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
	      while(match = separatorCopy.exec(string)){
	        // `separatorCopy.lastIndex` is not reliable cross-browser
	        lastIndex = match.index + match[0][LENGTH];
	        if(lastIndex > lastLastIndex){
	          output.push(string.slice(lastLastIndex, match.index));
	          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
	          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
	            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
	          });
	          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if(output[LENGTH] >= splitLimit)break;
	        }
	        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
	      }
	      if(lastLastIndex === string[LENGTH]){
	        if(lastLength || !separatorCopy.test(''))output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	  // Chakra, V8
	  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
	    $split = function(separator, limit){
	      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
	    };
	  }
	  // 21.1.3.17 String.prototype.split(separator, limit)
	  return [function split(separator, limit){
	    var O  = defined(this)
	      , fn = separator == undefined ? undefined : separator[SPLIT];
	    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
	  }, $split];
	});

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(85)
	  , global             = __webpack_require__(61)
	  , ctx                = __webpack_require__(77)
	  , classof            = __webpack_require__(132)
	  , $export            = __webpack_require__(65)
	  , isObject           = __webpack_require__(70)
	  , anObject           = __webpack_require__(69)
	  , aFunction          = __webpack_require__(78)
	  , anInstance         = __webpack_require__(147)
	  , forOf              = __webpack_require__(263)
	  , setProto           = __webpack_require__(130).set
	  , speciesConstructor = __webpack_require__(264)
	  , task               = __webpack_require__(265).set
	  , microtask          = __webpack_require__(266)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;
	
	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(82)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();
	
	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};
	
	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(267)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(81)($Promise, PROMISE);
	__webpack_require__(250)(PROMISE);
	Wrapper = __webpack_require__(66)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(223)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(77)
	  , call        = __webpack_require__(219)
	  , isArrayIter = __webpack_require__(220)
	  , anObject    = __webpack_require__(69)
	  , toLength    = __webpack_require__(94)
	  , getIterFn   = __webpack_require__(222)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(69)
	  , aFunction = __webpack_require__(78)
	  , SPECIES   = __webpack_require__(82)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(77)
	  , invoke             = __webpack_require__(135)
	  , html               = __webpack_require__(105)
	  , cel                = __webpack_require__(72)
	  , global             = __webpack_require__(61)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(91)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(61)
	  , macrotask = __webpack_require__(265).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(91)(process) == 'process';
	
	module.exports = function(){
	  var head, last, notify;
	
	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };
	
	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(75);
	module.exports = function(target, src, safe){
	  for(var key in src)redefine(target, key, src[key], safe);
	  return target;
	};

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(269);
	
	// 23.1 Map Objects
	module.exports = __webpack_require__(270)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var dP          = __webpack_require__(68).f
	  , create      = __webpack_require__(103)
	  , hide        = __webpack_require__(67)
	  , redefineAll = __webpack_require__(267)
	  , ctx         = __webpack_require__(77)
	  , anInstance  = __webpack_require__(147)
	  , defined     = __webpack_require__(92)
	  , forOf       = __webpack_require__(263)
	  , $iterDefine = __webpack_require__(186)
	  , step        = __webpack_require__(252)
	  , setSpecies  = __webpack_require__(250)
	  , DESCRIPTORS = __webpack_require__(63)
	  , fastKey     = __webpack_require__(79).fastKey
	  , SIZE        = DESCRIPTORS ? '_s' : 'size';
	
	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      anInstance(that, C, NAME, '_i');
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        anInstance(this, C, 'forEach');
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)dP(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global            = __webpack_require__(61)
	  , $export           = __webpack_require__(65)
	  , redefine          = __webpack_require__(75)
	  , redefineAll       = __webpack_require__(267)
	  , meta              = __webpack_require__(79)
	  , forOf             = __webpack_require__(263)
	  , anInstance        = __webpack_require__(147)
	  , isObject          = __webpack_require__(70)
	  , fails             = __webpack_require__(64)
	  , $iterDetect       = __webpack_require__(223)
	  , setToStringTag    = __webpack_require__(81)
	  , inheritIfRequired = __webpack_require__(145);
	
	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  var fixMethod = function(KEY){
	    var fn = proto[KEY];
	    redefine(proto, KEY,
	      KEY == 'delete' ? function(a){
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a){
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a){
	        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    var instance             = new C
	      // early implementations not supports chaining
	      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
	      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
	      // most early implementations doesn't supports iterables, most modern - not close it correctly
	      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
	      // for early implementations -0 and +0 not the same
	      , BUGGY_ZERO = !IS_WEAK && fails(function(){
	        // V8 ~ Chromium 42- fails only with 5+ elements
	        var $instance = new C()
	          , index     = 5;
	        while(index--)$instance[ADDER](index, index);
	        return !$instance.has(-0);
	      });
	    if(!ACCEPT_ITERABLES){ 
	      C = wrapper(function(target, iterable){
	        anInstance(target, C, NAME);
	        var that = inheritIfRequired(new Base, target, C);
	        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if(IS_WEAK && proto.clear)delete proto.clear;
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F * (C != Base), O);
	
	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(269);
	
	// 23.2 Set Objects
	module.exports = __webpack_require__(270)('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var each         = __webpack_require__(230)(0)
	  , redefine     = __webpack_require__(75)
	  , meta         = __webpack_require__(79)
	  , assign       = __webpack_require__(126)
	  , weak         = __webpack_require__(273)
	  , isObject     = __webpack_require__(70)
	  , has          = __webpack_require__(62)
	  , getWeak      = meta.getWeak
	  , isExtensible = Object.isExtensible
	  , uncaughtFrozenStore = weak.ufstore
	  , tmp          = {}
	  , InternalMap;
	
	var wrapper = function(get){
	  return function WeakMap(){
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};
	
	var methods = {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key){
	    if(isObject(key)){
	      var data = getWeak(key);
	      if(data === true)return uncaughtFrozenStore(this).get(key);
	      return data ? data[this._i] : undefined;
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value){
	    return weak.def(this, key, value);
	  }
	};
	
	// 23.3 WeakMap Objects
	var $WeakMap = module.exports = __webpack_require__(270)('WeakMap', wrapper, methods, weak, true, true);
	
	// IE11 WeakMap frozen keys fix
	if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
	  InternalMap = weak.getConstructor(wrapper);
	  assign(InternalMap.prototype, methods);
	  meta.NEED = true;
	  each(['delete', 'has', 'get', 'set'], function(key){
	    var proto  = $WeakMap.prototype
	      , method = proto[key];
	    redefine(proto, key, function(a, b){
	      // store frozen objects on internal weakmap shim
	      if(isObject(a) && !isExtensible(a)){
	        if(!this._f)this._f = new InternalMap;
	        var result = this._f[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    });
	  });
	}

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var redefineAll       = __webpack_require__(267)
	  , getWeak           = __webpack_require__(79).getWeak
	  , anObject          = __webpack_require__(69)
	  , isObject          = __webpack_require__(70)
	  , anInstance        = __webpack_require__(147)
	  , forOf             = __webpack_require__(263)
	  , createArrayMethod = __webpack_require__(230)
	  , $has              = __webpack_require__(62)
	  , arrayFind         = createArrayMethod(5)
	  , arrayFindIndex    = createArrayMethod(6)
	  , id                = 0;
	
	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function(that){
	  return that._l || (that._l = new UncaughtFrozenStore);
	};
	var UncaughtFrozenStore = function(){
	  this.a = [];
	};
	var findUncaughtFrozen = function(store, key){
	  return arrayFind(store.a, function(it){
	    return it[0] === key;
	  });
	};
	UncaughtFrozenStore.prototype = {
	  get: function(key){
	    var entry = findUncaughtFrozen(this, key);
	    if(entry)return entry[1];
	  },
	  has: function(key){
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function(key, value){
	    var entry = findUncaughtFrozen(this, key);
	    if(entry)entry[1] = value;
	    else this.a.push([key, value]);
	  },
	  'delete': function(key){
	    var index = arrayFindIndex(this.a, function(it){
	      return it[0] === key;
	    });
	    if(~index)this.a.splice(index, 1);
	    return !!~index;
	  }
	};
	
	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      anInstance(that, C, NAME, '_i');
	      that._i = id++;      // collection id
	      that._l = undefined; // leak store for uncaught frozen objects
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function(key){
	        if(!isObject(key))return false;
	        var data = getWeak(key);
	        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
	        return data && $has(data, this._i) && delete data[this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key){
	        if(!isObject(key))return false;
	        var data = getWeak(key);
	        if(data === true)return uncaughtFrozenStore(this).has(key);
	        return data && $has(data, this._i);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var data = getWeak(anObject(key), true);
	    if(data === true)uncaughtFrozenStore(that).set(key, value);
	    else data[that._i] = value;
	    return that;
	  },
	  ufstore: uncaughtFrozenStore
	};

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(273);
	
	// 23.4 WeakSet Objects
	__webpack_require__(270)('WeakSet', function(get){
	  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value){
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export      = __webpack_require__(65)
	  , $typed       = __webpack_require__(276)
	  , buffer       = __webpack_require__(277)
	  , anObject     = __webpack_require__(69)
	  , toIndex      = __webpack_require__(96)
	  , toLength     = __webpack_require__(94)
	  , isObject     = __webpack_require__(70)
	  , TYPED_ARRAY  = __webpack_require__(82)('typed_array')
	  , ArrayBuffer  = __webpack_require__(61).ArrayBuffer
	  , speciesConstructor = __webpack_require__(264)
	  , $ArrayBuffer = buffer.ArrayBuffer
	  , $DataView    = buffer.DataView
	  , $isView      = $typed.ABV && ArrayBuffer.isView
	  , $slice       = $ArrayBuffer.prototype.slice
	  , VIEW         = $typed.VIEW
	  , ARRAY_BUFFER = 'ArrayBuffer';
	
	$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});
	
	$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
	  // 24.1.3.1 ArrayBuffer.isView(arg)
	  isView: function isView(it){
	    return $isView && $isView(it) || isObject(it) && VIEW in it;
	  }
	});
	
	$export($export.P + $export.U + $export.F * __webpack_require__(64)(function(){
	  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
	}), ARRAY_BUFFER, {
	  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
	  slice: function slice(start, end){
	    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
	    var len    = anObject(this).byteLength
	      , first  = toIndex(start, len)
	      , final  = toIndex(end === undefined ? len : end, len)
	      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
	      , viewS  = new $DataView(this)
	      , viewT  = new $DataView(result)
	      , index  = 0;
	    while(first < final){
	      viewT.setUint8(index++, viewS.getUint8(first++));
	    } return result;
	  }
	});
	
	__webpack_require__(250)(ARRAY_BUFFER);

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(61)
	  , hide   = __webpack_require__(67)
	  , uid    = __webpack_require__(76)
	  , TYPED  = uid('typed_array')
	  , VIEW   = uid('view')
	  , ABV    = !!(global.ArrayBuffer && global.DataView)
	  , CONSTR = ABV
	  , i = 0, l = 9, Typed;
	
	var TypedArrayConstructors = (
	  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
	).split(',');
	
	while(i < l){
	  if(Typed = global[TypedArrayConstructors[i++]]){
	    hide(Typed.prototype, TYPED, true);
	    hide(Typed.prototype, VIEW, true);
	  } else CONSTR = false;
	}
	
	module.exports = {
	  ABV:    ABV,
	  CONSTR: CONSTR,
	  TYPED:  TYPED,
	  VIEW:   VIEW
	};

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global         = __webpack_require__(61)
	  , DESCRIPTORS    = __webpack_require__(63)
	  , LIBRARY        = __webpack_require__(85)
	  , $typed         = __webpack_require__(276)
	  , hide           = __webpack_require__(67)
	  , redefineAll    = __webpack_require__(267)
	  , fails          = __webpack_require__(64)
	  , anInstance     = __webpack_require__(147)
	  , toInteger      = __webpack_require__(95)
	  , toLength       = __webpack_require__(94)
	  , gOPN           = __webpack_require__(107).f
	  , dP             = __webpack_require__(68).f
	  , arrayFill      = __webpack_require__(246)
	  , setToStringTag = __webpack_require__(81)
	  , ARRAY_BUFFER   = 'ArrayBuffer'
	  , DATA_VIEW      = 'DataView'
	  , PROTOTYPE      = 'prototype'
	  , WRONG_LENGTH   = 'Wrong length!'
	  , WRONG_INDEX    = 'Wrong index!'
	  , $ArrayBuffer   = global[ARRAY_BUFFER]
	  , $DataView      = global[DATA_VIEW]
	  , Math           = global.Math
	  , parseInt       = global.parseInt
	  , RangeError     = global.RangeError
	  , Infinity       = global.Infinity
	  , BaseBuffer     = $ArrayBuffer
	  , abs            = Math.abs
	  , pow            = Math.pow
	  , min            = Math.min
	  , floor          = Math.floor
	  , log            = Math.log
	  , LN2            = Math.LN2
	  , BUFFER         = 'buffer'
	  , BYTE_LENGTH    = 'byteLength'
	  , BYTE_OFFSET    = 'byteOffset'
	  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
	  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
	  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;
	
	// IEEE754 conversions based on https://github.com/feross/ieee754
	var packIEEE754 = function(value, mLen, nBytes){
	  var buffer = Array(nBytes)
	    , eLen   = nBytes * 8 - mLen - 1
	    , eMax   = (1 << eLen) - 1
	    , eBias  = eMax >> 1
	    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
	    , i      = 0
	    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
	    , e, m, c;
	  value = abs(value)
	  if(value != value || value === Infinity){
	    m = value != value ? 1 : 0;
	    e = eMax;
	  } else {
	    e = floor(log(value) / LN2);
	    if(value * (c = pow(2, -e)) < 1){
	      e--;
	      c *= 2;
	    }
	    if(e + eBias >= 1){
	      value += rt / c;
	    } else {
	      value += rt * pow(2, 1 - eBias);
	    }
	    if(value * c >= 2){
	      e++;
	      c /= 2;
	    }
	    if(e + eBias >= eMax){
	      m = 0;
	      e = eMax;
	    } else if(e + eBias >= 1){
	      m = (value * c - 1) * pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * pow(2, eBias - 1) * pow(2, mLen);
	      e = 0;
	    }
	  }
	  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
	  e = e << mLen | m;
	  eLen += mLen;
	  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
	  buffer[--i] |= s * 128;
	  return buffer;
	};
	var unpackIEEE754 = function(buffer, mLen, nBytes){
	  var eLen  = nBytes * 8 - mLen - 1
	    , eMax  = (1 << eLen) - 1
	    , eBias = eMax >> 1
	    , nBits = eLen - 7
	    , i     = nBytes - 1
	    , s     = buffer[i--]
	    , e     = s & 127
	    , m;
	  s >>= 7;
	  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
	  if(e === 0){
	    e = 1 - eBias;
	  } else if(e === eMax){
	    return m ? NaN : s ? -Infinity : Infinity;
	  } else {
	    m = m + pow(2, mLen);
	    e = e - eBias;
	  } return (s ? -1 : 1) * m * pow(2, e - mLen);
	};
	
	var unpackI32 = function(bytes){
	  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
	};
	var packI8 = function(it){
	  return [it & 0xff];
	};
	var packI16 = function(it){
	  return [it & 0xff, it >> 8 & 0xff];
	};
	var packI32 = function(it){
	  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
	};
	var packF64 = function(it){
	  return packIEEE754(it, 52, 8);
	};
	var packF32 = function(it){
	  return packIEEE754(it, 23, 4);
	};
	
	var addGetter = function(C, key, internal){
	  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
	};
	
	var get = function(view, bytes, index, isLittleEndian){
	  var numIndex = +index
	    , intIndex = toInteger(numIndex);
	  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b
	    , start = intIndex + view[$OFFSET]
	    , pack  = store.slice(start, start + bytes);
	  return isLittleEndian ? pack : pack.reverse();
	};
	var set = function(view, bytes, index, conversion, value, isLittleEndian){
	  var numIndex = +index
	    , intIndex = toInteger(numIndex);
	  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b
	    , start = intIndex + view[$OFFSET]
	    , pack  = conversion(+value);
	  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
	};
	
	var validateArrayBufferArguments = function(that, length){
	  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
	  var numberLength = +length
	    , byteLength   = toLength(numberLength);
	  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
	  return byteLength;
	};
	
	if(!$typed.ABV){
	  $ArrayBuffer = function ArrayBuffer(length){
	    var byteLength = validateArrayBufferArguments(this, length);
	    this._b       = arrayFill.call(Array(byteLength), 0);
	    this[$LENGTH] = byteLength;
	  };
	
	  $DataView = function DataView(buffer, byteOffset, byteLength){
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = buffer[$LENGTH]
	      , offset       = toInteger(byteOffset);
	    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
	    this[$BUFFER] = buffer;
	    this[$OFFSET] = offset;
	    this[$LENGTH] = byteLength;
	  };
	
	  if(DESCRIPTORS){
	    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
	    addGetter($DataView, BUFFER, '_b');
	    addGetter($DataView, BYTE_LENGTH, '_l');
	    addGetter($DataView, BYTE_OFFSET, '_o');
	  }
	
	  redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset){
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset){
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /*, littleEndian */){
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /*, littleEndian */){
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /*, littleEndian */){
	      return unpackI32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /*, littleEndian */){
	      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
	    },
	    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
	    },
	    setInt8: function setInt8(byteOffset, value){
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setUint8: function setUint8(byteOffset, value){
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
	      set(this, 4, byteOffset, packF32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
	      set(this, 8, byteOffset, packF64, value, arguments[2]);
	    }
	  });
	} else {
	  if(!fails(function(){
	    new $ArrayBuffer;     // eslint-disable-line no-new
	  }) || !fails(function(){
	    new $ArrayBuffer(.5); // eslint-disable-line no-new
	  })){
	    $ArrayBuffer = function ArrayBuffer(length){
	      return new BaseBuffer(validateArrayBufferArguments(this, length));
	    };
	    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
	    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
	      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
	    };
	    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
	  }
	  // iOS Safari 7.x bug
	  var view = new $DataView(new $ArrayBuffer(2))
	    , $setInt8 = $DataView[PROTOTYPE].setInt8;
	  view.setInt8(0, 2147483648);
	  view.setInt8(1, 2147483649);
	  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value){
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value){
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, true);
	}
	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);
	hide($DataView[PROTOTYPE], $typed.VIEW, true);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65);
	$export($export.G + $export.W + $export.F * !__webpack_require__(276).ABV, {
	  DataView: __webpack_require__(277).DataView
	});

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Int8', 1, function(init){
	  return function Int8Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	if(__webpack_require__(63)){
	  var LIBRARY             = __webpack_require__(85)
	    , global              = __webpack_require__(61)
	    , fails               = __webpack_require__(64)
	    , $export             = __webpack_require__(65)
	    , $typed              = __webpack_require__(276)
	    , $buffer             = __webpack_require__(277)
	    , ctx                 = __webpack_require__(77)
	    , anInstance          = __webpack_require__(147)
	    , propertyDesc        = __webpack_require__(74)
	    , hide                = __webpack_require__(67)
	    , redefineAll         = __webpack_require__(267)
	    , isInteger           = __webpack_require__(154)
	    , toInteger           = __webpack_require__(95)
	    , toLength            = __webpack_require__(94)
	    , toIndex             = __webpack_require__(96)
	    , toPrimitive         = __webpack_require__(73)
	    , has                 = __webpack_require__(62)
	    , same                = __webpack_require__(128)
	    , classof             = __webpack_require__(132)
	    , isObject            = __webpack_require__(70)
	    , toObject            = __webpack_require__(115)
	    , isArrayIter         = __webpack_require__(220)
	    , create              = __webpack_require__(103)
	    , getPrototypeOf      = __webpack_require__(116)
	    , gOPN                = __webpack_require__(107).f
	    , isIterable          = __webpack_require__(281)
	    , getIterFn           = __webpack_require__(222)
	    , uid                 = __webpack_require__(76)
	    , wks                 = __webpack_require__(82)
	    , createArrayMethod   = __webpack_require__(230)
	    , createArrayIncludes = __webpack_require__(93)
	    , speciesConstructor  = __webpack_require__(264)
	    , ArrayIterators      = __webpack_require__(251)
	    , Iterators           = __webpack_require__(187)
	    , $iterDetect         = __webpack_require__(223)
	    , setSpecies          = __webpack_require__(250)
	    , arrayFill           = __webpack_require__(246)
	    , arrayCopyWithin     = __webpack_require__(243)
	    , $DP                 = __webpack_require__(68)
	    , $GOPD               = __webpack_require__(108)
	    , dP                  = $DP.f
	    , gOPD                = $GOPD.f
	    , RangeError          = global.RangeError
	    , TypeError           = global.TypeError
	    , Uint8Array          = global.Uint8Array
	    , ARRAY_BUFFER        = 'ArrayBuffer'
	    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
	    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
	    , PROTOTYPE           = 'prototype'
	    , ArrayProto          = Array[PROTOTYPE]
	    , $ArrayBuffer        = $buffer.ArrayBuffer
	    , $DataView           = $buffer.DataView
	    , arrayForEach        = createArrayMethod(0)
	    , arrayFilter         = createArrayMethod(2)
	    , arraySome           = createArrayMethod(3)
	    , arrayEvery          = createArrayMethod(4)
	    , arrayFind           = createArrayMethod(5)
	    , arrayFindIndex      = createArrayMethod(6)
	    , arrayIncludes       = createArrayIncludes(true)
	    , arrayIndexOf        = createArrayIncludes(false)
	    , arrayValues         = ArrayIterators.values
	    , arrayKeys           = ArrayIterators.keys
	    , arrayEntries        = ArrayIterators.entries
	    , arrayLastIndexOf    = ArrayProto.lastIndexOf
	    , arrayReduce         = ArrayProto.reduce
	    , arrayReduceRight    = ArrayProto.reduceRight
	    , arrayJoin           = ArrayProto.join
	    , arraySort           = ArrayProto.sort
	    , arraySlice          = ArrayProto.slice
	    , arrayToString       = ArrayProto.toString
	    , arrayToLocaleString = ArrayProto.toLocaleString
	    , ITERATOR            = wks('iterator')
	    , TAG                 = wks('toStringTag')
	    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
	    , DEF_CONSTRUCTOR     = uid('def_constructor')
	    , ALL_CONSTRUCTORS    = $typed.CONSTR
	    , TYPED_ARRAY         = $typed.TYPED
	    , VIEW                = $typed.VIEW
	    , WRONG_LENGTH        = 'Wrong length!';
	
	  var $map = createArrayMethod(1, function(O, length){
	    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
	  });
	
	  var LITTLE_ENDIAN = fails(function(){
	    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
	  });
	
	  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
	    new Uint8Array(1).set({});
	  });
	
	  var strictToLength = function(it, SAME){
	    if(it === undefined)throw TypeError(WRONG_LENGTH);
	    var number = +it
	      , length = toLength(it);
	    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
	    return length;
	  };
	
	  var toOffset = function(it, BYTES){
	    var offset = toInteger(it);
	    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
	    return offset;
	  };
	
	  var validate = function(it){
	    if(isObject(it) && TYPED_ARRAY in it)return it;
	    throw TypeError(it + ' is not a typed array!');
	  };
	
	  var allocate = function(C, length){
	    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
	      throw TypeError('It is not a typed array constructor!');
	    } return new C(length);
	  };
	
	  var speciesFromList = function(O, list){
	    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
	  };
	
	  var fromList = function(C, list){
	    var index  = 0
	      , length = list.length
	      , result = allocate(C, length);
	    while(length > index)result[index] = list[index++];
	    return result;
	  };
	
	  var addGetter = function(it, key, internal){
	    dP(it, key, {get: function(){ return this._d[internal]; }});
	  };
	
	  var $from = function from(source /*, mapfn, thisArg */){
	    var O       = toObject(source)
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , iterFn  = getIterFn(O)
	      , i, length, values, result, step, iterator;
	    if(iterFn != undefined && !isArrayIter(iterFn)){
	      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
	        values.push(step.value);
	      } O = values;
	    }
	    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
	    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }
	    return result;
	  };
	
	  var $of = function of(/*...items*/){
	    var index  = 0
	      , length = arguments.length
	      , result = allocate(this, length);
	    while(length > index)result[index] = arguments[index++];
	    return result;
	  };
	
	  // iOS Safari 6.x fails here
	  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });
	
	  var $toLocaleString = function toLocaleString(){
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };
	
	  var proto = {
	    copyWithin: function copyWithin(target, start /*, end */){
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn /*, thisArg */){
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn /*, thisArg */){
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
	        arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate /*, thisArg */){
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate /*, thisArg */){
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn /*, thisArg */){
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement /*, fromIndex */){
	      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement /*, fromIndex */){
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator){ // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn /*, thisArg */){
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
	      return arrayReduceRight.apply(validate(this), arguments);
	    },
	    reverse: function reverse(){
	      var that   = this
	        , length = validate(that).length
	        , middle = Math.floor(length / 2)
	        , index  = 0
	        , value;
	      while(index < middle){
	        value         = that[index];
	        that[index++] = that[--length];
	        that[length]  = value;
	      } return that;
	    },
	    some: function some(callbackfn /*, thisArg */){
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn){
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end){
	      var O      = validate(this)
	        , length = O.length
	        , $begin = toIndex(begin, length);
	      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
	        O.buffer,
	        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
	        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
	      );
	    }
	  };
	
	  var $slice = function slice(start, end){
	    return speciesFromList(this, arraySlice.call(validate(this), start, end));
	  };
	
	  var $set = function set(arrayLike /*, offset */){
	    validate(this);
	    var offset = toOffset(arguments[1], 1)
	      , length = this.length
	      , src    = toObject(arrayLike)
	      , len    = toLength(src.length)
	      , index  = 0;
	    if(len + offset > length)throw RangeError(WRONG_LENGTH);
	    while(index < len)this[offset + index] = src[index++];
	  };
	
	  var $iterators = {
	    entries: function entries(){
	      return arrayEntries.call(validate(this));
	    },
	    keys: function keys(){
	      return arrayKeys.call(validate(this));
	    },
	    values: function values(){
	      return arrayValues.call(validate(this));
	    }
	  };
	
	  var isTAIndex = function(target, key){
	    return isObject(target)
	      && target[TYPED_ARRAY]
	      && typeof key != 'symbol'
	      && key in target
	      && String(+key) == String(key);
	  };
	  var $getDesc = function getOwnPropertyDescriptor(target, key){
	    return isTAIndex(target, key = toPrimitive(key, true))
	      ? propertyDesc(2, target[key])
	      : gOPD(target, key);
	  };
	  var $setDesc = function defineProperty(target, key, desc){
	    if(isTAIndex(target, key = toPrimitive(key, true))
	      && isObject(desc)
	      && has(desc, 'value')
	      && !has(desc, 'get')
	      && !has(desc, 'set')
	      // TODO: add validation descriptor w/o calling accessors
	      && !desc.configurable
	      && (!has(desc, 'writable') || desc.writable)
	      && (!has(desc, 'enumerable') || desc.enumerable)
	    ){
	      target[key] = desc.value;
	      return target;
	    } else return dP(target, key, desc);
	  };
	
	  if(!ALL_CONSTRUCTORS){
	    $GOPD.f = $getDesc;
	    $DP.f   = $setDesc;
	  }
	
	  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty:           $setDesc
	  });
	
	  if(fails(function(){ arrayToString.call({}); })){
	    arrayToString = arrayToLocaleString = function toString(){
	      return arrayJoin.call(this);
	    }
	  }
	
	  var $TypedArrayPrototype$ = redefineAll({}, proto);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    slice:          $slice,
	    set:            $set,
	    constructor:    function(){ /* noop */ },
	    toString:       arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP($TypedArrayPrototype$, TAG, {
	    get: function(){ return this[TYPED_ARRAY]; }
	  });
	
	  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
	    CLAMPED = !!CLAMPED;
	    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
	      , ISNT_UINT8 = NAME != 'Uint8Array'
	      , GETTER     = 'get' + KEY
	      , SETTER     = 'set' + KEY
	      , TypedArray = global[NAME]
	      , Base       = TypedArray || {}
	      , TAC        = TypedArray && getPrototypeOf(TypedArray)
	      , FORCED     = !TypedArray || !$typed.ABV
	      , O          = {}
	      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
	    var getter = function(that, index){
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };
	    var setter = function(that, index, value){
	      var data = that._d;
	      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };
	    var addElement = function(that, index){
	      dP(that, index, {
	        get: function(){
	          return getter(this, index);
	        },
	        set: function(value){
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };
	    if(FORCED){
	      TypedArray = wrapper(function(that, data, $offset, $length){
	        anInstance(that, TypedArray, NAME, '_d');
	        var index  = 0
	          , offset = 0
	          , buffer, byteLength, length, klass;
	        if(!isObject(data)){
	          length     = strictToLength(data, true)
	          byteLength = length * BYTES;
	          buffer     = new $ArrayBuffer(byteLength);
	        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;
	          if($length === undefined){
	            if($len % BYTES)throw RangeError(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if(TYPED_ARRAY in data){
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }
	        hide(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });
	        while(index < length)addElement(that, index++);
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
	      hide(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if(!$iterDetect(function(iter){
	      // V8 works with iterators, but fails in many other cases
	      // https://code.google.com/p/v8/issues/detail?id=4552
	      new TypedArray(null); // eslint-disable-line no-new
	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)){
	      TypedArray = wrapper(function(that, data, $offset, $length){
	        anInstance(that, TypedArray, NAME);
	        var klass;
	        // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645
	        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
	        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
	          return $length !== undefined
	            ? new Base(data, toOffset($offset, BYTES), $length)
	            : $offset !== undefined
	              ? new Base(data, toOffset($offset, BYTES))
	              : new Base(data);
	        }
	        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
	        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE] = TypedArrayPrototype;
	      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
	    }
	    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
	      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
	      , $iterator         = $iterators.values;
	    hide(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide(TypedArrayPrototype, VIEW, true);
	    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);
	
	    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
	      dP(TypedArrayPrototype, TAG, {
	        get: function(){ return NAME; }
	      });
	    }
	
	    O[NAME] = TypedArray;
	
	    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);
	
	    $export($export.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES,
	      from: $from,
	      of: $of
	    });
	
	    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
	
	    $export($export.P, NAME, proto);
	
	    setSpecies(NAME);
	
	    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});
	
	    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);
	
	    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});
	
	    $export($export.P + $export.F * fails(function(){
	      new TypedArray(1).slice();
	    }), NAME, {slice: $slice});
	
	    $export($export.P + $export.F * (fails(function(){
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
	    }) || !fails(function(){
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, {toLocaleString: $toLocaleString});
	
	    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
	  };
	} else module.exports = function(){ /* empty */ };

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(132)
	  , ITERATOR  = __webpack_require__(82)('iterator')
	  , Iterators = __webpack_require__(187);
	module.exports = __webpack_require__(66).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Uint8', 1, function(init){
	  return function Uint8Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Uint8', 1, function(init){
	  return function Uint8ClampedArray(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	}, true);

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Int16', 2, function(init){
	  return function Int16Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Uint16', 2, function(init){
	  return function Uint16Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Int32', 4, function(init){
	  return function Int32Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Uint32', 4, function(init){
	  return function Uint32Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Float32', 4, function(init){
	  return function Float32Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(280)('Float64', 8, function(init){
	  return function Float64Array(data, byteOffset, length){
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	var $export   = __webpack_require__(65)
	  , aFunction = __webpack_require__(78)
	  , anObject  = __webpack_require__(69)
	  , _apply    = Function.apply;
	
	$export($export.S, 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList){
	    return _apply.call(aFunction(target), thisArgument, anObject(argumentsList));
	  }
	});

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	var $export   = __webpack_require__(65)
	  , create    = __webpack_require__(103)
	  , aFunction = __webpack_require__(78)
	  , anObject  = __webpack_require__(69)
	  , isObject  = __webpack_require__(70)
	  , bind      = __webpack_require__(134);
	
	// MS Edge supports only 2 arguments
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	$export($export.S + $export.F * __webpack_require__(64)(function(){
	  function F(){}
	  return !(Reflect.construct(function(){}, [], F) instanceof F);
	}), 'Reflect', {
	  construct: function construct(Target, args /*, newTarget*/){
	    aFunction(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
	    if(Target == newTarget){
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch(args.length){
	        case 0: return new Target;
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind.apply(Target, $args));
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto    = newTarget.prototype
	      , instance = create(isObject(proto) ? proto : Object.prototype)
	      , result   = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	var dP          = __webpack_require__(68)
	  , $export     = __webpack_require__(65)
	  , anObject    = __webpack_require__(69)
	  , toPrimitive = __webpack_require__(73);
	
	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	$export($export.S + $export.F * __webpack_require__(64)(function(){
	  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
	}), 'Reflect', {
	  defineProperty: function defineProperty(target, propertyKey, attributes){
	    anObject(target);
	    propertyKey = toPrimitive(propertyKey, true);
	    anObject(attributes);
	    try {
	      dP.f(target, propertyKey, attributes);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.4 Reflect.deleteProperty(target, propertyKey)
	var $export  = __webpack_require__(65)
	  , gOPD     = __webpack_require__(108).f
	  , anObject = __webpack_require__(69);
	
	$export($export.S, 'Reflect', {
	  deleteProperty: function deleteProperty(target, propertyKey){
	    var desc = gOPD(anObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  }
	});

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 26.1.5 Reflect.enumerate(target)
	var $export  = __webpack_require__(65)
	  , anObject = __webpack_require__(69);
	var Enumerate = function(iterated){
	  this._t = anObject(iterated); // target
	  this._i = 0;                  // next index
	  var keys = this._k = []       // keys
	    , key;
	  for(key in iterated)keys.push(key);
	};
	__webpack_require__(188)(Enumerate, 'Object', function(){
	  var that = this
	    , keys = that._k
	    , key;
	  do {
	    if(that._i >= keys.length)return {value: undefined, done: true};
	  } while(!((key = keys[that._i++]) in that._t));
	  return {value: key, done: false};
	});
	
	$export($export.S, 'Reflect', {
	  enumerate: function enumerate(target){
	    return new Enumerate(target);
	  }
	});

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.6 Reflect.get(target, propertyKey [, receiver])
	var gOPD           = __webpack_require__(108)
	  , getPrototypeOf = __webpack_require__(116)
	  , has            = __webpack_require__(62)
	  , $export        = __webpack_require__(65)
	  , isObject       = __webpack_require__(70)
	  , anObject       = __webpack_require__(69);
	
	function get(target, propertyKey/*, receiver*/){
	  var receiver = arguments.length < 3 ? target : arguments[2]
	    , desc, proto;
	  if(anObject(target) === receiver)return target[propertyKey];
	  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
	    ? desc.value
	    : desc.get !== undefined
	      ? desc.get.call(receiver)
	      : undefined;
	  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
	}
	
	$export($export.S, 'Reflect', {get: get});

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	var gOPD     = __webpack_require__(108)
	  , $export  = __webpack_require__(65)
	  , anObject = __webpack_require__(69);
	
	$export($export.S, 'Reflect', {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
	    return gOPD.f(anObject(target), propertyKey);
	  }
	});

/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.8 Reflect.getPrototypeOf(target)
	var $export  = __webpack_require__(65)
	  , getProto = __webpack_require__(116)
	  , anObject = __webpack_require__(69);
	
	$export($export.S, 'Reflect', {
	  getPrototypeOf: function getPrototypeOf(target){
	    return getProto(anObject(target));
	  }
	});

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.9 Reflect.has(target, propertyKey)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Reflect', {
	  has: function has(target, propertyKey){
	    return propertyKey in target;
	  }
	});

/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.10 Reflect.isExtensible(target)
	var $export       = __webpack_require__(65)
	  , anObject      = __webpack_require__(69)
	  , $isExtensible = Object.isExtensible;
	
	$export($export.S, 'Reflect', {
	  isExtensible: function isExtensible(target){
	    anObject(target);
	    return $isExtensible ? $isExtensible(target) : true;
	  }
	});

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.11 Reflect.ownKeys(target)
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Reflect', {ownKeys: __webpack_require__(301)});

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN     = __webpack_require__(107)
	  , gOPS     = __webpack_require__(100)
	  , anObject = __webpack_require__(69)
	  , Reflect  = __webpack_require__(61).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
	  var keys       = gOPN.f(anObject(it))
	    , getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.12 Reflect.preventExtensions(target)
	var $export            = __webpack_require__(65)
	  , anObject           = __webpack_require__(69)
	  , $preventExtensions = Object.preventExtensions;
	
	$export($export.S, 'Reflect', {
	  preventExtensions: function preventExtensions(target){
	    anObject(target);
	    try {
	      if($preventExtensions)$preventExtensions(target);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	var dP             = __webpack_require__(68)
	  , gOPD           = __webpack_require__(108)
	  , getPrototypeOf = __webpack_require__(116)
	  , has            = __webpack_require__(62)
	  , $export        = __webpack_require__(65)
	  , createDesc     = __webpack_require__(74)
	  , anObject       = __webpack_require__(69)
	  , isObject       = __webpack_require__(70);
	
	function set(target, propertyKey, V/*, receiver*/){
	  var receiver = arguments.length < 4 ? target : arguments[3]
	    , ownDesc  = gOPD.f(anObject(target), propertyKey)
	    , existingDescriptor, proto;
	  if(!ownDesc){
	    if(isObject(proto = getPrototypeOf(target))){
	      return set(proto, propertyKey, V, receiver);
	    }
	    ownDesc = createDesc(0);
	  }
	  if(has(ownDesc, 'value')){
	    if(ownDesc.writable === false || !isObject(receiver))return false;
	    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
	    existingDescriptor.value = V;
	    dP.f(receiver, propertyKey, existingDescriptor);
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}
	
	$export($export.S, 'Reflect', {set: set});

/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	var $export  = __webpack_require__(65)
	  , setProto = __webpack_require__(130);
	
	if(setProto)$export($export.S, 'Reflect', {
	  setPrototypeOf: function setPrototypeOf(target, proto){
	    setProto.check(target, proto);
	    try {
	      setProto.set(target, proto);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/Array.prototype.includes
	var $export   = __webpack_require__(65)
	  , $includes = __webpack_require__(93)(true);
	
	$export($export.P, 'Array', {
	  includes: function includes(el /*, fromIndex = 0 */){
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	
	__webpack_require__(244)('includes');

/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/mathiasbynens/String.prototype.at
	var $export = __webpack_require__(65)
	  , $at     = __webpack_require__(185)(true);
	
	$export($export.P, 'String', {
	  at: function at(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(65)
	  , $pad    = __webpack_require__(308);
	
	$export($export.P, 'String', {
	  padStart: function padStart(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(94)
	  , repeat   = __webpack_require__(149)
	  , defined  = __webpack_require__(92);
	
	module.exports = function(that, maxLength, fillString, left){
	  var S            = String(defined(that))
	    , stringLength = S.length
	    , fillStr      = fillString === undefined ? ' ' : String(fillString)
	    , intMaxLength = toLength(maxLength);
	  if(intMaxLength <= stringLength || fillStr == '')return S;
	  var fillLen = intMaxLength - stringLength
	    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};


/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(65)
	  , $pad    = __webpack_require__(308);
	
	$export($export.P, 'String', {
	  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(140)('trimLeft', function($trim){
	  return function trimLeft(){
	    return $trim(this, 1);
	  };
	}, 'trimStart');

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(140)('trimRight', function($trim){
	  return function trimRight(){
	    return $trim(this, 2);
	  };
	}, 'trimEnd');

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/String.prototype.matchAll/
	var $export     = __webpack_require__(65)
	  , defined     = __webpack_require__(92)
	  , toLength    = __webpack_require__(94)
	  , isRegExp    = __webpack_require__(192)
	  , getFlags    = __webpack_require__(254)
	  , RegExpProto = RegExp.prototype;
	
	var $RegExpStringIterator = function(regexp, string){
	  this._r = regexp;
	  this._s = string;
	};
	
	__webpack_require__(188)($RegExpStringIterator, 'RegExp String', function next(){
	  var match = this._r.exec(this._s);
	  return {value: match, done: match === null};
	});
	
	$export($export.P, 'String', {
	  matchAll: function matchAll(regexp){
	    defined(this);
	    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
	    var S     = String(this)
	      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
	      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
	    rx.lastIndex = toLength(regexp.lastIndex);
	    return new $RegExpStringIterator(rx, S);
	  }
	});

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84)('asyncIterator');

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84)('observable');

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export        = __webpack_require__(65)
	  , ownKeys        = __webpack_require__(301)
	  , toIObject      = __webpack_require__(89)
	  , gOPD           = __webpack_require__(108)
	  , createProperty = __webpack_require__(221);
	
	$export($export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
	    var O       = toIObject(object)
	      , getDesc = gOPD.f
	      , keys    = ownKeys(O)
	      , result  = {}
	      , i       = 0
	      , key, D;
	    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
	    return result;
	  }
	});

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(65)
	  , $values = __webpack_require__(317)(false);
	
	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(87)
	  , toIObject = __webpack_require__(89)
	  , isEnum    = __webpack_require__(101).f;
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export  = __webpack_require__(65)
	  , $entries = __webpack_require__(317)(true);
	
	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export         = __webpack_require__(65)
	  , toObject        = __webpack_require__(115)
	  , aFunction       = __webpack_require__(78)
	  , $defineProperty = __webpack_require__(68);
	
	// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
	__webpack_require__(63) && $export($export.P + __webpack_require__(320), 'Object', {
	  __defineGetter__: function __defineGetter__(P, getter){
	    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
	  }
	});

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	// Forced replacement prototype accessors methods
	module.exports = __webpack_require__(85)|| !__webpack_require__(64)(function(){
	  var K = Math.random();
	  // In FF throws only define methods
	  __defineSetter__.call(null, K, function(){ /* empty */});
	  delete __webpack_require__(61)[K];
	});

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export         = __webpack_require__(65)
	  , toObject        = __webpack_require__(115)
	  , aFunction       = __webpack_require__(78)
	  , $defineProperty = __webpack_require__(68);
	
	// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
	__webpack_require__(63) && $export($export.P + __webpack_require__(320), 'Object', {
	  __defineSetter__: function __defineSetter__(P, setter){
	    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
	  }
	});

/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export                  = __webpack_require__(65)
	  , toObject                 = __webpack_require__(115)
	  , toPrimitive              = __webpack_require__(73)
	  , getPrototypeOf           = __webpack_require__(116)
	  , getOwnPropertyDescriptor = __webpack_require__(108).f;
	
	// B.2.2.4 Object.prototype.__lookupGetter__(P)
	__webpack_require__(63) && $export($export.P + __webpack_require__(320), 'Object', {
	  __lookupGetter__: function __lookupGetter__(P){
	    var O = toObject(this)
	      , K = toPrimitive(P, true)
	      , D;
	    do {
	      if(D = getOwnPropertyDescriptor(O, K))return D.get;
	    } while(O = getPrototypeOf(O));
	  }
	});

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export                  = __webpack_require__(65)
	  , toObject                 = __webpack_require__(115)
	  , toPrimitive              = __webpack_require__(73)
	  , getPrototypeOf           = __webpack_require__(116)
	  , getOwnPropertyDescriptor = __webpack_require__(108).f;
	
	// B.2.2.5 Object.prototype.__lookupSetter__(P)
	__webpack_require__(63) && $export($export.P + __webpack_require__(320), 'Object', {
	  __lookupSetter__: function __lookupSetter__(P){
	    var O = toObject(this)
	      , K = toPrimitive(P, true)
	      , D;
	    do {
	      if(D = getOwnPropertyDescriptor(O, K))return D.set;
	    } while(O = getPrototypeOf(O));
	  }
	});

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(65);
	
	$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(325)('Map')});

/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(132)
	  , from    = __webpack_require__(326);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(263);
	
	module.exports = function(iter, ITERATOR){
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(65);
	
	$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(325)('Set')});

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/ljharb/proposal-global
	var $export = __webpack_require__(65);
	
	$export($export.S, 'System', {global: __webpack_require__(61)});

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/ljharb/proposal-is-error
	var $export = __webpack_require__(65)
	  , cof     = __webpack_require__(91);
	
	$export($export.S, 'Error', {
	  isError: function isError(it){
	    return cof(it) === 'Error';
	  }
	});

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  iaddh: function iaddh(x0, x1, y0, y1){
	    var $x0 = x0 >>> 0
	      , $x1 = x1 >>> 0
	      , $y0 = y0 >>> 0;
	    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
	  }
	});

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  isubh: function isubh(x0, x1, y0, y1){
	    var $x0 = x0 >>> 0
	      , $x1 = x1 >>> 0
	      , $y0 = y0 >>> 0;
	    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
	  }
	});

/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  imulh: function imulh(u, v){
	    var UINT16 = 0xffff
	      , $u = +u
	      , $v = +v
	      , u0 = $u & UINT16
	      , v0 = $v & UINT16
	      , u1 = $u >> 16
	      , v1 = $v >> 16
	      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
	  }
	});

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(65);
	
	$export($export.S, 'Math', {
	  umulh: function umulh(u, v){
	    var UINT16 = 0xffff
	      , $u = +u
	      , $v = +v
	      , u0 = $u & UINT16
	      , v0 = $v & UINT16
	      , u1 = $u >>> 16
	      , v1 = $v >>> 16
	      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
	  }
	});

/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	var metadata                  = __webpack_require__(335)
	  , anObject                  = __webpack_require__(69)
	  , toMetaKey                 = metadata.key
	  , ordinaryDefineOwnMetadata = metadata.set;
	
	metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
	  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
	}});

/***/ },
/* 335 */
/***/ function(module, exports, __webpack_require__) {

	var Map     = __webpack_require__(268)
	  , $export = __webpack_require__(65)
	  , shared  = __webpack_require__(80)('metadata')
	  , store   = shared.store || (shared.store = new (__webpack_require__(272)));
	
	var getOrCreateMetadataMap = function(target, targetKey, create){
	  var targetMetadata = store.get(target);
	  if(!targetMetadata){
	    if(!create)return undefined;
	    store.set(target, targetMetadata = new Map);
	  }
	  var keyMetadata = targetMetadata.get(targetKey);
	  if(!keyMetadata){
	    if(!create)return undefined;
	    targetMetadata.set(targetKey, keyMetadata = new Map);
	  } return keyMetadata;
	};
	var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
	};
	var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
	};
	var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
	  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
	};
	var ordinaryOwnMetadataKeys = function(target, targetKey){
	  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
	    , keys        = [];
	  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
	  return keys;
	};
	var toMetaKey = function(it){
	  return it === undefined || typeof it == 'symbol' ? it : String(it);
	};
	var exp = function(O){
	  $export($export.S, 'Reflect', O);
	};
	
	module.exports = {
	  store: store,
	  map: getOrCreateMetadataMap,
	  has: ordinaryHasOwnMetadata,
	  get: ordinaryGetOwnMetadata,
	  set: ordinaryDefineOwnMetadata,
	  keys: ordinaryOwnMetadataKeys,
	  key: toMetaKey,
	  exp: exp
	};

/***/ },
/* 336 */
/***/ function(module, exports, __webpack_require__) {

	var metadata               = __webpack_require__(335)
	  , anObject               = __webpack_require__(69)
	  , toMetaKey              = metadata.key
	  , getOrCreateMetadataMap = metadata.map
	  , store                  = metadata.store;
	
	metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
	  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
	    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
	  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
	  if(metadataMap.size)return true;
	  var targetMetadata = store.get(target);
	  targetMetadata['delete'](targetKey);
	  return !!targetMetadata.size || store['delete'](target);
	}});

/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	var metadata               = __webpack_require__(335)
	  , anObject               = __webpack_require__(69)
	  , getPrototypeOf         = __webpack_require__(116)
	  , ordinaryHasOwnMetadata = metadata.has
	  , ordinaryGetOwnMetadata = metadata.get
	  , toMetaKey              = metadata.key;
	
	var ordinaryGetMetadata = function(MetadataKey, O, P){
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
	};
	
	metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
	  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	}});

/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	var Set                     = __webpack_require__(271)
	  , from                    = __webpack_require__(326)
	  , metadata                = __webpack_require__(335)
	  , anObject                = __webpack_require__(69)
	  , getPrototypeOf          = __webpack_require__(116)
	  , ordinaryOwnMetadataKeys = metadata.keys
	  , toMetaKey               = metadata.key;
	
	var ordinaryMetadataKeys = function(O, P){
	  var oKeys  = ordinaryOwnMetadataKeys(O, P)
	    , parent = getPrototypeOf(O);
	  if(parent === null)return oKeys;
	  var pKeys  = ordinaryMetadataKeys(parent, P);
	  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
	};
	
	metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
	  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	}});

/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	var metadata               = __webpack_require__(335)
	  , anObject               = __webpack_require__(69)
	  , ordinaryGetOwnMetadata = metadata.get
	  , toMetaKey              = metadata.key;
	
	metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
	  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
	    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	}});

/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	var metadata                = __webpack_require__(335)
	  , anObject                = __webpack_require__(69)
	  , ordinaryOwnMetadataKeys = metadata.keys
	  , toMetaKey               = metadata.key;
	
	metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
	  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	}});

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	var metadata               = __webpack_require__(335)
	  , anObject               = __webpack_require__(69)
	  , getPrototypeOf         = __webpack_require__(116)
	  , ordinaryHasOwnMetadata = metadata.has
	  , toMetaKey              = metadata.key;
	
	var ordinaryHasMetadata = function(MetadataKey, O, P){
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if(hasOwn)return true;
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
	};
	
	metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
	  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	}});

/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	var metadata               = __webpack_require__(335)
	  , anObject               = __webpack_require__(69)
	  , ordinaryHasOwnMetadata = metadata.has
	  , toMetaKey              = metadata.key;
	
	metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
	  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
	    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	}});

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	var metadata                  = __webpack_require__(335)
	  , anObject                  = __webpack_require__(69)
	  , aFunction                 = __webpack_require__(78)
	  , toMetaKey                 = metadata.key
	  , ordinaryDefineOwnMetadata = metadata.set;
	
	metadata.exp({metadata: function metadata(metadataKey, metadataValue){
	  return function decorator(target, targetKey){
	    ordinaryDefineOwnMetadata(
	      metadataKey, metadataValue,
	      (targetKey !== undefined ? anObject : aFunction)(target),
	      toMetaKey(targetKey)
	    );
	  };
	}});

/***/ },
/* 344 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
	var $export   = __webpack_require__(65)
	  , microtask = __webpack_require__(266)()
	  , process   = __webpack_require__(61).process
	  , isNode    = __webpack_require__(91)(process) == 'process';
	
	$export($export.G, {
	  asap: function asap(fn){
	    var domain = isNode && process.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/zenparsing/es-observable
	var $export     = __webpack_require__(65)
	  , global      = __webpack_require__(61)
	  , core        = __webpack_require__(66)
	  , microtask   = __webpack_require__(266)()
	  , OBSERVABLE  = __webpack_require__(82)('observable')
	  , aFunction   = __webpack_require__(78)
	  , anObject    = __webpack_require__(69)
	  , anInstance  = __webpack_require__(147)
	  , redefineAll = __webpack_require__(267)
	  , hide        = __webpack_require__(67)
	  , forOf       = __webpack_require__(263)
	  , RETURN      = forOf.RETURN;
	
	var getMethod = function(fn){
	  return fn == null ? undefined : aFunction(fn);
	};
	
	var cleanupSubscription = function(subscription){
	  var cleanup = subscription._c;
	  if(cleanup){
	    subscription._c = undefined;
	    cleanup();
	  }
	};
	
	var subscriptionClosed = function(subscription){
	  return subscription._o === undefined;
	};
	
	var closeSubscription = function(subscription){
	  if(!subscriptionClosed(subscription)){
	    subscription._o = undefined;
	    cleanupSubscription(subscription);
	  }
	};
	
	var Subscription = function(observer, subscriber){
	  anObject(observer);
	  this._c = undefined;
	  this._o = observer;
	  observer = new SubscriptionObserver(this);
	  try {
	    var cleanup      = subscriber(observer)
	      , subscription = cleanup;
	    if(cleanup != null){
	      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
	      else aFunction(cleanup);
	      this._c = cleanup;
	    }
	  } catch(e){
	    observer.error(e);
	    return;
	  } if(subscriptionClosed(this))cleanupSubscription(this);
	};
	
	Subscription.prototype = redefineAll({}, {
	  unsubscribe: function unsubscribe(){ closeSubscription(this); }
	});
	
	var SubscriptionObserver = function(subscription){
	  this._s = subscription;
	};
	
	SubscriptionObserver.prototype = redefineAll({}, {
	  next: function next(value){
	    var subscription = this._s;
	    if(!subscriptionClosed(subscription)){
	      var observer = subscription._o;
	      try {
	        var m = getMethod(observer.next);
	        if(m)return m.call(observer, value);
	      } catch(e){
	        try {
	          closeSubscription(subscription);
	        } finally {
	          throw e;
	        }
	      }
	    }
	  },
	  error: function error(value){
	    var subscription = this._s;
	    if(subscriptionClosed(subscription))throw value;
	    var observer = subscription._o;
	    subscription._o = undefined;
	    try {
	      var m = getMethod(observer.error);
	      if(!m)throw value;
	      value = m.call(observer, value);
	    } catch(e){
	      try {
	        cleanupSubscription(subscription);
	      } finally {
	        throw e;
	      }
	    } cleanupSubscription(subscription);
	    return value;
	  },
	  complete: function complete(value){
	    var subscription = this._s;
	    if(!subscriptionClosed(subscription)){
	      var observer = subscription._o;
	      subscription._o = undefined;
	      try {
	        var m = getMethod(observer.complete);
	        value = m ? m.call(observer, value) : undefined;
	      } catch(e){
	        try {
	          cleanupSubscription(subscription);
	        } finally {
	          throw e;
	        }
	      } cleanupSubscription(subscription);
	      return value;
	    }
	  }
	});
	
	var $Observable = function Observable(subscriber){
	  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
	};
	
	redefineAll($Observable.prototype, {
	  subscribe: function subscribe(observer){
	    return new Subscription(observer, this._f);
	  },
	  forEach: function forEach(fn){
	    var that = this;
	    return new (core.Promise || global.Promise)(function(resolve, reject){
	      aFunction(fn);
	      var subscription = that.subscribe({
	        next : function(value){
	          try {
	            return fn(value);
	          } catch(e){
	            reject(e);
	            subscription.unsubscribe();
	          }
	        },
	        error: reject,
	        complete: resolve
	      });
	    });
	  }
	});
	
	redefineAll($Observable, {
	  from: function from(x){
	    var C = typeof this === 'function' ? this : $Observable;
	    var method = getMethod(anObject(x)[OBSERVABLE]);
	    if(method){
	      var observable = anObject(method.call(x));
	      return observable.constructor === C ? observable : new C(function(observer){
	        return observable.subscribe(observer);
	      });
	    }
	    return new C(function(observer){
	      var done = false;
	      microtask(function(){
	        if(!done){
	          try {
	            if(forOf(x, false, function(it){
	              observer.next(it);
	              if(done)return RETURN;
	            }) === RETURN)return;
	          } catch(e){
	            if(done)throw e;
	            observer.error(e);
	            return;
	          } observer.complete();
	        }
	      });
	      return function(){ done = true; };
	    });
	  },
	  of: function of(){
	    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
	    return new (typeof this === 'function' ? this : $Observable)(function(observer){
	      var done = false;
	      microtask(function(){
	        if(!done){
	          for(var i = 0; i < items.length; ++i){
	            observer.next(items[i]);
	            if(done)return;
	          } observer.complete();
	        }
	      });
	      return function(){ done = true; };
	    });
	  }
	});
	
	hide($Observable.prototype, OBSERVABLE, function(){ return this; });
	
	$export($export.G, {Observable: $Observable});
	
	__webpack_require__(250)('Observable');

/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var global     = __webpack_require__(61)
	  , $export    = __webpack_require__(65)
	  , invoke     = __webpack_require__(135)
	  , partial    = __webpack_require__(347)
	  , navigator  = global.navigator
	  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
	var wrap = function(set){
	  return MSIE ? function(fn, time /*, ...args */){
	    return set(invoke(
	      partial,
	      [].slice.call(arguments, 2),
	      typeof fn == 'function' ? fn : Function(fn)
	    ), time);
	  } : set;
	};
	$export($export.G + $export.B + $export.F * MSIE, {
	  setTimeout:  wrap(global.setTimeout),
	  setInterval: wrap(global.setInterval)
	});

/***/ },
/* 347 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var path      = __webpack_require__(348)
	  , invoke    = __webpack_require__(135)
	  , aFunction = __webpack_require__(78);
	module.exports = function(/* ...pargs */){
	  var fn     = aFunction(this)
	    , length = arguments.length
	    , pargs  = Array(length)
	    , i      = 0
	    , _      = path._
	    , holder = false;
	  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
	  return function(/* ...args */){
	    var that = this
	      , aLen = arguments.length
	      , j = 0, k = 0, args;
	    if(!holder && !aLen)return invoke(fn, pargs, that);
	    args = pargs.slice();
	    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
	    while(aLen > k)args.push(arguments[k++]);
	    return invoke(fn, args, that);
	  };
	};

/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(61);

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(65)
	  , $task   = __webpack_require__(265);
	$export($export.G + $export.B, {
	  setImmediate:   $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	var $iterators    = __webpack_require__(251)
	  , redefine      = __webpack_require__(75)
	  , global        = __webpack_require__(61)
	  , hide          = __webpack_require__(67)
	  , Iterators     = __webpack_require__(187)
	  , wks           = __webpack_require__(82)
	  , ITERATOR      = wks('iterator')
	  , TO_STRING_TAG = wks('toStringTag')
	  , ArrayValues   = Iterators.Array;
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype
	    , key;
	  if(proto){
	    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
	    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	    Iterators[NAME] = ArrayValues;
	    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
	  }
	}

/***/ },
/* 351 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };
	
	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value instanceof AwaitArgument) {
	          return Promise.resolve(value.arg).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;
	
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }
	
	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }
	
	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );
	
	          if (record.type === "throw") {
	            context.delegate = null;
	
	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }
	
	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;
	
	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }
	
	          context.delegate = null;
	        }
	
	        if (method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = arg;
	
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }
	
	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          var info = {
	            value: record.arg,
	            done: context.done
	          };
	
	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }
	
	      return ContinueSentinel;
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(50)))

/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(353);
	module.exports = __webpack_require__(66).RegExp.escape;

/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/benjamingr/RexExp.escape
	var $export = __webpack_require__(65)
	  , $re     = __webpack_require__(354)(/[\\^$*+?.()|[\]{}]/g, '\\$&');
	
	$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ },
/* 354 */
/***/ function(module, exports) {

	module.exports = function(regExp, replace){
	  var replacer = replace === Object(replace) ? function(part){
	    return replace[part];
	  } : replace;
	  return function(it){
	    return String(it).replace(regExp, replacer);
	  };
	};

/***/ },
/* 355 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Math_within = Math_within;
	exports.linearScaleFns = linearScaleFns;
	exports.localStorageKeys = localStorageKeys;
	exports.labelLog = labelLog;
	
	function precondition(x, msg) {
	  if (!x) throw msg;
	}
	
	function Math_within(x, min, max) {
	  return Math.min(max, Math.max(min, x));
	}
	
	/*
	 linearScaleFns: create functions that scale linearly
	 from [0..1] to a given range. Range can be:
	 * max
	 * min, max
	 * max, min (where scaling is inverted)
	 Returns two functions:
	 * first function (n) => x, where x is normalized 0..1, and x is the specified range
	 * the second function does the reverse scaling
	 */
	function linearScaleFns(minOrMax, max) {
	  var min = void 0;
	
	  if (typeof max == 'undefined') {
	    min = 0;
	    max = minOrMax;
	  } else {
	    min = minOrMax;
	  }
	
	  var flipFn = function flipFn(x) {
	    return x;
	  };
	  if (min > max) {
	    var _ref = [max, min];
	    min = _ref[0];
	    max = _ref[1];
	
	    flipFn = function flipFn(x) {
	      return 1 - x;
	    };
	  }
	
	  var range = max - min;
	
	  var unscaleFn = function unscaleFn(x) {
	    return Math_within(flipFn((x - min) / range), 0, 1);
	  };
	  var scaleFn = function scaleFn(x) {
	    return Math_within(flipFn(x) * range + min, min, max);
	  };
	  return [scaleFn, unscaleFn];
	}
	
	function localStorageKeys() {
	  var keys = [];
	  if (typeof localStorage !== 'undefined') {
	    for (var i = 0; i < localStorage.length; i++) {
	      keys[i] = localStorage.key(i);
	    }
	  }
	  return keys;
	}
	
	function labelLog(label) {
	  return function () {
	    var _global$console;
	
	    for (var _len = arguments.length, msgs = Array(_len), _key = 0; _key < _len; _key++) {
	      msgs[_key] = arguments[_key];
	    }
	
	    (_global$console = global.console).log.apply(_global$console, [label + ': '].concat(msgs));
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.currentTonality$ = exports.tonalities = undefined;
	
	var _BehaviorSubject = __webpack_require__(21);
	
	var _tonalityFactory = __webpack_require__(56);
	
	// MODEL
	var tonalities = exports.tonalities = (0, _tonalityFactory.createTonalities)();
	
	var currentTonality$ = exports.currentTonality$ = new _BehaviorSubject.BehaviorSubject('blues');
	
	// VIEW
	// Build scale control
	var scaleCurrentElem = document.getElementById('scale-current');
	
	currentTonality$.subscribe(function (s) {
	  return scaleCurrentElem.innerHTML = '' + s;
	}); // &#127925;

/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newSoundData = exports.soundOut$ = undefined;
	
	var _Subject = __webpack_require__(22);
	
	var _tonality = __webpack_require__(356);
	
	var synth = new Tone.PolySynth(10, Tone.SimpleSynth).toMaster();
	
	var soundOut$ = exports.soundOut$ = new _Subject.Subject();
	
	soundOut$.subscribe(function (sound) {
	  synth.volume.value = 0; // Normalize it from whatever it was
	  synth.triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity);
	  synth.volume.value = sound.volume;
	});
	
	var newSoundData = exports.newSoundData = function newSoundData(normalized) {
	  var tonality = normalized.tonality || _tonality.currentTonality$.getValue();
	  var frequency = _tonality.tonalities[tonality](normalized.mag);
	  return {
	    frequency: frequency,
	    volume: normalized.sz * 20, // 0.0 .. 1.0  => 30 .. 70
	    velocity: 1 - normalized.sz,
	    duration: normalized.sz
	  };
	};

/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.newDial = newDial;
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(26);
	
	__webpack_require__(359);
	
	__webpack_require__(31);
	
	__webpack_require__(363);
	
	__webpack_require__(370);
	
	__webpack_require__(373);
	
	__webpack_require__(375);
	
	__webpack_require__(377);
	
	var _AnimationFrameScheduler = __webpack_require__(379);
	
	var _svg = __webpack_require__(382);
	
	var _trig = __webpack_require__(383);
	
	function newDial(dom, model$) {
	
	    // VIEW
	    model$.subscribe(function (x) {
	        var startAngle = 0;
	        var value = x * 350 + startAngle;
	        var tempoReading = dom.querySelector('.reading');
	        tempoReading.setAttribute('d', (0, _svg.svgClippedArc)(50, 50, 30, 45, startAngle, value));
	    });
	
	    function pt2rads(pt) {
	        var rads = (0, _trig.ptToVector)(pt)[0];
	        rads = rads + Math.PI / 2;
	        rads = (0, _trig.normalizeRadians)(rads);
	        rads = rads < 0 ? rads + 2 * Math.PI : rads;
	        return rads;
	    }
	
	    // INTENT
	    var click$ = _Observable.Observable.fromEvent(dom, 'click').do(function (e) {
	        return e.preventDefault();
	    });
	
	    click$.map(function (e) {
	        return { x: e.layerX - 50, y: e.layerY - 50 };
	    }).map(pt2rads).map(function (r) {
	        return r * 0.5 / Math.PI;
	    }) // normalize [0..1]
	    .subscribe(model$);
	
	    // A click pauses preview for a while
	    var pauser$ = click$.mapTo(false).merge(click$.delay(1000).mapTo(true)).startWith(true).distinctUntilChanged();
	
	    var mouseMove$ = _Observable.Observable.fromEvent(dom, 'mousemove').throttleTime(100, _AnimationFrameScheduler.animationFrame);
	
	    var stop$ = mouseMove$.debounceTime(2000).merge(click$).merge(_Observable.Observable.fromEvent(dom, 'mouseout'));
	
	    stop$.subscribe(function () {
	        dom.querySelector('.hover').setAttribute('d', '');
	    });
	
	    var preview$ = mouseMove$.filter(function () {
	        return pauser$.last();
	    }).map(function (e) {
	        return { x: e.layerX - 50, y: e.layerY - 50 };
	    }).map(pt2rads).map(function (r) {
	        return r * 0.5 / Math.PI;
	    }); // normalize [0..1]
	
	    preview$.subscribe(function (x) {
	        dom.querySelector('.hover').setAttribute('d', (0, _svg.svgClippedArc)(50, 50, 30, 45, 0, x * 350));
	    });
	
	    return preview$;
	}

/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _delay = __webpack_require__(360);
	
	_Observable.Observable.prototype.delay = _delay.delay;
	//# sourceMappingURL=delay.js.map

/***/ },
/* 360 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.delay = delay;
	
	var _async = __webpack_require__(54);
	
	var _isDate = __webpack_require__(361);
	
	var _Subscriber2 = __webpack_require__(8);
	
	var _Notification = __webpack_require__(362);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Delays the emission of items from the source Observable by a given timeout or
	 * until a given Date.
	 *
	 * <span class="informal">Time shifts each item by some specified amount of
	 * milliseconds.</span>
	 *
	 * <img src="./img/delay.png" width="100%">
	 *
	 * If the delay argument is a Number, this operator time shifts the source
	 * Observable by that amount of time expressed in milliseconds. The relative
	 * time intervals between the values are preserved.
	 *
	 * If the delay argument is a Date, this operator time shifts the start of the
	 * Observable execution until the given date occurs.
	 *
	 * @example <caption>Delay each click by one second</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
	 * delayedClicks.subscribe(x => console.log(x));
	 *
	 * @example <caption>Delay all clicks until a future date happens</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var date = new Date('March 15, 2050 12:00:00'); // in the future
	 * var delayedClicks = clicks.delay(date); // click emitted only after that date
	 * delayedClicks.subscribe(x => console.log(x));
	 *
	 * @see {@link debounceTime}
	 * @see {@link delayWhen}
	 *
	 * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
	 * a `Date` until which the emission of the source items is delayed.
	 * @param {Scheduler} [scheduler=async] The Scheduler to use for
	 * managing the timers that handle the time-shift for each item.
	 * @return {Observable} An Observable that delays the emissions of the source
	 * Observable by the specified timeout or Date.
	 * @method delay
	 * @owner Observable
	 */
	function delay(delay) {
	    var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];
	
	    var absoluteDelay = (0, _isDate.isDate)(delay);
	    var delayFor = absoluteDelay ? +delay - scheduler.now() : Math.abs(delay);
	    return this.lift(new DelayOperator(delayFor, scheduler));
	}
	
	var DelayOperator = function () {
	    function DelayOperator(delay, scheduler) {
	        _classCallCheck(this, DelayOperator);
	
	        this.delay = delay;
	        this.scheduler = scheduler;
	    }
	
	    _createClass(DelayOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
	        }
	    }]);
	
	    return DelayOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var DelaySubscriber = function (_Subscriber) {
	    _inherits(DelaySubscriber, _Subscriber);
	
	    function DelaySubscriber(destination, delay, scheduler) {
	        _classCallCheck(this, DelaySubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DelaySubscriber).call(this, destination));
	
	        _this.delay = delay;
	        _this.scheduler = scheduler;
	        _this.queue = [];
	        _this.active = false;
	        _this.errored = false;
	        return _this;
	    }
	
	    _createClass(DelaySubscriber, [{
	        key: '_schedule',
	        value: function _schedule(scheduler) {
	            this.active = true;
	            this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
	                source: this, destination: this.destination, scheduler: scheduler
	            }));
	        }
	    }, {
	        key: 'scheduleNotification',
	        value: function scheduleNotification(notification) {
	            if (this.errored === true) {
	                return;
	            }
	            var scheduler = this.scheduler;
	            var message = new DelayMessage(scheduler.now() + this.delay, notification);
	            this.queue.push(message);
	            if (this.active === false) {
	                this._schedule(scheduler);
	            }
	        }
	    }, {
	        key: '_next',
	        value: function _next(value) {
	            this.scheduleNotification(_Notification.Notification.createNext(value));
	        }
	    }, {
	        key: '_error',
	        value: function _error(err) {
	            this.errored = true;
	            this.queue = [];
	            this.destination.error(err);
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            this.scheduleNotification(_Notification.Notification.createComplete());
	        }
	    }], [{
	        key: 'dispatch',
	        value: function dispatch(state) {
	            var source = state.source;
	            var queue = source.queue;
	            var scheduler = state.scheduler;
	            var destination = state.destination;
	            while (queue.length > 0 && queue[0].time - scheduler.now() <= 0) {
	                queue.shift().notification.observe(destination);
	            }
	            if (queue.length > 0) {
	                var _delay = Math.max(0, queue[0].time - scheduler.now());
	                this.schedule(state, _delay);
	            } else {
	                source.active = false;
	            }
	        }
	    }]);
	
	    return DelaySubscriber;
	}(_Subscriber2.Subscriber);
	
	var DelayMessage = function DelayMessage(time, notification) {
	    _classCallCheck(this, DelayMessage);
	
	    this.time = time;
	    this.notification = notification;
	};
	//# sourceMappingURL=delay.js.map

/***/ },
/* 361 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isDate = isDate;
	function isDate(value) {
	    return value instanceof Date && !isNaN(+value);
	}
	//# sourceMappingURL=isDate.js.map

/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Notification = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Represents a push-based event or value that an {@link Observable} can emit.
	 * This class is particularly useful for operators that manage notifications,
	 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
	 * others. Besides wrapping the actual delivered value, it also annotates it
	 * with metadata of, for instance, what type of push message it is (`next`,
	 * `error`, or `complete`).
	 *
	 * @see {@link materialize}
	 * @see {@link dematerialize}
	 * @see {@link observeOn}
	 *
	 * @class Notification<T>
	 */
	
	var Notification = exports.Notification = function () {
	    function Notification(kind, value, exception) {
	        _classCallCheck(this, Notification);
	
	        this.kind = kind;
	        this.value = value;
	        this.exception = exception;
	        this.hasValue = kind === 'N';
	    }
	    /**
	     * Delivers to the given `observer` the value wrapped by this Notification.
	     * @param {Observer} observer
	     * @return
	     */
	
	
	    _createClass(Notification, [{
	        key: 'observe',
	        value: function observe(observer) {
	            switch (this.kind) {
	                case 'N':
	                    return observer.next && observer.next(this.value);
	                case 'E':
	                    return observer.error && observer.error(this.exception);
	                case 'C':
	                    return observer.complete && observer.complete();
	            }
	        }
	        /**
	         * Given some {@link Observer} callbacks, deliver the value represented by the
	         * current Notification to the correctly corresponding callback.
	         * @param {function(value: T): void} next An Observer `next` callback.
	         * @param {function(err: any): void} [error] An Observer `error` callback.
	         * @param {function(): void} [complete] An Observer `complete` callback.
	         * @return {any}
	         */
	
	    }, {
	        key: 'do',
	        value: function _do(next, error, complete) {
	            var kind = this.kind;
	            switch (kind) {
	                case 'N':
	                    return next && next(this.value);
	                case 'E':
	                    return error && error(this.exception);
	                case 'C':
	                    return complete && complete();
	            }
	        }
	        /**
	         * Takes an Observer or its individual callback functions, and calls `observe`
	         * or `do` methods accordingly.
	         * @param {Observer|function(value: T): void} nextOrObserver An Observer or
	         * the `next` callback.
	         * @param {function(err: any): void} [error] An Observer `error` callback.
	         * @param {function(): void} [complete] An Observer `complete` callback.
	         * @return {any}
	         */
	
	    }, {
	        key: 'accept',
	        value: function accept(nextOrObserver, error, complete) {
	            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	                return this.observe(nextOrObserver);
	            } else {
	                return this.do(nextOrObserver, error, complete);
	            }
	        }
	        /**
	         * Returns a simple Observable that just delivers the notification represented
	         * by this Notification instance.
	         * @return {any}
	         */
	
	    }, {
	        key: 'toObservable',
	        value: function toObservable() {
	            var kind = this.kind;
	            switch (kind) {
	                case 'N':
	                    return _Observable.Observable.of(this.value);
	                case 'E':
	                    return _Observable.Observable.throw(this.exception);
	                case 'C':
	                    return _Observable.Observable.empty();
	            }
	        }
	        /**
	         * A shortcut to create a Notification instance of the type `next` from a
	         * given value.
	         * @param {T} value The `next` value.
	         * @return {Notification<T>} The "next" Notification representing the
	         * argument.
	         */
	
	    }], [{
	        key: 'createNext',
	        value: function createNext(value) {
	            if (typeof value !== 'undefined') {
	                return new Notification('N', value);
	            }
	            return this.undefinedValueNotification;
	        }
	        /**
	         * A shortcut to create a Notification instance of the type `error` from a
	         * given error.
	         * @param {any} [err] The `error` exception.
	         * @return {Notification<T>} The "error" Notification representing the
	         * argument.
	         */
	
	    }, {
	        key: 'createError',
	        value: function createError(err) {
	            return new Notification('E', undefined, err);
	        }
	        /**
	         * A shortcut to create a Notification instance of the type `complete`.
	         * @return {Notification<any>} The valueless "complete" Notification.
	         */
	
	    }, {
	        key: 'createComplete',
	        value: function createComplete() {
	            return this.completeNotification;
	        }
	    }]);
	
	    return Notification;
	}();
	
	Notification.completeNotification = new Notification('C');
	Notification.undefinedValueNotification = new Notification('N', undefined);
	//# sourceMappingURL=Notification.js.map

/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _merge = __webpack_require__(364);
	
	_Observable.Observable.prototype.merge = _merge.merge;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.merge = merge;
	exports.mergeStatic = mergeStatic;
	
	var _ArrayObservable = __webpack_require__(365);
	
	var _mergeAll = __webpack_require__(369);
	
	var _isScheduler = __webpack_require__(368);
	
	/**
	 * Creates an output Observable which concurrently emits all values from every
	 * given input Observable.
	 *
	 * <span class="informal">Flattens multiple Observables together by blending
	 * their values into one Observable.</span>
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * `merge` subscribes to each given input Observable (either the source or an
	 * Observable given as argument), and simply forwards (without doing any
	 * transformation) all the values from all the input Observables to the output
	 * Observable. The output Observable only completes once all input Observables
	 * have completed. Any error delivered by an input Observable will be immediately
	 * emitted on the output Observable.
	 *
	 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var timer = Rx.Observable.interval(1000);
	 * var clicksOrTimer = clicks.merge(timer);
	 * clicksOrTimer.subscribe(x => console.log(x));
	 *
	 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var concurrent = 2; // the argument
	 * var merged = timer1.merge(timer2, timer3, concurrent);
	 * merged.subscribe(x => console.log(x));
	 *
	 * @see {@link mergeAll}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 *
	 * @param {Observable} other An input Observable to merge with the source
	 * Observable. More than one input Observables may be given as argument.
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
	 * Observables being subscribed to concurrently.
	 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
	 * concurrency of input Observables.
	 * @return {Observable} an Observable that emits items that are the result of
	 * every input Observable.
	 * @method merge
	 * @owner Observable
	 */
	function merge() {
	    for (var _len = arguments.length, observables = Array(_len), _key = 0; _key < _len; _key++) {
	        observables[_key] = arguments[_key];
	    }
	
	    observables.unshift(this);
	    return mergeStatic.apply(this, observables);
	}
	/* tslint:enable:max-line-length */
	/**
	 * Creates an output Observable which concurrently emits all values from every
	 * given input Observable.
	 *
	 * <span class="informal">Flattens multiple Observables together by blending
	 * their values into one Observable.</span>
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * `merge` subscribes to each given input Observable (as arguments), and simply
	 * forwards (without doing any transformation) all the values from all the input
	 * Observables to the output Observable. The output Observable only completes
	 * once all input Observables have completed. Any error delivered by an input
	 * Observable will be immediately emitted on the output Observable.
	 *
	 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var timer = Rx.Observable.interval(1000);
	 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
	 * clicksOrTimer.subscribe(x => console.log(x));
	 *
	 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var concurrent = 2; // the argument
	 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
	 * merged.subscribe(x => console.log(x));
	 *
	 * @see {@link mergeAll}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 *
	 * @param {Observable} input1 An input Observable to merge with others.
	 * @param {Observable} input2 An input Observable to merge with others.
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
	 * Observables being subscribed to concurrently.
	 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
	 * concurrency of input Observables.
	 * @return {Observable} an Observable that emits items that are the result of
	 * every input Observable.
	 * @static true
	 * @name merge
	 * @owner Observable
	 */
	function mergeStatic() {
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	
	    for (var _len2 = arguments.length, observables = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        observables[_key2] = arguments[_key2];
	    }
	
	    var last = observables[observables.length - 1];
	    if ((0, _isScheduler.isScheduler)(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    } else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (observables.length === 1) {
	        return observables[0];
	    }
	    return new _ArrayObservable.ArrayObservable(observables, scheduler).lift(new _mergeAll.MergeAllOperator(concurrent));
	}
	//# sourceMappingURL=merge.js.map

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ArrayObservable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable2 = __webpack_require__(4);
	
	var _ScalarObservable = __webpack_require__(366);
	
	var _EmptyObservable = __webpack_require__(367);
	
	var _isScheduler = __webpack_require__(368);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	
	var ArrayObservable = exports.ArrayObservable = function (_Observable) {
	    _inherits(ArrayObservable, _Observable);
	
	    function ArrayObservable(array, scheduler) {
	        _classCallCheck(this, ArrayObservable);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayObservable).call(this));
	
	        _this.array = array;
	        _this.scheduler = scheduler;
	        if (!scheduler && array.length === 1) {
	            _this._isScalar = true;
	            _this.value = array[0];
	        }
	        return _this;
	    }
	
	    _createClass(ArrayObservable, [{
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var index = 0;
	            var array = this.array;
	            var count = array.length;
	            var scheduler = this.scheduler;
	            if (scheduler) {
	                return scheduler.schedule(ArrayObservable.dispatch, 0, {
	                    array: array, index: index, count: count, subscriber: subscriber
	                });
	            } else {
	                for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
	                    subscriber.next(array[i]);
	                }
	                subscriber.complete();
	            }
	        }
	    }], [{
	        key: 'create',
	        value: function create(array, scheduler) {
	            return new ArrayObservable(array, scheduler);
	        }
	        /**
	         * Creates an Observable that emits some values you specify as arguments,
	         * immediately one after the other, and then emits a complete notification.
	         *
	         * <span class="informal">Emits the arguments you provide, then completes.
	         * </span>
	         *
	         * <img src="./img/of.png" width="100%">
	         *
	         * This static operator is useful for creating a simple Observable that only
	         * emits the arguments given, and the complete notification thereafter. It can
	         * be used for composing with other Observables, such as with {@link concat}.
	         * By default, it uses a `null` Scheduler, which means the `next`
	         * notifications are sent synchronously, although with a different Scheduler
	         * it is possible to determine when those notifications will be delivered.
	         *
	         * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
	         * var numbers = Rx.Observable.of(10, 20, 30);
	         * var letters = Rx.Observable.of('a', 'b', 'c');
	         * var interval = Rx.Observable.interval(1000);
	         * var result = numbers.concat(letters).concat(interval);
	         * result.subscribe(x => console.log(x));
	         *
	         * @see {@link create}
	         * @see {@link empty}
	         * @see {@link never}
	         * @see {@link throw}
	         *
	         * @param {...T} values Arguments that represent `next` values to be emitted.
	         * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
	         * the emissions of the `next` notifications.
	         * @return {Observable<T>} An Observable that emits each given input value.
	         * @static true
	         * @name of
	         * @owner Observable
	         */
	
	    }, {
	        key: 'of',
	        value: function of() {
	            for (var _len = arguments.length, array = Array(_len), _key = 0; _key < _len; _key++) {
	                array[_key] = arguments[_key];
	            }
	
	            var scheduler = array[array.length - 1];
	            if ((0, _isScheduler.isScheduler)(scheduler)) {
	                array.pop();
	            } else {
	                scheduler = null;
	            }
	            var len = array.length;
	            if (len > 1) {
	                return new ArrayObservable(array, scheduler);
	            } else if (len === 1) {
	                return new _ScalarObservable.ScalarObservable(array[0], scheduler);
	            } else {
	                return new _EmptyObservable.EmptyObservable(scheduler);
	            }
	        }
	    }, {
	        key: 'dispatch',
	        value: function dispatch(state) {
	            var array = state.array;
	            var index = state.index;
	            var count = state.count;
	            var subscriber = state.subscriber;
	
	            if (index >= count) {
	                subscriber.complete();
	                return;
	            }
	            subscriber.next(array[index]);
	            if (subscriber.isUnsubscribed) {
	                return;
	            }
	            state.index = index + 1;
	            this.schedule(state);
	        }
	    }]);

	    return ArrayObservable;
	}(_Observable2.Observable);
	//# sourceMappingURL=ArrayObservable.js.map

/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ScalarObservable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable2 = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	
	var ScalarObservable = exports.ScalarObservable = function (_Observable) {
	    _inherits(ScalarObservable, _Observable);
	
	    function ScalarObservable(value, scheduler) {
	        _classCallCheck(this, ScalarObservable);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScalarObservable).call(this));
	
	        _this.value = value;
	        _this.scheduler = scheduler;
	        _this._isScalar = true;
	        if (scheduler) {
	            _this._isScalar = false;
	        }
	        return _this;
	    }
	
	    _createClass(ScalarObservable, [{
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var value = this.value;
	            var scheduler = this.scheduler;
	            if (scheduler) {
	                return scheduler.schedule(ScalarObservable.dispatch, 0, {
	                    done: false, value: value, subscriber: subscriber
	                });
	            } else {
	                subscriber.next(value);
	                if (!subscriber.isUnsubscribed) {
	                    subscriber.complete();
	                }
	            }
	        }
	    }], [{
	        key: 'create',
	        value: function create(value, scheduler) {
	            return new ScalarObservable(value, scheduler);
	        }
	    }, {
	        key: 'dispatch',
	        value: function dispatch(state) {
	            var done = state.done;
	            var value = state.value;
	            var subscriber = state.subscriber;
	
	            if (done) {
	                subscriber.complete();
	                return;
	            }
	            subscriber.next(value);
	            if (subscriber.isUnsubscribed) {
	                return;
	            }
	            state.done = true;
	            this.schedule(state);
	        }
	    }]);

	    return ScalarObservable;
	}(_Observable2.Observable);
	//# sourceMappingURL=ScalarObservable.js.map

/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.EmptyObservable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observable2 = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	
	var EmptyObservable = exports.EmptyObservable = function (_Observable) {
	    _inherits(EmptyObservable, _Observable);
	
	    function EmptyObservable(scheduler) {
	        _classCallCheck(this, EmptyObservable);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EmptyObservable).call(this));
	
	        _this.scheduler = scheduler;
	        return _this;
	    }
	    /**
	     * Creates an Observable that emits no items to the Observer and immediately
	     * emits a complete notification.
	     *
	     * <span class="informal">Just emits 'complete', and nothing else.
	     * </span>
	     *
	     * <img src="./img/empty.png" width="100%">
	     *
	     * This static operator is useful for creating a simple Observable that only
	     * emits the complete notification. It can be used for composing with other
	     * Observables, such as in a {@link mergeMap}.
	     *
	     * @example <caption>Emit the number 7, then complete.</caption>
	     * var result = Rx.Observable.empty().startWith(7);
	     * result.subscribe(x => console.log(x));
	     *
	     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
	     * var interval = Rx.Observable.interval(1000);
	     * var result = interval.mergeMap(x =>
	     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
	     * );
	     * result.subscribe(x => console.log(x));
	     *
	     * @see {@link create}
	     * @see {@link never}
	     * @see {@link of}
	     * @see {@link throw}
	     *
	     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
	     * the emission of the complete notification.
	     * @return {Observable} An "empty" Observable: emits only the complete
	     * notification.
	     * @static true
	     * @name empty
	     * @owner Observable
	     */
	
	
	    _createClass(EmptyObservable, [{
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var scheduler = this.scheduler;
	            if (scheduler) {
	                return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
	            } else {
	                subscriber.complete();
	            }
	        }
	    }], [{
	        key: 'create',
	        value: function create(scheduler) {
	            return new EmptyObservable(scheduler);
	        }
	    }, {
	        key: 'dispatch',
	        value: function dispatch(arg) {
	            var subscriber = arg.subscriber;
	
	            subscriber.complete();
	        }
	    }]);

	    return EmptyObservable;
	}(_Observable2.Observable);
	//# sourceMappingURL=EmptyObservable.js.map

/***/ },
/* 368 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isScheduler = isScheduler;
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	//# sourceMappingURL=isScheduler.js.map

/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MergeAllSubscriber = exports.MergeAllOperator = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.mergeAll = mergeAll;
	
	var _OuterSubscriber2 = __webpack_require__(40);
	
	var _subscribeToResult = __webpack_require__(41);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Converts a higher-order Observable into a first-order Observable which
	 * concurrently delivers all values that are emitted on the inner Observables.
	 *
	 * <span class="informal">Flattens an Observable-of-Observables.</span>
	 *
	 * <img src="./img/mergeAll.png" width="100%">
	 *
	 * `mergeAll` subscribes to an Observable that emits Observables, also known as
	 * a higher-order Observable. Each time it observes one of these emitted inner
	 * Observables, it subscribes to that and delivers all the values from the
	 * inner Observable on the output Observable. The output Observable only
	 * completes once all inner Observables have completed. Any error delivered by
	 * a inner Observable will be immediately emitted on the output Observable.
	 *
	 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
	 * var firstOrder = higherOrder.mergeAll();
	 * firstOrder.subscribe(x => console.log(x));
	 *
	 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
	 * var firstOrder = higherOrder.mergeAll(2);
	 * firstOrder.subscribe(x => console.log(x));
	 *
	 * @see {@link combineAll}
	 * @see {@link concatAll}
	 * @see {@link exhaust}
	 * @see {@link merge}
	 * @see {@link mergeMap}
	 * @see {@link mergeMapTo}
	 * @see {@link mergeScan}
	 * @see {@link switch}
	 * @see {@link zipAll}
	 *
	 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
	 * Observables being subscribed to concurrently.
	 * @return {Observable} An Observable that emits values coming from all the
	 * inner Observables emitted by the source Observable.
	 * @method mergeAll
	 * @owner Observable
	 */
	function mergeAll() {
	    var concurrent = arguments.length <= 0 || arguments[0] === undefined ? Number.POSITIVE_INFINITY : arguments[0];
	
	    return this.lift(new MergeAllOperator(concurrent));
	}
	
	var MergeAllOperator = exports.MergeAllOperator = function () {
	    function MergeAllOperator(concurrent) {
	        _classCallCheck(this, MergeAllOperator);
	
	        this.concurrent = concurrent;
	    }
	
	    _createClass(MergeAllOperator, [{
	        key: 'call',
	        value: function call(observer, source) {
	            return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
	        }
	    }]);
	
	    return MergeAllOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var MergeAllSubscriber = exports.MergeAllSubscriber = function (_OuterSubscriber) {
	    _inherits(MergeAllSubscriber, _OuterSubscriber);
	
	    function MergeAllSubscriber(destination, concurrent) {
	        _classCallCheck(this, MergeAllSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MergeAllSubscriber).call(this, destination));
	
	        _this.concurrent = concurrent;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        return _this;
	    }
	
	    _createClass(MergeAllSubscriber, [{
	        key: '_next',
	        value: function _next(observable) {
	            if (this.active < this.concurrent) {
	                this.active++;
	                this.add((0, _subscribeToResult.subscribeToResult)(this, observable));
	            } else {
	                this.buffer.push(observable);
	            }
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            this.hasCompleted = true;
	            if (this.active === 0 && this.buffer.length === 0) {
	                this.destination.complete();
	            }
	        }
	    }, {
	        key: 'notifyComplete',
	        value: function notifyComplete(innerSub) {
	            var buffer = this.buffer;
	            this.remove(innerSub);
	            this.active--;
	            if (buffer.length > 0) {
	                this._next(buffer.shift());
	            } else if (this.active === 0 && this.hasCompleted) {
	                this.destination.complete();
	            }
	        }
	    }]);

	    return MergeAllSubscriber;
	}(_OuterSubscriber2.OuterSubscriber);
	//# sourceMappingURL=mergeAll.js.map

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _startWith = __webpack_require__(371);
	
	_Observable.Observable.prototype.startWith = _startWith.startWith;
	//# sourceMappingURL=startWith.js.map

/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.startWith = startWith;
	
	var _ArrayObservable = __webpack_require__(365);
	
	var _ScalarObservable = __webpack_require__(366);
	
	var _EmptyObservable = __webpack_require__(367);
	
	var _concat = __webpack_require__(372);
	
	var _isScheduler = __webpack_require__(368);
	
	/**
	 * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
	 * source Observable.
	 *
	 * <img src="./img/startWith.png" width="100%">
	 *
	 * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
	 * @return {Observable} an Observable that emits the items in the specified Iterable and then emits the items
	 * emitted by the source Observable.
	 * @method startWith
	 * @owner Observable
	 */
	function startWith() {
	    for (var _len = arguments.length, array = Array(_len), _key = 0; _key < _len; _key++) {
	        array[_key] = arguments[_key];
	    }
	
	    var scheduler = array[array.length - 1];
	    if ((0, _isScheduler.isScheduler)(scheduler)) {
	        array.pop();
	    } else {
	        scheduler = null;
	    }
	    var len = array.length;
	    if (len === 1) {
	        return (0, _concat.concatStatic)(new _ScalarObservable.ScalarObservable(array[0], scheduler), this);
	    } else if (len > 1) {
	        return (0, _concat.concatStatic)(new _ArrayObservable.ArrayObservable(array, scheduler), this);
	    } else {
	        return (0, _concat.concatStatic)(new _EmptyObservable.EmptyObservable(scheduler), this);
	    }
	}
	//# sourceMappingURL=startWith.js.map

/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.concat = concat;
	exports.concatStatic = concatStatic;
	
	var _isScheduler = __webpack_require__(368);
	
	var _ArrayObservable = __webpack_require__(365);
	
	var _mergeAll = __webpack_require__(369);
	
	/**
	 * Creates an output Observable which sequentially emits all values from every
	 * given input Observable after the current Observable.
	 *
	 * <span class="informal">Concatenates multiple Observables together by
	 * sequentially emitting their values, one Observable after the other.</span>
	 *
	 * <img src="./img/concat.png" width="100%">
	 *
	 * Joins this Observable with multiple other Observables by subscribing to them
	 * one at a time, starting with the source, and merging their results into the
	 * output Observable. Will wait for each Observable to complete before moving
	 * on to the next.
	 *
	 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
	 * var timer = Rx.Observable.interval(1000).take(4);
	 * var sequence = Rx.Observable.range(1, 10);
	 * var result = timer.concat(sequence);
	 * result.subscribe(x => console.log(x));
	 *
	 * @example <caption>Concatenate 3 Observables</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var result = timer1.concat(timer2, timer3);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link concatAll}
	 * @see {@link concatMap}
	 * @see {@link concatMapTo}
	 *
	 * @param {Observable} other An input Observable to concatenate after the source
	 * Observable. More than one input Observables may be given as argument.
	 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
	 * Observable subscription on.
	 * @return {Observable} All values of each passed Observable merged into a
	 * single Observable, in order, in serial fashion.
	 * @method concat
	 * @owner Observable
	 */
	function concat() {
	    for (var _len = arguments.length, observables = Array(_len), _key = 0; _key < _len; _key++) {
	        observables[_key] = arguments[_key];
	    }
	
	    return concatStatic.apply(undefined, [this].concat(observables));
	}
	/* tslint:enable:max-line-length */
	/**
	 * Creates an output Observable which sequentially emits all values from every
	 * given input Observable after the current Observable.
	 *
	 * <span class="informal">Concatenates multiple Observables together by
	 * sequentially emitting their values, one Observable after the other.</span>
	 *
	 * <img src="./img/concat.png" width="100%">
	 *
	 * Joins multiple Observables together by subscribing to them one at a time and
	 * merging their results into the output Observable. Will wait for each
	 * Observable to complete before moving on to the next.
	 *
	 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
	 * var timer = Rx.Observable.interval(1000).take(4);
	 * var sequence = Rx.Observable.range(1, 10);
	 * var result = Rx.Observable.concat(timer, sequence);
	 * result.subscribe(x => console.log(x));
	 *
	 * @example <caption>Concatenate 3 Observables</caption>
	 * var timer1 = Rx.Observable.interval(1000).take(10);
	 * var timer2 = Rx.Observable.interval(2000).take(6);
	 * var timer3 = Rx.Observable.interval(500).take(10);
	 * var result = Rx.Observable.concat(timer1, timer2, timer3);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link concatAll}
	 * @see {@link concatMap}
	 * @see {@link concatMapTo}
	 *
	 * @param {Observable} input1 An input Observable to concatenate with others.
	 * @param {Observable} input2 An input Observable to concatenate with others.
	 * More than one input Observables may be given as argument.
	 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
	 * Observable subscription on.
	 * @return {Observable} All values of each passed Observable merged into a
	 * single Observable, in order, in serial fashion.
	 * @static true
	 * @name concat
	 * @owner Observable
	 */
	function concatStatic() {
	    var scheduler = null;
	
	    for (var _len2 = arguments.length, observables = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        observables[_key2] = arguments[_key2];
	    }
	
	    var args = observables;
	    if ((0, _isScheduler.isScheduler)(args[observables.length - 1])) {
	        scheduler = args.pop();
	    }
	    return new _ArrayObservable.ArrayObservable(observables, scheduler).lift(new _mergeAll.MergeAllOperator(1));
	}
	//# sourceMappingURL=concat.js.map

/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _distinctUntilChanged = __webpack_require__(374);
	
	_Observable.Observable.prototype.distinctUntilChanged = _distinctUntilChanged.distinctUntilChanged;
	//# sourceMappingURL=distinctUntilChanged.js.map

/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.distinctUntilChanged = distinctUntilChanged;
	
	var _Subscriber2 = __webpack_require__(8);
	
	var _tryCatch = __webpack_require__(13);
	
	var _errorObject = __webpack_require__(14);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
	 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
	 * @method distinctUntilChanged
	 * @owner Observable
	 */
	function distinctUntilChanged(compare, keySelector) {
	    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
	}
	
	var DistinctUntilChangedOperator = function () {
	    function DistinctUntilChangedOperator(compare, keySelector) {
	        _classCallCheck(this, DistinctUntilChangedOperator);
	
	        this.compare = compare;
	        this.keySelector = keySelector;
	    }
	
	    _createClass(DistinctUntilChangedOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
	        }
	    }]);
	
	    return DistinctUntilChangedOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var DistinctUntilChangedSubscriber = function (_Subscriber) {
	    _inherits(DistinctUntilChangedSubscriber, _Subscriber);
	
	    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
	        _classCallCheck(this, DistinctUntilChangedSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DistinctUntilChangedSubscriber).call(this, destination));
	
	        _this.keySelector = keySelector;
	        _this.hasKey = false;
	        if (typeof compare === 'function') {
	            _this.compare = compare;
	        }
	        return _this;
	    }
	
	    _createClass(DistinctUntilChangedSubscriber, [{
	        key: 'compare',
	        value: function compare(x, y) {
	            return x === y;
	        }
	    }, {
	        key: '_next',
	        value: function _next(value) {
	            var keySelector = this.keySelector;
	            var key = value;
	            if (keySelector) {
	                key = (0, _tryCatch.tryCatch)(this.keySelector)(value);
	                if (key === _errorObject.errorObject) {
	                    return this.destination.error(_errorObject.errorObject.e);
	                }
	            }
	            var result = false;
	            if (this.hasKey) {
	                result = (0, _tryCatch.tryCatch)(this.compare)(this.key, key);
	                if (result === _errorObject.errorObject) {
	                    return this.destination.error(_errorObject.errorObject.e);
	                }
	            } else {
	                this.hasKey = true;
	            }
	            if (Boolean(result) === false) {
	                this.key = key;
	                this.destination.next(value);
	            }
	        }
	    }]);

	    return DistinctUntilChangedSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=distinctUntilChanged.js.map

/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _throttleTime = __webpack_require__(376);
	
	_Observable.Observable.prototype.throttleTime = _throttleTime.throttleTime;
	//# sourceMappingURL=throttleTime.js.map

/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.throttleTime = throttleTime;
	
	var _Subscriber2 = __webpack_require__(8);
	
	var _async = __webpack_require__(54);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Emits a value from the source Observable, then ignores subsequent source
	 * values for `duration` milliseconds, then repeats this process.
	 *
	 * <span class="informal">Lets a value pass, then ignores source values for the
	 * next `duration` milliseconds.</span>
	 *
	 * <img src="./img/throttleTime.png" width="100%">
	 *
	 * `throttleTime` emits the source Observable values on the output Observable
	 * when its internal timer is disabled, and ignores source values when the timer
	 * is enabled. Initially, the timer is disabled. As soon as the first source
	 * value arrives, it is forwarded to the output Observable, and then the timer
	 * is enabled. After `duration` milliseconds (or the time unit determined
	 * internally by the optional `scheduler`) has passed, the timer is disabled,
	 * and this process repeats for the next source value. Optionally takes a
	 * {@link Scheduler} for managing timers.
	 *
	 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var result = clicks.throttleTime(1000);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link auditTime}
	 * @see {@link debounceTime}
	 * @see {@link delay}
	 * @see {@link sampleTime}
	 * @see {@link throttle}
	 *
	 * @param {number} duration Time to wait before emitting another value after
	 * emitting the last value, measured in milliseconds or the time unit determined
	 * internally by the optional `scheduler`.
	 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
	 * managing the timers that handle the sampling.
	 * @return {Observable<T>} An Observable that performs the throttle operation to
	 * limit the rate of emissions from the source.
	 * @method throttleTime
	 * @owner Observable
	 */
	function throttleTime(duration) {
	    var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];
	
	    return this.lift(new ThrottleTimeOperator(duration, scheduler));
	}
	
	var ThrottleTimeOperator = function () {
	    function ThrottleTimeOperator(duration, scheduler) {
	        _classCallCheck(this, ThrottleTimeOperator);
	
	        this.duration = duration;
	        this.scheduler = scheduler;
	    }
	
	    _createClass(ThrottleTimeOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler));
	        }
	    }]);
	
	    return ThrottleTimeOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var ThrottleTimeSubscriber = function (_Subscriber) {
	    _inherits(ThrottleTimeSubscriber, _Subscriber);
	
	    function ThrottleTimeSubscriber(destination, duration, scheduler) {
	        _classCallCheck(this, ThrottleTimeSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ThrottleTimeSubscriber).call(this, destination));
	
	        _this.duration = duration;
	        _this.scheduler = scheduler;
	        return _this;
	    }
	
	    _createClass(ThrottleTimeSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            if (!this.throttled) {
	                this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
	                this.destination.next(value);
	            }
	        }
	    }, {
	        key: 'clearThrottle',
	        value: function clearThrottle() {
	            var throttled = this.throttled;
	            if (throttled) {
	                throttled.unsubscribe();
	                this.remove(throttled);
	                this.throttled = null;
	            }
	        }
	    }]);
	
	    return ThrottleTimeSubscriber;
	}(_Subscriber2.Subscriber);
	
	function dispatchNext(arg) {
	    var subscriber = arg.subscriber;
	
	    subscriber.clearThrottle();
	}
	//# sourceMappingURL=throttleTime.js.map

/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _debounceTime = __webpack_require__(378);
	
	_Observable.Observable.prototype.debounceTime = _debounceTime.debounceTime;
	//# sourceMappingURL=debounceTime.js.map

/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.debounceTime = debounceTime;
	
	var _Subscriber2 = __webpack_require__(8);
	
	var _async = __webpack_require__(54);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Emits a value from the source Observable only after a particular time span
	 * has passed without another source emission.
	 *
	 * <span class="informal">It's like {@link delay}, but passes only the most
	 * recent value from each burst of emissions.</span>
	 *
	 * <img src="./img/debounceTime.png" width="100%">
	 *
	 * `debounceTime` delays values emitted by the source Observable, but drops
	 * previous pending delayed emissions if a new value arrives on the source
	 * Observable. This operator keeps track of the most recent value from the
	 * source Observable, and emits that only when `dueTime` enough time has passed
	 * without any other value appearing on the source Observable. If a new value
	 * appears before `dueTime` silence occurs, the previous value will be dropped
	 * and will not be emitted on the output Observable.
	 *
	 * This is a rate-limiting operator, because it is impossible for more than one
	 * value to be emitted in any time window of duration `dueTime`, but it is also
	 * a delay-like operator since output emissions do not occur at the same time as
	 * they did on the source Observable. Optionally takes a {@link Scheduler} for
	 * managing timers.
	 *
	 * @example <caption>Emit the most recent click after a burst of clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var result = clicks.debounceTime(1000);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link auditTime}
	 * @see {@link debounce}
	 * @see {@link delay}
	 * @see {@link sampleTime}
	 * @see {@link throttleTime}
	 *
	 * @param {number} dueTime The timeout duration in milliseconds (or the time
	 * unit determined internally by the optional `scheduler`) for the window of
	 * time required to wait for emission silence before emitting the most recent
	 * source value.
	 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
	 * managing the timers that handle the timeout for each value.
	 * @return {Observable} An Observable that delays the emissions of the source
	 * Observable by the specified `dueTime`, and may drop some values if they occur
	 * too frequently.
	 * @method debounceTime
	 * @owner Observable
	 */
	function debounceTime(dueTime) {
	    var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];
	
	    return this.lift(new DebounceTimeOperator(dueTime, scheduler));
	}
	
	var DebounceTimeOperator = function () {
	    function DebounceTimeOperator(dueTime, scheduler) {
	        _classCallCheck(this, DebounceTimeOperator);
	
	        this.dueTime = dueTime;
	        this.scheduler = scheduler;
	    }
	
	    _createClass(DebounceTimeOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
	        }
	    }]);
	
	    return DebounceTimeOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var DebounceTimeSubscriber = function (_Subscriber) {
	    _inherits(DebounceTimeSubscriber, _Subscriber);
	
	    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
	        _classCallCheck(this, DebounceTimeSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DebounceTimeSubscriber).call(this, destination));
	
	        _this.dueTime = dueTime;
	        _this.scheduler = scheduler;
	        _this.debouncedSubscription = null;
	        _this.lastValue = null;
	        _this.hasValue = false;
	        return _this;
	    }
	
	    _createClass(DebounceTimeSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            this.clearDebounce();
	            this.lastValue = value;
	            this.hasValue = true;
	            this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
	        }
	    }, {
	        key: '_complete',
	        value: function _complete() {
	            this.debouncedNext();
	            this.destination.complete();
	        }
	    }, {
	        key: 'debouncedNext',
	        value: function debouncedNext() {
	            this.clearDebounce();
	            if (this.hasValue) {
	                this.destination.next(this.lastValue);
	                this.lastValue = null;
	                this.hasValue = false;
	            }
	        }
	    }, {
	        key: 'clearDebounce',
	        value: function clearDebounce() {
	            var debouncedSubscription = this.debouncedSubscription;
	            if (debouncedSubscription !== null) {
	                this.remove(debouncedSubscription);
	                debouncedSubscription.unsubscribe();
	                this.debouncedSubscription = null;
	            }
	        }
	    }]);
	
	    return DebounceTimeSubscriber;
	}(_Subscriber2.Subscriber);
	
	function dispatchNext(subscriber) {
	    subscriber.debouncedNext();
	}
	//# sourceMappingURL=debounceTime.js.map

/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AnimationFrameScheduler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _QueueScheduler2 = __webpack_require__(52);
	
	var _AnimationFrameAction = __webpack_require__(380);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AnimationFrameScheduler = exports.AnimationFrameScheduler = function (_QueueScheduler) {
	    _inherits(AnimationFrameScheduler, _QueueScheduler);
	
	    function AnimationFrameScheduler() {
	        _classCallCheck(this, AnimationFrameScheduler);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(AnimationFrameScheduler).apply(this, arguments));
	    }
	
	    _createClass(AnimationFrameScheduler, [{
	        key: 'scheduleNow',
	        value: function scheduleNow(work, state) {
	            return new _AnimationFrameAction.AnimationFrameAction(this, work).schedule(state);
	        }
	    }]);

	    return AnimationFrameScheduler;
	}(_QueueScheduler2.QueueScheduler);
	//# sourceMappingURL=AnimationFrameScheduler.js.map

/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AnimationFrameAction = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _FutureAction2 = __webpack_require__(51);
	
	var _AnimationFrame = __webpack_require__(381);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	var AnimationFrameAction = exports.AnimationFrameAction = function (_FutureAction) {
	    _inherits(AnimationFrameAction, _FutureAction);
	
	    function AnimationFrameAction() {
	        _classCallCheck(this, AnimationFrameAction);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(AnimationFrameAction).apply(this, arguments));
	    }
	
	    _createClass(AnimationFrameAction, [{
	        key: '_schedule',
	        value: function _schedule(state) {
	            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            if (delay > 0) {
	                return _get(Object.getPrototypeOf(AnimationFrameAction.prototype), '_schedule', this).call(this, state, delay);
	            }
	            this.delay = delay;
	            this.state = state;
	            var scheduler = this.scheduler;
	
	            scheduler.actions.push(this);
	            if (!scheduler.scheduledId) {
	                scheduler.scheduledId = _AnimationFrame.AnimationFrame.requestAnimationFrame(function () {
	                    scheduler.scheduledId = null;
	                    scheduler.flush();
	                });
	            }
	            return this;
	        }
	    }, {
	        key: '_unsubscribe',
	        value: function _unsubscribe() {
	            var scheduler = this.scheduler;
	            var scheduledId = scheduler.scheduledId;
	            var actions = scheduler.actions;
	
	            _get(Object.getPrototypeOf(AnimationFrameAction.prototype), '_unsubscribe', this).call(this);
	            if (actions.length === 0) {
	                scheduler.active = false;
	                if (scheduledId != null) {
	                    scheduler.scheduledId = null;
	                    _AnimationFrame.AnimationFrame.cancelAnimationFrame(scheduledId);
	                }
	            }
	        }
	    }]);

	    return AnimationFrameAction;
	}(_FutureAction2.FutureAction);
	//# sourceMappingURL=AnimationFrameAction.js.map

/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AnimationFrame = exports.RequestAnimationFrameDefinition = undefined;
	
	var _root = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RequestAnimationFrameDefinition = exports.RequestAnimationFrameDefinition = function RequestAnimationFrameDefinition(root) {
	    _classCallCheck(this, RequestAnimationFrameDefinition);
	
	    if (root.requestAnimationFrame) {
	        this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
	        this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
	    } else if (root.mozRequestAnimationFrame) {
	        this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
	        this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
	    } else if (root.webkitRequestAnimationFrame) {
	        this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
	        this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
	    } else if (root.msRequestAnimationFrame) {
	        this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
	        this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
	    } else if (root.oRequestAnimationFrame) {
	        this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
	        this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
	    } else {
	        this.cancelAnimationFrame = root.clearTimeout.bind(root);
	        this.requestAnimationFrame = function (cb) {
	            return root.setTimeout(cb, 1000 / 60);
	        };
	    }
	};
	
	var AnimationFrame = exports.AnimationFrame = new RequestAnimationFrameDefinition(_root.root);
	//# sourceMappingURL=AnimationFrame.js.map

/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.svgClippedArc = svgClippedArc;
	
	var _trig = __webpack_require__(383);
	
	function svgArc(x, y, radius, startAngle, endAngle) {
	  var start = (0, _trig.polarToCartesian)(x, y, radius, endAngle);
	  var end = (0, _trig.polarToCartesian)(x, y, radius, startAngle);
	
	  var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
	
	  return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y, 'L', x, y, 'L', start.x, start.y].join(' ');
	}
	
	function svgClippedArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
	
	  var startOuter = (0, _trig.polarToCartesian)(x, y, outerRadius, endAngle);
	  var endOuter = (0, _trig.polarToCartesian)(x, y, outerRadius, startAngle);
	  var startInner = (0, _trig.polarToCartesian)(x, y, innerRadius, endAngle);
	  var endInner = (0, _trig.polarToCartesian)(x, y, innerRadius, startAngle);
	
	  var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
	
	  return ['M', startOuter.x, startOuter.y, 'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y, 'L', endInner.x, endInner.y, 'A', innerRadius, innerRadius, 0, arcSweep, 1, startInner.x, startInner.y, 'Z'].join(' ');
	}

/***/ },
/* 383 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.polarToCartesian = polarToCartesian;
	var radiansPerPeriod = exports.radiansPerPeriod = 2 * Math.PI;
	
	// Put `r` between -π and π
	var normalizeRadians = exports.normalizeRadians = function normalizeRadians(r) {
	  if (Math.abs(r) < Math.pi) return r;
	  while (r < 0) {
	    r += radiansPerPeriod;
	  }while (r > Math.PI) {
	    r -= radiansPerPeriod;
	  }return r;
	};
	
	var ptToVector = exports.ptToVector = function ptToVector(pt) {
	  var angle = Math.atan2(pt.y, pt.x); // note: unintuitive order is JS spec
	  var dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
	  return [angle, dist];
	};
	
	var vectorToPt = exports.vectorToPt = function vectorToPt(angle, dist) {
	  return {
	    x: dist * Math.cos(angle),
	    y: dist * Math.sin(angle)
	  };
	};
	
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
	  return {
	    x: centerX + radius * Math.cos(angleInRadians),
	    y: centerY + radius * Math.sin(angleInRadians)
	  };
	}

/***/ },
/* 384 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.msPerPeriod$ = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _BehaviorSubject = __webpack_require__(21);
	
	__webpack_require__(31);
	
	var _util = __webpack_require__(355);
	
	var _mapBehaviorSubject = __webpack_require__(385);
	
	var _dial = __webpack_require__(358);
	
	// MODEL
	var msPerPeriod$ = exports.msPerPeriod$ = new _BehaviorSubject.BehaviorSubject(2000);
	
	var _linearScaleFns = (0, _util.linearScaleFns)(20000, 50);
	
	var _linearScaleFns2 = _slicedToArray(_linearScaleFns, 2);
	
	var unwrapFn = _linearScaleFns2[0];
	var wrapFn = _linearScaleFns2[1];
	
	var normalizedTempo$ = (0, _mapBehaviorSubject.mapBehaviorSubject)(msPerPeriod$, wrapFn, unwrapFn);
	
	// VIEW
	var preview$ = (0, _dial.newDial)(document.getElementById('tempo-dial'), normalizedTempo$);
	
	var text = function text() {
	  return document.getElementById('tempo-dial').querySelector('text');
	};
	
	// ms/rev => human readable
	function humanizeTempo(x) {
	  var speed = x < 5000 ? Math.round(60000 / x) : x < 10000 ? Math.round(x / 100) / 10 : Math.round(x / 1000);
	  return '' + speed + (x < 5000 ? 'rpm' : 's');
	}
	
	msPerPeriod$.merge(preview$.map(unwrapFn)).subscribe(function (x) {
	  text().textContent = humanizeTempo(x);
	});
	
	// Set a class on the text
	msPerPeriod$.mapTo('value').merge(preview$.mapTo('preview')).subscribe(function (className) {
	  text().classList[className == 'preview' ? 'add' : 'remove']('preview');
	});
	
	preview$.debounceTime(400).withLatestFrom(msPerPeriod$).subscribe(function (values) {
	  text().classList.remove('preview');
	  text().textContent = humanizeTempo(values[1]);
	});

/***/ },
/* 385 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.mapBehaviorSubject = mapBehaviorSubject;
	
	var _BehaviorSubject = __webpack_require__(21);
	
	__webpack_require__(386);
	
	function mapBehaviorSubject(subject$, wrapFn, unwrapFn) {
	  // Distinct keeps cycles from triggering.
	  var wrapped$ = new _BehaviorSubject.BehaviorSubject(wrapFn(subject$.getValue()));
	  subject$.distinct().subscribe(function (x) {
	    wrapped$.next(wrapFn(x));
	  }, function (err) {
	    wrapped$.error(err);
	  }, function () {
	    wrapped$.complete();
	  });
	
	  wrapped$.distinct().subscribe(function (x) {
	    subject$.next(unwrapFn(x));
	  }, function (err) {
	    subject$.error(err);
	  }, function () {
	    subject$.complete();
	  });
	  return wrapped$;
	}
	
	function scaleBehaviorSubject(subject$, minOrMax, max) {
	  var _linearScaleFns = linearScaleFns(minOrMax, max);
	
	  var _linearScaleFns2 = _slicedToArray(_linearScaleFns, 2);
	
	  var unwrapFn = _linearScaleFns2[0];
	  var wrapFn = _linearScaleFns2[1];
	
	  return mapBehaviorSubject(subject$, wrapFn, unwrapFn);
	}

/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _distinct = __webpack_require__(387);
	
	_Observable.Observable.prototype.distinct = _distinct.distinct;
	//# sourceMappingURL=distinct.js.map

/***/ },
/* 387 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DistinctSubscriber = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.distinct = distinct;
	
	var _OuterSubscriber2 = __webpack_require__(40);
	
	var _subscribeToResult = __webpack_require__(41);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
	 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
	 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
	 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
	 * @method distinct
	 * @owner Observable
	 */
	function distinct(compare, flushes) {
	    return this.lift(new DistinctOperator(compare, flushes));
	}
	
	var DistinctOperator = function () {
	    function DistinctOperator(compare, flushes) {
	        _classCallCheck(this, DistinctOperator);
	
	        this.compare = compare;
	        this.flushes = flushes;
	    }
	
	    _createClass(DistinctOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new DistinctSubscriber(subscriber, this.compare, this.flushes));
	        }
	    }]);
	
	    return DistinctOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var DistinctSubscriber = exports.DistinctSubscriber = function (_OuterSubscriber) {
	    _inherits(DistinctSubscriber, _OuterSubscriber);
	
	    function DistinctSubscriber(destination, compare, flushes) {
	        _classCallCheck(this, DistinctSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DistinctSubscriber).call(this, destination));
	
	        _this.values = [];
	        if (typeof compare === 'function') {
	            _this.compare = compare;
	        }
	        if (flushes) {
	            _this.add((0, _subscribeToResult.subscribeToResult)(_this, flushes));
	        }
	        return _this;
	    }
	
	    _createClass(DistinctSubscriber, [{
	        key: 'notifyNext',
	        value: function notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	            this.values.length = 0;
	        }
	    }, {
	        key: 'notifyError',
	        value: function notifyError(error, innerSub) {
	            this._error(error);
	        }
	    }, {
	        key: '_next',
	        value: function _next(value) {
	            var found = false;
	            var values = this.values;
	            var len = values.length;
	            try {
	                for (var i = 0; i < len; i++) {
	                    if (this.compare(values[i], value)) {
	                        found = true;
	                        return;
	                    }
	                }
	            } catch (err) {
	                this.destination.error(err);
	                return;
	            }
	            this.values.push(value);
	            this.destination.next(value);
	        }
	    }, {
	        key: 'compare',
	        value: function compare(x, y) {
	            return x === y;
	        }
	    }]);

	    return DistinctSubscriber;
	}(_OuterSubscriber2.OuterSubscriber);
	//# sourceMappingURL=distinct.js.map

/***/ },
/* 388 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.editorCmdBus$ = exports.editorPegs$ = undefined;
	
	var _BehaviorSubject = __webpack_require__(21);
	
	var _cmdBus = __webpack_require__(35);
	
	var _tonality = __webpack_require__(356);
	
	var _tempo = __webpack_require__(384);
	
	var _name = __webpack_require__(389);
	
	var _noise = __webpack_require__(357);
	
	var editorPegs$ = exports.editorPegs$ = new _BehaviorSubject.BehaviorSubject([]);
	var editorCmdBus$ = exports.editorCmdBus$ = (0, _cmdBus.newCmdBus$)(editorPegs$);
	
	var newPeg = function newPeg(normalized) {
	  return {
	    id: 'peg-' + new Date().getTime() + Math.random(),
	    normalized: normalized,
	    sound: (0, _noise.newSoundData)(normalized)
	  };
	};
	
	// MODEL COMMANDS
	editorCmdBus$.on('add peg', function (state, cmd) {
	  state.push(newPeg(cmd.peg));
	  return state;
	});
	
	editorCmdBus$.on('clear', function () {
	  return [];
	});
	
	editorCmdBus$.on('add pattern', function (state, cmd) {
	  global.console.log('add pattern: ', cmd);
	  var pattern = cmd.pattern;
	  if (!/^template.*/.exec(pattern.key)) {
	    _name.name$.next(pattern.name || 'My Dotz');
	  } else {
	    _name.name$.next('My Dotz');
	  }
	  _tonality.currentTonality$.next(pattern.tonality);
	  _tempo.msPerPeriod$.next(pattern.periodMs);
	  document.getElementById('wheel').classList = 'wheel ' + pattern.tonality;
	  return pattern.pegs.map(function (pegModel) {
	    // if there is no sub-structure, then values assumed to be the normalized ones
	    return newPeg(pegModel.normalized || pegModel);
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 389 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.name$ = undefined;
	
	var _Observable = __webpack_require__(4);
	
	var _BehaviorSubject = __webpack_require__(21);
	
	__webpack_require__(26);
	
	__webpack_require__(29);
	
	// MODEL
	var name$ = exports.name$ = new _BehaviorSubject.BehaviorSubject('My Dotz');
	
	// VIEW
	name$.subscribe(function (name) {
	  var el = document.querySelector('#pattern-name .name');
	  el.innerHTML = name;
	});
	
	// INTENT
	
	// Change name
	_Observable.Observable.fromEvent(document.getElementById('pattern-name'), 'click').do(function (e) {
	  return e.preventDefault();
	}).subscribe(function () {
	  var newName = prompt("New name", name$.getValue());
	  if (newName != null) {
	    name$.next(newName);
	  }
	});

/***/ },
/* 390 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.patternStoreBus$ = exports.patternStore$ = undefined;
	
	var _BehaviorSubject = __webpack_require__(21);
	
	var _cmdBus = __webpack_require__(35);
	
	var _util = __webpack_require__(355);
	
	var _generators = __webpack_require__(57);
	
	var _tonality = __webpack_require__(356);
	
	// hashmap of key => stored value
	var patternStore$ = exports.patternStore$ = new _BehaviorSubject.BehaviorSubject((0, _util.localStorageKeys)().filter(function (x) {
	  return (/^(pattern|template).*/.exec(x)
	  );
	}).reduce(function (acc, x) {
	  var item = localStorage.getItem(x);
	  try {
	    acc[x] = JSON.parse(item);
	  } catch (x) {
	    global.console.log('Unable to load or parse [' + x + ']: ' + item);
	  }
	  return acc;
	}, {}));
	
	var patternStoreBus$ = exports.patternStoreBus$ = (0, _cmdBus.newCmdBus$)(patternStore$);
	
	patternStoreBus$.on('insert', function (state, cmd) {
	  var pattern = cmd.pattern;
	  pattern.timestamp = new Date().getTime();
	  pattern.key = pattern.key || 'pattern-' + pattern.timestamp;
	  pattern.name = pattern.name || 'Pattern ' + pattern.timestamp;
	
	  localStorage.setItem(pattern.key, JSON.stringify(pattern));
	  state[pattern.key] = pattern;
	
	  return state;
	});
	
	patternStoreBus$.on('delete', function (state, cmd) {
	  var key = cmd.key;
	
	  localStorage.removeItem(key);
	  delete state[key];
	
	  return state;
	});
	
	patternStoreBus$.on('delete all', function (state, cmd) {
	
	  (0, _util.localStorageKeys)().forEach(function (key) {
	    if (!/pattern\-/.exec(key)) return;
	    localStorage.removeItem(key);
	  });
	
	  return {};
	});
	
	patternStoreBus$.on('create template', function (state, cmd) {
	  var tonality = cmd.tonality;
	  var key = 'template-' + tonality;
	  if (!localStorage[key]) {
	
	    var template = {
	      key: key,
	      name: tonality,
	      tonality: tonality,
	      periodMs: 2000,
	      pegs: [],
	      svg: '<svg viewBox="0 0 1200 1200"><g class="wheel ' + tonality + '">\n        <circle class="bg" cx="50%" cy="50%" r="49%"></circle></g></svg>'
	    };
	
	    patternStoreBus$.next({ name: 'insert', pattern: template });
	  }
	  return state;
	});
	
	patternStoreBus$.on('create missing templates', function (state, cmd) {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;
	
	  try {
	    for (var _iterator = (0, _generators.ownPropertiesIter)(_tonality.tonalities)()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var name = _step.value;
	
	      patternStoreBus$.next({ name: 'create template', tonality: name });
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	
	  return state;
	});
	
	setTimeout(function () {
	  return patternStoreBus$.next('create missing templates');
	}, 3000);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 391 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	__webpack_require__(36);
	
	__webpack_require__(29);
	
	__webpack_require__(33);
	
	__webpack_require__(38);
	
	var _patternStore = __webpack_require__(390);
	
	var _editor = __webpack_require__(388);
	
	var _util = __webpack_require__(355);
	
	// VIEWS
	var DELETE_PATTERN_CLASS_NAME = 'delete-pattern';
	
	var patternListElem = document.getElementsByTagName('ol')[0];
	
	var renderPatterns = function renderPatterns(patterns) {
	    patternListElem.innerHTML = '';
	
	    patterns.forEach(function (pattern) {
	        var link = document.createElement('A');
	        link.className = 'pattern';
	        link.style.height = '100px';
	        link.style.width = '100px';
	        link.style.display = 'block';
	        if (pattern.svg) link.innerHTML = pattern.svg;
	
	        var li = document.createElement('LI');
	        li.setAttribute('data-key', pattern.key);
	
	        var del = document.createElement('A');
	        del.innerHTML = document.getElementById('delete-icon').innerHTML;
	        del.className = DELETE_PATTERN_CLASS_NAME;
	
	        var name = document.createElement('span');
	        name.className = 'name';
	        name.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="200px" height="200px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" stroke-widt="0">\n    <defs>\n        <path id="criclePath" d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0 "/>\n    </defs>\n    <g>\n        <use xlink:href="#criclePath" fill="none"/>\n        <text fill="#fff" >\n            <textPath xlink:href="#criclePath">' + pattern.name + '</textPath>\n        </text>\n    </g>\n</svg>';
	        li.appendChild(name);
	        if (!pattern.key.match(/^template/)) {
	            li.appendChild(del);
	        }
	        li.appendChild(link);
	
	        patternListElem.appendChild(li);
	    });
	};
	
	_patternStore.patternStore$.map(function (hash) {
	    return Object.values(hash);
	}).map(function (x) {
	    return x.sort(function (a, b) {
	        return b.timestamp - a.timestamp;
	    });
	}).subscribe(renderPatterns);
	
	// INTENTIONS
	var patternsClicks$ = _Observable.Observable.fromEvent(patternListElem, 'click').do(function (e) {
	    return e.preventDefault();
	});
	
	// INTENTIONS: LOAD
	patternsClicks$.map(function (e) {
	    return e.target.closest('a');
	}).filter(function (link) {
	    return link && link.className != DELETE_PATTERN_CLASS_NAME;
	}).map(function (link) {
	    return link.closest('li');
	}).map(function (li) {
	    return li.getAttribute('data-key');
	}).withLatestFrom(_patternStore.patternStore$, function (key, patterns) {
	    return patterns[key];
	}).map(function (pattern) {
	    return { pattern: pattern, name: 'add pattern' };
	}).subscribe(function (x) {
	    _editor.editorCmdBus$.next(x);
	});
	
	// INTENTIONS: DELETE
	patternsClicks$.map(function (e) {
	    return e.target.closest('a');
	}).filter(function (link) {
	    return link && link.className == DELETE_PATTERN_CLASS_NAME;
	}).map(function (link) {
	    return link.closest('li');
	}).map(function (li) {
	    return li.getAttribute('data-key');
	}).map(function (key) {
	    return { name: 'delete', key: key };
	}).subscribe(_patternStore.patternStoreBus$);

/***/ },
/* 392 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Observable = __webpack_require__(4);
	
	var _Subject = __webpack_require__(22);
	
	__webpack_require__(393);
	
	__webpack_require__(26);
	
	__webpack_require__(397);
	
	__webpack_require__(38);
	
	__webpack_require__(36);
	
	__webpack_require__(33);
	
	__webpack_require__(399);
	
	var _editor = __webpack_require__(388);
	
	var _patternStore = __webpack_require__(390);
	
	var _tonality = __webpack_require__(356);
	
	var _playPause = __webpack_require__(3);
	
	var _noise = __webpack_require__(357);
	
	var _tempo = __webpack_require__(384);
	
	var _util = __webpack_require__(355);
	
	var _trig = __webpack_require__(383);
	
	var trig = _interopRequireWildcard(_trig);
	
	var _name = __webpack_require__(389);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// MODEL
	var NORMALIZED_RADIUS = 600; // main editor is 1200 virtual pizels
	var maxPegSize = function maxPegSize() {
	  return NORMALIZED_RADIUS / 5;
	};
	
	var MS_PER_TICK = 20;
	var radiansPerTick = function radiansPerTick() {
	  return MS_PER_TICK / _tempo.msPerPeriod$.getValue() * trig.radiansPerPeriod;
	};
	
	var normalizeValues = function normalizeValues(pt, size) {
	  var r = {};
	
	  var _trig$ptToVector = trig.ptToVector(pt);
	
	  var _trig$ptToVector2 = _slicedToArray(_trig$ptToVector, 2);
	
	  var rad = _trig$ptToVector2[0];
	  var dist = _trig$ptToVector2[1];
	
	  r.rad = rad;
	  r.mag = 1 - dist / NORMALIZED_RADIUS;
	  r.sz = size / maxPegSize();
	  return r;
	};
	
	var normalizeEvent = function normalizeEvent(e, size) {
	  return normalizeValues(eventToPt(e), size);
	};
	
	_playPause.playState$.subscribe((0, _util.labelLog)('playing state'));
	var ticker$ = _Observable.Observable.interval(MS_PER_TICK).delay(6000).filter(function () {
	  return _playPause.playState$.getValue() == 'playing';
	});
	var radians$ = ticker$.scan(function (last) {
	  return (0, _trig.normalizeRadians)(last + radiansPerTick());
	});
	
	// activePegs$ is a stream of the "active" or highlighted peg.
	var activePegs$ = new _Subject.Subject();
	
	radians$.withLatestFrom(_editor.editorPegs$, function (angle, pegs) {
	  // Generate stream of active pegs
	  pegs.forEach(function (pegModel) {
	    if (angle <= pegModel.normalized.rad && pegModel.normalized.rad < angle + radiansPerTick()) {
	      activePegs$.next(pegModel);
	    }
	  });
	}).subscribe(function (x) {
	  return null;
	});
	
	// VIEW
	var drawerDepth = 115;
	var editor = document.getElementById('editor');
	var wheel = document.getElementById('wheel');
	var pegsEl = wheel.getElementsByClassName('pegs')[0];
	var body = document.getElementsByTagName('body')[0];
	
	var saveButton = document.getElementById('save-button');
	
	var Color = {
	  note: 'violet',
	  playing: 'white',
	  growing: 'deeppink',
	  scratch: 'yellow'
	};
	
	// Draw the pegs
	_editor.editorPegs$.map(function (pegs) {
	  var newPegs = [];
	  pegs.forEach(function (pegModel) {
	    var screen = normalizedToScreen(pegModel.normalized);
	    newPegs.push([pegModel, screen]);
	  });
	  return newPegs;
	}).subscribe(function (pegs) {
	  return pegs.forEach(function (p) {
	    return renderPeg(p[0], p[1]);
	  });
	});
	
	//// Remove pegs if they are gone
	_editor.editorPegs$.subscribe(function (pegs) {
	  var ids = pegs.map(function (x) {
	    return x.id;
	  });
	  var pegEls = pegsEl.getElementsByClassName('peg');
	  // Note: go backwards, because there appears to be a bug with el.remove() when going forward.
	  for (var i = pegEls.length - 1; i >= 0; i--) {
	    var el = pegEls[i];
	    var id = el.getAttribute('id');
	    if (ids.indexOf(id) == -1) {
	      el.remove();
	    }
	  }
	});
	
	var normalizedToScreen = function normalizedToScreen(normalized) {
	  return {
	    pt: trig.vectorToPt(normalized.rad, (1 - normalized.mag) * NORMALIZED_RADIUS),
	    size: normalized.sz * maxPegSize()
	  };
	};
	
	var findOrCreatePeg = function findOrCreatePeg(pegModel) {
	  var peg = document.getElementById(pegModel.id);
	  if (!peg) {
	    peg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	    peg.setAttribute('id', pegModel.id);
	    peg.setAttribute('class', 'peg');
	    pegsEl.appendChild(peg);
	  }
	  return peg;
	};
	
	var renderPeg = function renderPeg(pegModel, screen) {
	  var e = findOrCreatePeg(pegModel);
	  e.setAttribute("cx", screen.pt.x + NORMALIZED_RADIUS);
	  e.setAttribute("cy", screen.pt.y + NORMALIZED_RADIUS);
	  e.setAttribute("r", screen.size);
	  e.setAttribute("fill", screen.highlightcolor || screen.color || Color.note);
	};
	
	// INTERACTIONS
	var saveEditorAction$ = _Observable.Observable.fromEvent(saveButton, 'click').do(function (e) {
	  return e.preventDefault();
	}).withLatestFrom(_editor.editorPegs$, function (_, pegs) {
	  return {
	    name: 'insert',
	    pattern: {
	      name: _name.name$.getValue(),
	      tonality: _tonality.currentTonality$.getValue(),
	      periodMs: _tempo.msPerPeriod$.getValue(),
	      pegs: pegs,
	      svg: '<svg viewBox="' + editor.getAttribute('viewBox') + '">' + wheel.outerHTML.replace(/(style|id)="[^"]+"/g, '') + '</svg>'
	    }
	  };
	}).subscribe(_patternStore.patternStoreBus$);
	
	var editorMousedown$ = _Observable.Observable.fromEvent(editor, 'mousedown');
	var editorMouseup$ = _Observable.Observable.fromEvent(editor, 'mouseup');
	
	var eventToPt = function eventToPt(e) {
	  var bounds = editor.getBoundingClientRect();
	  //const width = bounds.right - bounds.left
	  var x = ((e.x - bounds.left) / editor.clientWidth - 0.5) * 2.0 * NORMALIZED_RADIUS;
	  var y = ((e.y - bounds.top) / editor.clientHeight - 0.5) * 2.0 * NORMALIZED_RADIUS;
	  return { x: x, y: y };
	};
	
	var startedPegAt = null;
	
	// Size based on how long the mouse press/touch is
	var calcSizeWhileGrowing = function calcSizeWhileGrowing() {
	  var start = arguments.length <= 0 || arguments[0] === undefined ? startedPegAt : arguments[0];
	
	  return Math.min(maxPegSize(), (new Date().getTime() - start) / 40);
	};
	
	editorMousedown$.subscribe(function (e) {
	  startedPegAt = new Date().getTime();
	  var pt = eventToPt(e);
	
	  var _trig$ptToVector3 = trig.ptToVector(pt);
	
	  var _trig$ptToVector4 = _slicedToArray(_trig$ptToVector3, 2);
	
	  var angle = _trig$ptToVector4[0];
	  var dist = _trig$ptToVector4[1];
	
	
	  var interval = setInterval(function () {
	    if (startedPegAt) {
	      var peg = {
	        id: 'wip',
	        angle: angle,
	        dist: dist
	      };
	      var screen = {
	        size: calcSizeWhileGrowing(),
	        pt: pt,
	        color: Color.growing
	      };
	      renderPeg(peg, screen);
	    } else {
	      var _e = document.getElementById('wip');
	      if (_e) _e.parentNode.removeChild(_e);
	      clearInterval(interval);
	    }
	  }, 20);
	});
	
	editorMouseup$.map(function (e) {
	  var pt = eventToPt(e);
	  var size = calcSizeWhileGrowing();
	  return { pt: pt, size: size };
	}).map(function (screen) {
	  var normalized = normalizeValues(screen.pt, screen.size);
	  return { name: 'add peg', peg: normalized };
	}).subscribe(_editor.editorCmdBus$);
	
	editorMouseup$.subscribe(function (e) {
	  startedPegAt = null;
	});
	
	// Move the clock hand
	radians$.subscribe(function (angle) {
	  var hand = document.getElementById('hand');
	  var duration = MS_PER_TICK * .75; // smaller than interval so we don't drop behind
	  Velocity(hand, {
	    x1: NORMALIZED_RADIUS + Math.cos(angle) * NORMALIZED_RADIUS,
	    y1: NORMALIZED_RADIUS + Math.sin(angle) * NORMALIZED_RADIUS,
	    x2: NORMALIZED_RADIUS,
	    y2: NORMALIZED_RADIUS
	  }, { duration: duration, easing: "linear", queue: false });
	});
	
	activePegs$.subscribe(function (pegModel) {
	  var e = document.getElementById(pegModel.id);
	  if (e) {
	    e.setAttribute("fill", Color.playing);
	    var highlightDuration = Math.min(200, pegModel.sound.duration * 1000);
	    setTimeout(function () {
	      return e.setAttribute('fill', Color.note);
	    }, highlightDuration);
	  }
	});
	
	// MUSIC
	activePegs$.map(function (x) {
	  return x.sound;
	}).subscribe(_noise.soundOut$);
	
	// Scratchin'
	var scratch$ = _Observable.Observable.fromEvent(editor, 'mousemove').throttleTime(30).filter(function (e) {
	  return e.shiftKey;
	});
	
	scratch$.map(function (e) {
	  return (0, _noise.newSoundData)(normalizeEvent(e, maxPegSize() / 5));
	}).filter(function (s) {
	  return s.frequency;
	}).subscribe(_noise.soundOut$);
	
	scratch$.subscribe(function (e) {
	  var pt = eventToPt(e);
	  var screen = {
	    size: 3,
	    pt: pt,
	    color: Color.scratch
	  };
	
	  var _trig$ptToVector5 = trig.ptToVector(pt);
	
	  var _trig$ptToVector6 = _slicedToArray(_trig$ptToVector5, 2);
	
	  var angle = _trig$ptToVector6[0];
	  var dist = _trig$ptToVector6[1];
	
	  var peg = {
	    id: 'scratch',
	    angle: angle,
	    dist: dist
	  };
	  renderPeg(peg, screen);
	});
	
	scratch$.debounceTime(100).subscribe(function () {
	  var scratch = document.getElementById('scratch');
	  if (scratch) scratch.remove();
	});
	
	/// DELETE ALL
	_Observable.Observable.fromEvent(document.getElementById('delete-all-btn'), 'click').do(function (e) {
	  return e.preventDefault();
	}).filter(function () {
	  return window.confirm("really delete all your data? there’s no going back!");
	}).mapTo('delete all').subscribe(_patternStore.patternStoreBus$);
	
	// Needed otherwise JSON gets filled with really long precision numbers, where
	// that level of precision is not needed for regular old JSON
	function roundForJSON(x) {
	  var c = 1000000.0;
	  return Math.round(x * c) / c;
	}
	
	function compressedModel(pegs) {
	  var model = {
	    name: _name.name$.getValue(),
	    tonality: _tonality.currentTonality$.getValue(),
	    periodMs: _tempo.msPerPeriod$.getValue(),
	    pegs: pegs.map(function (peg) {
	      return {
	        rad: roundForJSON(peg.normalized.rad),
	        mag: roundForJSON(peg.normalized.mag),
	        sz: roundForJSON(peg.normalized.sz)
	      };
	    })
	  };
	  // max length 2000
	  var json = JSON.stringify(model);
	  var compressed = LZString.compressToEncodedURIComponent(json);
	  return compressed;
	}
	
	_Observable.Observable.fromEvent(document.getElementById('permalink-button'), 'click').do(function (e) {
	  return e.preventDefault();
	}).withLatestFrom(_editor.editorPegs$, function (_, pegs) {
	  return pegs;
	}).map(function (pegs) {
	  return compressedModel(pegs);
	}).do(function (x) {
	  if (x.length > 2000) {
	    window.alert('This dotz is too complicated to share in a URL. Sorriz. Lemme know, and I’ll make it work... - dr. dotz.');
	  }
	}).subscribe(function (serialized) {
	  var newHref = document.location.href.replace(/[#\?].*/, '') + '?v1=' + serialized;
	  window.history.replaceState({}, '', newHref);
	});
	
	// Load a pattern from the URL, if needed
	_Observable.Observable.of(document.location).map(function (x) {
	  return x.search;
	}).filter(function (x) {
	  return x.indexOf('v1=') !== -1;
	}).map(function (x) {
	  return x.replace(/\??v1=/, '');
	}).map(function (x) {
	  return LZString.decompressFromEncodedURIComponent(x);
	}).filter(function (x) {
	  return x;
	}).map(function (x) {
	  return JSON.parse(x);
	}).map(function (x) {
	  return {
	    name: 'add pattern',
	    pattern: x
	  };
	}).subscribe(function (x) {
	  _editor.editorCmdBus$.next(x);
	});
	
	var keyPress$ = _Observable.Observable.fromEvent(document, 'keypress');
	
	keyPress$.subscribe((0, _util.labelLog)('char'));

/***/ },
/* 393 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _interval = __webpack_require__(394);
	
	_Observable.Observable.interval = _interval.interval;
	//# sourceMappingURL=interval.js.map

/***/ },
/* 394 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.interval = undefined;
	
	var _IntervalObservable = __webpack_require__(395);
	
	var interval = exports.interval = _IntervalObservable.IntervalObservable.create;
	//# sourceMappingURL=interval.js.map

/***/ },
/* 395 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.IntervalObservable = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _isNumeric = __webpack_require__(396);
	
	var _Observable2 = __webpack_require__(4);
	
	var _async = __webpack_require__(54);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	
	var IntervalObservable = exports.IntervalObservable = function (_Observable) {
	    _inherits(IntervalObservable, _Observable);
	
	    function IntervalObservable() {
	        var period = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	        var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];
	
	        _classCallCheck(this, IntervalObservable);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IntervalObservable).call(this));
	
	        _this.period = period;
	        _this.scheduler = scheduler;
	        if (!(0, _isNumeric.isNumeric)(period) || period < 0) {
	            _this.period = 0;
	        }
	        if (!scheduler || typeof scheduler.schedule !== 'function') {
	            _this.scheduler = _async.async;
	        }
	        return _this;
	    }
	    /**
	     * Creates an Observable that emits sequential numbers every specified
	     * interval of time, on a specified Scheduler.
	     *
	     * <span class="informal">Emits incremental numbers periodically in time.
	     * </span>
	     *
	     * <img src="./img/interval.png" width="100%">
	     *
	     * `interval` returns an Observable that emits an infinite sequence of
	     * ascending integers, with a constant interval of time of your choosing
	     * between those emissions. The first emission is not sent immediately, but
	     * only after the first period has passed. By default, this operator uses the
	     * `async` Scheduler to provide a notion of time, but you may pass any
	     * Scheduler to it.
	     *
	     * @example <caption>Emits ascending numbers, one every second (1000ms)</caption>
	     * var numbers = Rx.Observable.interval(1000);
	     * numbers.subscribe(x => console.log(x));
	     *
	     * @see {@link timer}
	     * @see {@link delay}
	     *
	     * @param {number} [period=0] The interval size in milliseconds (by default)
	     * or the time unit determined by the scheduler's clock.
	     * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
	     * the emission of values, and providing a notion of "time".
	     * @return {Observable} An Observable that emits a sequential number each time
	     * interval.
	     * @static true
	     * @name interval
	     * @owner Observable
	     */
	
	
	    _createClass(IntervalObservable, [{
	        key: '_subscribe',
	        value: function _subscribe(subscriber) {
	            var index = 0;
	            var period = this.period;
	            var scheduler = this.scheduler;
	            subscriber.add(scheduler.schedule(IntervalObservable.dispatch, period, {
	                index: index, subscriber: subscriber, period: period
	            }));
	        }
	    }], [{
	        key: 'create',
	        value: function create() {
	            var period = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	            var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];
	
	            return new IntervalObservable(period, scheduler);
	        }
	    }, {
	        key: 'dispatch',
	        value: function dispatch(state) {
	            var index = state.index;
	            var subscriber = state.subscriber;
	            var period = state.period;
	
	            subscriber.next(index);
	            if (subscriber.isUnsubscribed) {
	                return;
	            }
	            state.index += 1;
	            this.schedule(state, period);
	        }
	    }]);

	    return IntervalObservable;
	}(_Observable2.Observable);
	//# sourceMappingURL=IntervalObservable.js.map

/***/ },
/* 396 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isNumeric = isNumeric;
	
	var _isArray = __webpack_require__(11);
	
	function isNumeric(val) {
	    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
	    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	    // subtraction forces infinities to NaN
	    // adding 1 corrects loss of precision from parseFloat (#15100)
	    return !(0, _isArray.isArray)(val) && val - parseFloat(val) + 1 >= 0;
	}
	;
	//# sourceMappingURL=isNumeric.js.map

/***/ },
/* 397 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _of = __webpack_require__(398);
	
	_Observable.Observable.of = _of.of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 398 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.of = undefined;
	
	var _ArrayObservable = __webpack_require__(365);
	
	var of = exports.of = _ArrayObservable.ArrayObservable.of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 399 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Observable = __webpack_require__(4);
	
	var _scan = __webpack_require__(400);
	
	_Observable.Observable.prototype.scan = _scan.scan;
	//# sourceMappingURL=scan.js.map

/***/ },
/* 400 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.scan = scan;
	
	var _Subscriber2 = __webpack_require__(8);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Applies an accumulator function over the source Observable, and returns each
	 * intermediate result, with an optional seed value.
	 *
	 * <span class="informal">It's like {@link reduce}, but emits the current
	 * accumulation whenever the source emits a value.</span>
	 *
	 * <img src="./img/scan.png" width="100%">
	 *
	 * Combines together all values emitted on the source, using an accumulator
	 * function that knows how to join a new source value into the accumulation from
	 * the past. Is similar to {@link reduce}, but emits the intermediate
	 * accumulations.
	 *
	 * Returns an Observable that applies a specified `accumulator` function to each
	 * item emitted by the source Observable. If a `seed` value is specified, then
	 * that value will be used as the initial value for the accumulator. If no seed
	 * value is specified, the first item of the source is used as the seed.
	 *
	 * @example <caption>Count the number of click events</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var ones = clicks.mapTo(1);
	 * var seed = 0;
	 * var count = ones.scan((acc, one) => acc + one, seed);
	 * count.subscribe(x => console.log(x));
	 *
	 * @see {@link expand}
	 * @see {@link mergeScan}
	 * @see {@link reduce}
	 *
	 * @param {function(acc: R, value: T, index: number): R} accumulator
	 * The accumulator function called on each source value.
	 * @param {T|R} [seed] The initial accumulation value.
	 * @return {Observable<R>} An observable of the accumulated values.
	 * @method scan
	 * @owner Observable
	 */
	function scan(accumulator, seed) {
	    return this.lift(new ScanOperator(accumulator, seed));
	}
	
	var ScanOperator = function () {
	    function ScanOperator(accumulator, seed) {
	        _classCallCheck(this, ScanOperator);
	
	        this.accumulator = accumulator;
	        this.seed = seed;
	    }
	
	    _createClass(ScanOperator, [{
	        key: 'call',
	        value: function call(subscriber, source) {
	            return source._subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed));
	        }
	    }]);
	
	    return ScanOperator;
	}();
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	
	
	var ScanSubscriber = function (_Subscriber) {
	    _inherits(ScanSubscriber, _Subscriber);
	
	    function ScanSubscriber(destination, accumulator, seed) {
	        _classCallCheck(this, ScanSubscriber);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScanSubscriber).call(this, destination));
	
	        _this.accumulator = accumulator;
	        _this.index = 0;
	        _this.accumulatorSet = false;
	        _this.seed = seed;
	        _this.accumulatorSet = typeof seed !== 'undefined';
	        return _this;
	    }
	
	    _createClass(ScanSubscriber, [{
	        key: '_next',
	        value: function _next(value) {
	            if (!this.accumulatorSet) {
	                this.seed = value;
	                this.destination.next(value);
	            } else {
	                return this._tryNext(value);
	            }
	        }
	    }, {
	        key: '_tryNext',
	        value: function _tryNext(value) {
	            var index = this.index++;
	            var result = void 0;
	            try {
	                result = this.accumulator(this.seed, value, index);
	            } catch (err) {
	                this.destination.error(err);
	            }
	            this.seed = result;
	            this.destination.next(result);
	        }
	    }, {
	        key: 'seed',
	        get: function get() {
	            return this._seed;
	        },
	        set: function set(value) {
	            this.accumulatorSet = true;
	            this._seed = value;
	        }
	    }]);

	    return ScanSubscriber;
	}(_Subscriber2.Subscriber);
	//# sourceMappingURL=scan.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map