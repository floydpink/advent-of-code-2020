const fs = require('fs');
const {Node, Graph} = require('../lib/graph');

const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(l => l.split(''));

const graph = new Graph();
const height = input.length;
const width = input[0].length;
for (let row = 0; row < height; row++) {
  for (let column = 0; column < width; column++) {
    const node = new Node(column, row, graph, input[row][column]);
    graph.add(node);
  }
}

const getNextPosition = ([left, top], [slopeX, slopeY]) => {
  let newLeft = left + slopeX;
  const newTop = top + slopeY;
  if (newLeft >= width) {
    newLeft = newLeft - width;
  }
  return [newLeft, newTop];
}

const findTreeCount = ([slopeX, slopeY]) => {
  let [currentX, currentY] = [0, 0];
  const path = [];
  while (currentY < height) {
    [currentX, currentY] = getNextPosition([currentX, currentY], [slopeX, slopeY]);
    if (currentY >= height) {
      break;
    }
    const key = Node.makeKey(currentX, currentY);
    const node = graph.get(key);
    const current = node.content === '#' ? 'X' : 'O';
    path.push(current);
    // graph.paint(row => console.log(row), (k, content) => {
    //   return k === key ? current : content;
    // });
    // console.log('------------')
  }

  return path.filter(p => p === 'X').length;
}

const part01Answer = findTreeCount([3, 1]);
console.log(`part 01 answer: ${part01Answer}`);

const treeCounts = [];
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];
for (let slope of slopes) {
  treeCounts.push(findTreeCount(slope));
}

const part02Answer = treeCounts.reduce((a, b) => a * b);
console.log(`part 02 answer: ${part02Answer}`);
