
# cpt-hook


[![Build Status](https://travis-ci.org/vkarpov15/kareem.svg?branch=master)](https://travis-ci.org/vkarpov15/kareem)
[![Coverage Status](https://img.shields.io/coveralls/vkarpov15/kareem.svg)](https://coveralls.io/r/vkarpov15/kareem)



Born from a desire to have an API / hooks system that:

- Has a small API surfice
- Is easy to understand
- Has a data flow that is immutable
- Lets pre hooks manipulate the data going into a hooked method
- Lets post hooks manipulate the data coming out from a hooked method
- Not have the hooks stored on the prototype but rather in a seperate object

Credit to the [kareem](https://github.com/vkarpov15/kareem) & [grappling-hook](https://github.com/keystonejs/grappling-hook)
projects for their insight and the inspiration they provided (also some code ;).)



# API


## before hooks


Before hooks are called before a given function executes. They receve in their method sig all the params the hooked
method receves and can augment them.


#### It runs before hooks with a synchronous API

```javascript
    
        // Here, false marks the hook as synchronous
        hooks.before('cook', false, function(food) {
            // food == 'burger'

            // your code here
            // synchronous hooks can NOT augment params passed to hooked methods
        });

        var cook = hooks.createHook('cook', function(food) {
            // This is the method you want to hook
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger');
    
```

#### It also runs before hooks with an asynchronous API


Asynchronous is the default


```javascript
    
        hooks.before('cook', function(food, next) {
            // food = burger
            food = 'hotdog';
            // your code here

            next(food);
        });

        var cook = hooks.createHook('cook', function(food) {
            // food = hotdog
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
        });

        var cook = hooks.createHook('cook', function(food) {
            if(food === 'burger') {
                return 'I LOVE BURGERS'
            }
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

            next('Burgers are OK');
        });

        var cook = hooks.createHook('cook', function(food, callback) {
            if(food === 'burger') {
                callback('I LOVE BURGERS', 'I hate fries')
            }
        });

        // When you call the now-hooked method, the hooks will be called
        cook('burger', function(feelings, feelings2) {
            // feelings == 'Burgers are OK'
            // feelings2 == 'I hate fries'
        });
    
```

#### It can run multipe after hooks

feelings == 'Burgers are OK'

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
        var cook = hooks.createHook('cook', function() {
            done();
        });
        cook(function() {
            assert.equal(1, count1);
            assert.equal(1, count2);
        });
    
```

