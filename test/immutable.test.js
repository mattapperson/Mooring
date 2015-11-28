var assert = require('assert');
var Mooring = require('../');
var expect = require('chai').expect;

describe('Immutablity tests', function() {
    var hooks;

    beforeEach(function() {
        hooks = new Mooring();
    });

    it('should not allow non-passed changed to be passed to the hooked method', function(done) {
        hooks.before('cook', false, (food, next)=>{
            food.name='A';
            next(); // nothing passed through
        });

        var cook = hooks.createHook('cook', food => {
            expect(food.name).to.equal('burger');
            done();
        });

        cook({name: 'burger'});
    });

    it('should not allow non-passed changed to be passed from the hooked method', function(done) {
        hooks.after('cook', false, (food, next)=>{
            food.name='turkey';
            next(); // nothing passed through
        });

        var cook = hooks.createHook('cook', (food, cb) => {
            cb({name: 'chicken'})
        });

        cook({name: 'burger'}, function(food) {
            expect(food.name).to.equal('chicken');
            done();
        });
    });
    
});
