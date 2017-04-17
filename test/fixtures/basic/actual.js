function testNoCurry(a, b) {
  console.log(`${a}: ${b}`);
}

const testCurried = function testCurried(a, b) {
  console.log(`${a}: ${b}`);
}

const testCurriedReverse = function testCurriedReverse(b, a) {
  console.log(`${a}: ${b}`);
}

let lambdaCurried = (a, b) => console.log(`${a}: ${b}`);

var someValue = 'test';

let Maybe = Just(value)
          | Nothing
          | Bla;

let wearing = Just('underpants');

//matching
wearing
  | Just('bla') > console.log(`How do you wear a bla`)
  | Just(value) > console.log(`I'm wearing just my ${value}`)
  | Nothing     > console.log(`I'm wearing nothing`)
  | _           > console.log('This should be the Bla case');

let result = someValue
  >> testCurried('log 1:')
  >> testCurried('log 2:')
  >> testCurried('log 3:');
//>> testCurriedReverse( _ , 'log 3:');
