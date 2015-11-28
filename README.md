
# Mooring


[![Build Status](https://travis-ci.org/appersonlabs/Mooring.svg?branch=master)](https://travis-ci.org/appersonlabs/Mooring.svg)
[![Coverage Status](https://coveralls.io/repos/appersonlabs/mooring/badge.svg?branch=master&service=github)](https://coveralls.io/github/appersonlabs/mooring?branch=master)
[![bitHound Overalll Score](https://www.bithound.io/github/appersonlabs/Mooring/badges/score.svg)](https://www.bithound.io/github/appersonlabs/Mooring)

Born from a desire to have an API / hooks system that:

- Has a small API surfice
- Is easy to understand
- Has a data flow that is immutable
- Lets pre hooks manipulate the data going into a hooked method
- Lets post hooks manipulate the data coming out from a hooked method
- Not have the hooks stored on the prototype but rather in a seperate object

Credit to the [kareem](https://github.com/vkarpov15/kareem) & [grappling-hook](https://github.com/keystonejs/grappling-hook)
projects for their insight and the inspiration they provided (also some code ;).)



# API Spec


## before hooks


Before hooks are called before a given function executes. They receve in their method sig all the params the hooked
method receves and can augment them.


#### It runs before hooks with a synchronous API

```javascript
    
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
    
```

#### It also runs before hooks with an asynchronous API


Asynchronous is the default


```javascript
    
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
    
```

#### It can run multipe before hooks

```javascript
    
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
    
```

## after hooks

#### It runs after hooks with a synchronous API

```javascript
    
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
    
```

#### It also runs after hooks with an asynchronous API


Asynchronous is the default


```javascript
    
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
    
```

#### It can run multipe after hooks

```javascript
    
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
    
```

## call hooks

#### It lets you call a hook without first defining it

```javascript
    
        // Here, false marks the hook as synchronous
        hooks.after('cook', false, function(feelings) {
            // feelings == 'I LOVE BURGERS'
            assert.equal('I LOVE BURGERS', feelings);
            done();
        });

        // first param is the hook name, next is an array of arguments, and lastly is your hooked method/code
        hooks.callHook('cook', ['burger'], function(food) {

            return 'I LOVE BURGERS';
        });
    
```

