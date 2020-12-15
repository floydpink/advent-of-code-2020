const fs = require('fs');

const input = 'input.txt';
const inputs = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l);

// console.log(inputs);

// part 01
const mem = new Map();
let mask = '';
for (const line of inputs) {
  if (line.startsWith('mask = ')) {
    mask = line.replace('mask = ', '');
    // console.log(mask);
  } else if (line.startsWith('mem[')) {
    const [address, v] = line
      .replace('mem[', '')
      .replace(']', '')
      .split('=')
      .map(s => Number(s.trim()));
    const value = v.toString(2).padStart(36, '0');
    let newValue = [];
    for (let i = 0; i < mask.length; i++) {
      newValue.push(mask[i] === '1' || mask[i] === '0' ? mask[i] : value[i]);
    }
    const maskedValue = parseInt(newValue.join(''), 2);
    mem.set(address, maskedValue);
  }
}
// console.log(mem);
console.log(`part 01 answer: ${[...mem.values()].reduce((a, b) => a + b)}`);

// part 02
/*
   Unfortunately, not an original solution again for Part 02!
   But was inspired by this Python solution and used it as an excuse to learn & implement generators/iterators in ES6:
   https://www.reddit.com/r/adventofcode/comments/kcr1ct/2020_day_14_solutions/gfs93a2/
 */
const getNewAddresses = function* (fixedAddressValue, floatingIndices) {
  if (floatingIndices.length === 0) {
    yield fixedAddressValue;
  } else {
    const bit = floatingIndices[0];
    const rest = floatingIndices.slice(1);
    yield* getNewAddresses(fixedAddressValue, rest);                              // floating bit as '0'
    yield* getNewAddresses(fixedAddressValue + (2 ** bit), rest);  // floating bit as '1'
  }
};

const mem_02 = new Map();
mask = '';
for (const line of inputs) {
  if (line.startsWith('mask = ')) {
    mask = line.replace('mask = ', '');
    // console.log(mask);
  } else if (line.startsWith('mem[')) {
    const [address, v] = line
      .replace('mem[', '')
      .replace(']', '')
      .split('=')
      .map(s => Number(s.trim()));
    let fixedAddressValue = 0, floatingIndices = [];
    const reversedMask = mask.split('').reverse().join('');
    for (let i = 0; i < reversedMask.length; i++) {
      const bit = reversedMask[i];
      if (bit === 'X') {
        floatingIndices.push(i);
      } else if (bit === '1') {
        fixedAddressValue += 2 ** i;
      } else if (bit === '0') {
        fixedAddressValue += address & (2 ** i)
      }
    }
    for (const newAddress of getNewAddresses(fixedAddressValue, floatingIndices)) {
      mem_02.set(newAddress, Number(v));
    }
  }
}

console.log(`part 02 answer: ${[...mem_02.values()].reduce((a, b) => a + b)}`);
