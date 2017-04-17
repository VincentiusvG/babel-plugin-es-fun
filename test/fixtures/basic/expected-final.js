'use strict';

function testNoCurry(a, b) {
  console.log(a + ': ' + b);
}

var testCurried = esfun.curry(function testFn(a, b) {
  console.log(a + ': ' + b);
});

var lambdaCurried = esfun.curry(function (a, b) {
  return console.log(a + ': ' + b);
});

var someValue = 'test';

var Maybe = esfun
          .union('Just', value)
          .union('Nothing') 
          .create();

var wearing = Just('underpants');

//matching
esfun(wearing)
  .when(Just("bla"), () => console.log('What is a bla'))
  .when(Just, (value)  => console.log('I\'m wearing just my ' + value))
  .when(Nothing, () => console.log('I\'m wearing nothing'))
.match();

var result = someValue
  .pipe(testCurried('log 1:'))
  .pipe(testCurried('log 2:'))
  .pipe(testCurried('log 3:'));
  .pipe(testCurriedReverse(esfun._, 'log 3:'));

