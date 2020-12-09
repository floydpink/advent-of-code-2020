const fs = require('fs');

const input = 'input.txt';
const preamble = input === 'input.txt' ? 25 : 5;
const numbers = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(l => Number(l));

// console.log(numbers);
// console.log(numbers.length);
// console.log(new Set(numbers).size);

const isValidXMAS = (number, array) => {
  for (let i = 0; i < array.length; i++) {
    const second = number - array[i];
    if (array.includes(second) && array.slice().filter((c, j) => j !== i).indexOf(second) > -1) {
      return true;
    }
  }
  return false;
};

// part 01
let firstInvalidNumber = undefined;
for (let i = preamble; i < numbers.length; i++) {
  firstInvalidNumber = numbers[i];
  if (!isValidXMAS(numbers[i], numbers.slice(i - preamble, i))) {
    firstInvalidNumber = numbers[i];
    break;
  }
}
console.log(`part 01 answer: ${firstInvalidNumber}`);

// part 02
let runningSum = 0;
let slow = 0;
let fast = 1;

for (slow = 0; slow < numbers.length - 1; slow++) {
  fast = slow + 1;
  runningSum += numbers[slow];
  while (runningSum < firstInvalidNumber) {
    runningSum += numbers[fast++];
  }
  if (runningSum === firstInvalidNumber) {
    break;
  } else {
    runningSum = 0;
  }
}

const sequence = numbers.slice(slow, fast);
const low = Math.min.apply(null, sequence);
const high = Math.max.apply(null, sequence)
console.log(`part 02 answer: ${low + high}`);