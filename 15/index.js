const fs = require('fs');

const input = 'input.txt';
let initialNumbers = fs.readFileSync(input)
  .toString()
  .split(',')
  .map(s => Number(s));

// console.log(initialNumbers);

const playPart = (isPart01) => {
  const map = new Map();
  let nextNumber = null;
  let lastNumber = null;
  const playNumber = (number, idx) => {
    nextNumber = map.has(number) ? idx - map.get(number) : 0;
    map.set(number, idx);
    lastNumber = number;
  };

  let idx = 0;
  while (idx < (isPart01 ? 2020 : 30000000)) {
    if (idx < initialNumbers.length) {
      playNumber(initialNumbers[idx], idx++);
    } else {
      playNumber(nextNumber, idx++);
    }
  }

  return lastNumber;
}

console.log(`part 01 answer: ${playPart(true)}`);
console.log(`part 02 answer: ${playPart(false)}`);  // brute force that takes 5.25 seconds on average!
