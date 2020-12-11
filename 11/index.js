const fs = require('fs');
const {Node, Graph} = require('../lib/graph');

const input = 'input.txt';
const lines = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(l => l.split(''));

const initializeMap = () => {
  const map = new Graph();
  const height = lines.length;
  const width = lines[0].length;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const node = new Node(c, r, map, lines[r][c], true);
      map.add(node);
    }
  }
  return map;
}

const getNextRound = (map, emptyRule, occupiedRule) => {
  const next = new Map();
  for (const node of map.nodes) {
    if (node.content === 'L' && emptyRule(node)) {
      next.set(node.key, '#');
    } else if (node.content === '#' && occupiedRule(node)) {
      next.set(node.key, 'L');
    }
  }
  return next;
}

const playAllRounds = (map, emptyRule, occupiedRule) => {
  // console.log('initial state');
  // map.paint();

  let rounds = 0;
  let current = new Map();
  while (rounds === 0 || current.size > 0) {
    rounds++;
    current = getNextRound(map, emptyRule, occupiedRule);
    for (const [k, v] of current.entries()) {
      const node = map.get(k);
      node.content = v;
    }

    // console.log('--------');
    // console.log(`state after ${rounds} rounds(s)`);
    // map.paint();
  }
  return rounds - 1;
}

// part 01
const map01 = initializeMap();
const emptyRule01 = n => n.validNeighbors.filter(n => n.content === '#').length === 0;
const occupiedRule01 = n => n.validNeighbors.filter(n => n.content === '#').length >= 4;
const rounds01 = playAllRounds(map01, emptyRule01, occupiedRule01);
// console.log(rounds01);

console.log(`part 01 answer: ${map01.nodes.filter(n => n.content === '#').length}`);

// part 02
const map02 = initializeMap();
const allVisibleNeighbors = (node) => {
  const neighbors = [];
  let current = node.upNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.upNeighbor;
  }
  current = node.upRightNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.upRightNeighbor;
  }
  current = node.rightNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.rightNeighbor;
  }
  current = node.downRightNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.downRightNeighbor;
  }
  current = node.downNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.downNeighbor;
  }
  current = node.downLeftNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.downLeftNeighbor;
  }
  current = node.leftNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.leftNeighbor;
  }
  current = node.upLeftNeighbor;
  while (current != null) {
    if (current.content !== '.') {
      neighbors.push(current);
      break;
    }
    current = current.upLeftNeighbor;
  }
  return neighbors;
}
const emptyRule02 = n => allVisibleNeighbors(n).filter(n => n.content === '#').length === 0;
const occupiedRule02 = n => allVisibleNeighbors(n).filter(n => n.content === '#').length >= 5;
const rounds02 = playAllRounds(map02, emptyRule02, occupiedRule02);
// console.log(rounds02);

console.log(`part 02 answer: ${map02.nodes.filter(n => n.content === '#').length}`);
