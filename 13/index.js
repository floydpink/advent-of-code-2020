const fs = require('fs');

const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .filter(l => !!l);

const earliestTimestamp = Number(input[0]);
const busIds = input[1].split(',').map(n => n === 'x' ? n : Number(n));

// console.log(earliestTimestamp, busIds);

// part 01
const diffs = new Map();
for (const busId of busIds) {
  if (busId !== 'x') {
    const highestFactor = Math.ceil(earliestTimestamp / busId);
    const diff = busId * highestFactor - earliestTimestamp;
    if (!diffs.has(diff)) {
      diffs.set(diff, []);
    }
    const current = diffs.get(diff);
    current.push(busId);
    diffs.set(diff, current);
  }
}

const minimumWaitTime = Math.min.apply(null, [...diffs.keys()]);
console.log(`part 01 answer: ${minimumWaitTime * diffs.get(minimumWaitTime)[0]}`);

/* Was clueless on how to do part 02 - and sought (and found) inspiration from solution mega-thread
   This elegant (non-CRT) solution is what I replicated: https://www.reddit.com/r/adventofcode/comments/kc4njx/2020_day_13_solutions/gfncyoc/?utm_source=reddit&utm_medium=web2x&context=3 */

let n = earliestTimestamp;
let step = 1;
const buses = busIds.map((b, i) => b === 'x' ? null : [i, b]).filter(b => !!b);
// console.log(buses);

for (const [i, b] of buses) {
  for (let c = n; ; c += step) {
    if ((c + i) % b === 0) {
      n = c;
      break;
    }
  }
  step *= b;
}

console.log(`part 02 answer: ${n}`);