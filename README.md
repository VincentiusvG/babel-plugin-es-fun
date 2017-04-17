# Babel plugin for es-fun.js
Babel plugin to allow functional programming syntax for declaring union types, matching union types and piping functions. 

Converting union type declaration:
-------------
```javascript
let Maybe = Just(value)
          | Nothing;
```

To this:
--------
```javascript
var Maybe = esfun
 .union('Just', value)
 .union('Nothing');
```

Converting match expressions:
-----------------------------
```javascript
let wearing = Just('underpants');

//matching
wearing
  | Just('bla') > console.log(`How do you wear a bla`)
  | Just(value) > console.log(`I'm wearing just my ${value}`)
  | Nothing     > console.log(`I'm wearing nothing`)
```

To this:
--------
```javascript
var wearing = Just('underpants');

//matching
esfun(wearing)
  .when(Just("bla"), () => console.log('What is a bla'))
  .when(Just, (value)  => console.log('I\'m wearing just my ' + value))
  .when(Nothing, () => console.log('I\'m wearing nothing'))
.match();
```

Converting function pipes:
--------------------------
```javascript
let curriedFn = function (a, b) {
  console.log(a, b);
};

let result = someValue
  >> curriedFn('log 1:')
  >> curriedFn('log 2:')
  >> curriedFn('log 3:');
```

To this:
--------
```javascript
curriedFn = esfun.curry(function (a, b) {
  console.log(a, b);
});

var result = someValue
  .pipe(curriedFn('log 1:'))
  .pipe(curriedFn('log 2:'))
  .pipe(curriedFn('log 3:'));
```



