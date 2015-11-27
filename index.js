'use strict';
var _ = require('lodash');
var async = require('async');

/*
based on code from Isaac Schlueter's blog post:
http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
*/
function dezalgofy(fn, done) {
    var isSync = true;
    fn(safeDone); //eslint-disable-line no-use-before-define
    isSync = false;
    function safeDone() {
        var args = _.toArray(arguments);
        if (isSync) {
            process.nextTick(function() {
                done.apply(null, args);
            });
        } else {
            done.apply(null, args);
        }
    }
}

function iterateMiddleware(middleware, args, done) {
    done = done || /* istanbul ignore next: untestable */ function(err) {
        if (err) {
            throw err;
        }
    };

    async.eachSeries(middleware, function(middleware, next) {
        var callback = middleware.fn;

        if (middleware.isAsync) {
            middleware.fn.apply({}, args.concat(function() {
                args = _.merge(args, _.toArray(arguments));
                next();
            }));
        } else {
            //synced
            var err;
            try {
                middleware.fn.apply({}, args);
            } catch (e) {
                /* istanbul ignore next: untestable */ err = e;
            }

            //synced
            next(err);
        }

    }, function() {
        done.apply({}, args);
    });
}

function Kareem() {
    this._pres = {};
    this._posts = {};
}

Kareem.prototype.callHook = function(name, args, fn) {
    var _this = this;
    var methodCallback = _.isFunction(_.last(args)) ? args.pop() : undefined;
    args = _.clone(args, true);

    dezalgofy(function(safeDone) {
        async.waterfall([
            // call befores
            function (next) {
                iterateMiddleware(_this._pres[name] || [], args, function() {
                    var args = _.toArray(arguments);
                    next.apply({}, [null].concat(args));
                });
            },
            // call method
            function () {
                var args = _.toArray(arguments);
                var next = args.pop(); // the waterfall next method

                if(methodCallback) {
                    fn.apply({}, args.concat(function() {
                        var results = _.toArray(arguments);

                        next.apply({}, [null].concat(results));
                    }));
                } else {
                    var results = fn.apply({}, args);
                    next.apply({}, [null].concat(results));
                }
            },
            // call afters
            function () {
                var results = _.toArray(arguments);
                var next = results.pop();

                iterateMiddleware(_this._posts[name] || [], results, function() {
                    var afterResults = _.toArray(arguments);

                    next.apply({}, [null].concat(afterResults));
                });
            },
        ], function() {
            // call done
            var results = _.toArray(arguments);
            var err = results.shift();

            safeDone.apply({}, results);
        })
    }, methodCallback || function() {});

};

Kareem.prototype.createHook = function(name, fn) {
    var _this = this;
    return function() {
        var args = Array.prototype.slice.call(arguments);
        _this.callHook(name, args, fn);
    };
};

Kareem.prototype.addHooks = function() {
    // TODO implament addHooks
};

Kareem.prototype.before = function(name, isAsync, fn) {
    if (typeof arguments[1] !== 'boolean') {
        fn = isAsync;
        isAsync = true;
    }

    this._pres[name] = this._pres[name] || [];
    var pres = this._pres[name];

    pres.push({ fn: fn, isAsync: isAsync });

    return this;
};

Kareem.prototype.after = function(name, isAsync, fn) {
    if (typeof arguments[1] !== 'boolean') {
        fn = isAsync;
        isAsync = true;
    }

    this._posts[name] = this._posts[name] || [];
    var posts = this._posts[name];

    posts.push({ fn: fn, isAsync: isAsync });
    return this;
};

module.exports = Kareem;
