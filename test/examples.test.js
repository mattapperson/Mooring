var assert = require('assert');
var Mooring = require('../');

/*
* Before hooks are called before a given function executes. They receve in their method sig all the params the hooked
* method receves and can augment them.
*/
describe('before hooks', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Mooring();
    });

    it('runs before hooks with a synchronous API', function(done) {
        // Here, false marks the hook as synchronous
        hooks.before('cook', false, function(food) {
            // food == 'burger'
            assert.equal('burger', food);

            // your code here
            // synchronous hooks can NOT augment params passed to hooked methods
        });

        var cook = hooks.createHook('cook', function(food) {
            // This is the method you want to hook
            done();
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger');
    });

    /*
    * Asynchronous is the default
    */
    it('also runs before hooks with an asynchronous API', function(done) {
        hooks.before('cook', function(food, next) {

            assert.equal('burger', food);
            // food = burger
            food = 'hotdog';
            // your code here

            next(food);
        });

        var cook = hooks.createHook('cook', function(food) {
            // food = hotdog
            assert.equal('hotdog', food);
            done();
            // This is the method you want to hook
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger');
    });

    it('can run multipe before hooks', function(done) {
        var count1 = 0;
        var count2 = 0;

        hooks.before('cook', function(next) {
            ++count1;
            next();
        });

        hooks.before('cook', function(next) {
            ++count2;

            next();
        });
        var cook = hooks.createHook('cook', function() {
            assert.equal(1, count1);
            assert.equal(1, count2);
            done();
        });
        cook();
    });


});

describe('after hooks', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Mooring();
    });

    it('runs after hooks with a synchronous API', function(done) {
        // Here, false marks the hook as synchronous
        hooks.after('cook', false, function(feelings) {
            // feelings == 'I LOVE BURGERS'
            assert.equal('I LOVE BURGERS', feelings);
            done();
        });

        var cook = hooks.createHook('cook', function(food) {

            return 'I LOVE BURGERS';
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger');
    });

    /*
    * Asynchronous is the default
    */
    it('also runs after hooks with an asynchronous API', function(done) {
        hooks.after('cook', function(feelings, feelings2, next) {
            // feelings == 'I LOVE BURGERS'
            // feelings2 == 'I hate fries'
            assert.equal('I LOVE BURGERS', feelings);
            assert.equal('I hate fries', feelings2);

            next('Burgers are OK');
        });

        var cook = hooks.createHook('cook', function(food, callback) {
            callback('I LOVE BURGERS', 'I hate fries');
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger', function(feelings, feelings2) {
            // feelings == 'Burgers are OK'
            // feelings2 == 'I hate fries'
            assert.equal('Burgers are OK', feelings);
            assert.equal('I hate fries', feelings2);
            done();
        });
    });

    it('can run multipe after hooks', function(done) {
        var count1 = 0;
        var count2 = 0;

        hooks.after('cook', function(next) {
            ++count1;
            next();
        });

        hooks.after('cook', function(next) {
            ++count2;

            next();
        });
        var cook = hooks.createHook('cook', function(cb) {
            cb();
        });
        cook(function() {
            assert.equal(1, count1);
            assert.equal(1, count2);
            done();

        });
    });
});

describe('call hooks', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Mooring();
    });

    it('lets you call a hook without first defining it', function(done) {
        // Here, false marks the hook as synchronous
        hooks.after('cook', false, function(feelings) {
            // feelings == 'I LOVE BURGERS'
            assert.equal('I LOVE BURGERS', feelings);
            done();
        });

        // first param is the hook name, next is an array of arguments, next is a flag for is the call immutable and lastly is your hooked method/code
        hooks.callHook('cook', ['burger'], true, function(food) {

            return 'I LOVE BURGERS';
        });
    });
});
