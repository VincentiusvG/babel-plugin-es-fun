'use strict';

function testNoCurry(a, b) {
  console.log(a + ': ' + b);
}

var testCurried = esfun.curry(function testCurried(a, b) {
  console.log(a + ': ' + b);
});

var testCurriedReverse = esfun.curry(function testCurriedReverse(b, a) {
  console.log(a + ': ' + b);
});

var lambdaCurried = esfun.curry(function (a, b) {
  return console.log(a + ': ' + b);
});

var someValue = 'test';

var Maybe = esfun.union('Just', value).union('Nothing').union('Bla').create();

var wearing = Just('underpants');

//matching
esfun(wearing).when(Just('bla'), function () {
  console.log('How do you wear a bla');
}).when(Just, function (value) {
  console.log('I\'m wearing just my ' + value);
}).when(Nothing, function () {
  console.log('I\'m wearing nothing');
}).when(esfun._, function () {
  console.log('This should be the Bla case');
}).match();

var result = someValue.pipe(testCurried('log 1:')).pipe(testCurried('log 2:')).pipe(testCurried('log 3:'));
//>> testCurriedReverse( _ , 'log 3:');