var assert = require('assert');
var Kareem = require('../');
var expect = require('chai').expect;


describe('New API', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Kareem();
    });

    it('Entire API exists', function() {
        expect(hooks.before).to.exist;
        expect(hooks.after).to.exist;
        expect(hooks.addHooks).to.exist;
        expect(hooks.createHook).to.exist;
        expect(hooks.callHook).to.exist;
    });
});

describe('New API before hooks', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Kareem();
    });


    it('runs basic serial pre hooks', function(done) {
        var count = 0;

        hooks.before('cook', function(next) {
            ++count;
            next();
        });

        var cook = hooks.createHook('cook', function() {
            assert.equal(1, count);
            done();
        });
        cook();
    });

    it('can run multipe pre hooks', function(done) {
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


    it('can run fully synchronous pre hooks', function(done) {
        var count1 = 0;
        var count2 = 0;

        hooks.before('cook', false, function() {
            ++count1;
        });

        hooks.before('cook', false, function() {
            ++count2;
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
        hooks = new Kareem();
    });

    it('executes with parameters passed in', function(done) {

        hooks.after('cook', function(eggs, bacon, next) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            next();
        });

        var cook = hooks.createHook('cook', function(eggs, bacon, cb) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            cb(eggs, bacon);
        });

        cook(1, 2, function(eggs, bacon) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            done();
        });

    });

    it('can run fully synchronous post hooks', function(done) {

        hooks.after('cook', function(eggs, bacon, next) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            next();
        });

        var cook = hooks.createHook('cook', function(eggs, bacon, cb) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            cb(eggs, bacon);
        });

        cook(1, 2, function(eggs, bacon) {
            assert.equal(1, eggs);
            assert.equal(2, bacon);
            done();
        });

    });
});

describe('createHook()', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Kareem();
    });

    it('wraps a callable function in hooks', function(done) {
        hooks.before('cook', function(o, next) {
            o.bacon = 3;
            next(o);
        });

        hooks.before('cook', function(obj, next) {

            obj.eggs = 4;
            next(obj);
        });

        hooks.before('cook', function(obj, next) {
            obj.waffles = false;
            next(obj);
        });

        hooks.after('cook', function(obj, next) {
            assert.equal('yes', obj.tofu);

            obj.tofu = 'no';

            next(obj);
        });

        var obj = { bacon: 0, eggs: 0 };

        var cook = hooks.createHook('cook', function(o, callback) {
            assert.equal(3, o.bacon);
            assert.equal(4, o.eggs);
            assert.equal(false, o.waffles);
            assert.equal(undefined, o.tofu);
            o.tofu = 'yes'
            callback(o);
        });
        cook(obj, function(result) {

            assert.equal(3, result.bacon);
            assert.equal(4, result.eggs);
            assert.equal(false, result.waffles);
            assert.equal('no', result.tofu);

            assert.notEqual(obj, result);
            done();
        });
    });

});
