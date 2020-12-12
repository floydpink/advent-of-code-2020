const fs = require('fs');

const input = 'input.txt';
const numbers = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(n => Number(n));

const sorted = numbers.sort((a, b) => a - b);
// console.log(sorted);

// part 01
let map = new Map();
map.set(1, 0);
map.set(2, 0);
map.set(3, 1); // the final difference

let current = 0;
for (let next of sorted) {
  const diff = next - current;
  map.set(diff, map.get(diff) + 1);
  current = next;
}

// console.log(map);
console.log(`part 01 answer: ${map.get(1) * map.get(3)}`);

/*
// THIS WORKS FOR THE EXAMPLES - BUT NOT FOR THE ACTUAL INPUT!
// part 02
const max = Math.max.apply(null, numbers);
const size = numbers.length;
const connections = [];
const permute = (connection, index) => {
  const edge = connection[connection.length - 1];
  if (edge === max) {
    connections.push(connection.slice().join('-'));
  } else {
    if ((index < size) && [edge + 1, edge + 2, edge + 3].includes(sorted[index])) {
      connection.push(sorted[index]);
      permute(connection, index + 1);
    }
    if ((index + 1 < size) && [edge + 2, edge + 3].includes(sorted[index + 1])) {
      connection.push(sorted[index + 1]);
      permute(connection, index + 2);
    }
    if ((index + 2 < size) && sorted[index + 2] === edge + 3) {
      connection.push(sorted[index + 2]);
      permute(connection, index + 3);
    }
  }
  connection.pop();
};

permute([0], 0);

// console.log(connections);
console.log(`part 02 answer: ${connections.length}`);
*/

// This was done after watching the solution here:
//    https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/gf905da/
// I knew I need to apply DP - but was not able to do it!

const newSorted = [0].concat(sorted).concat(sorted[sorted.length - 1] + 3);
// console.log(newSorted);

const memo = new Map();
const countPathsToEnd = (position) => {
  if (position === newSorted.length - 1) {
    return 1;
  }
  if (memo.has(position)) {
    return memo.get(position);
  }
  let combinations = 0;
  for (let nextPosition = position + 1; nextPosition < position + 4; nextPosition++) {
    if (newSorted[nextPosition] - newSorted[position] <= 3) {
      combinations += countPathsToEnd(nextPosition);
    }
  }
  memo.set(position, combinations);
  return combinations;
}

console.log(`part 02 answer: ${countPathsToEnd(0)}`);
