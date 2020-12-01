const fs = require('fs');

const numbers = fs.readFileSync('input.txt')
  .toString()
  .split('\n')
  .filter(s => !!s)
  .map(i => parseInt(i, 10));

let part01Answer = 0;
for (let i = 0; i < numbers.length; i++) {
  const number1 = numbers[i];
  for (let j = 0; j < numbers.length; j++) {
    if (i === j) continue;
    const number2 = numbers[j];
    if ((number1 + number2) === 2020) {
      part01Answer = number1 * number2;
      break;
    }
  }
  if (part01Answer !== 0) {
    break;
  }
}
console.log(`part 1 answer: ${part01Answer}`);

let part02Answer = 0;
for (let i = 0; i < numbers.length; i++) {
  const number1 = numbers[i];
  for (let j = 0; j < numbers.length; j++) {
    if (i === j) continue;
    const number2 = numbers[j];
    for (let k = 0; k < numbers.length; k++) {
      if (i === k || j === k) continue;
      const number3 = numbers[k];
      if ((number1 + number2 + number3) === 2020) {
        part02Answer = number1 * number2 * number3;
        break;
      }
      if (part02Answer !== 0) {
        break;
      }
    }
  }
  if (part02Answer !== 0) {
    break;
  }
}

console.log(`part 2 answer: ${part02Answer}`);
