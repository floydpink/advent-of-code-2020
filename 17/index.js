const fs = require('fs');
const {Node3D, Graph3D, Node4D, Graph4D} = require('../lib/graph-3d');

const input = 'input.txt';
const cubes = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(l => l.split(''));

const graph = new Graph3D(true);
for (let top = 0; top < cubes.length; top++) {
  for (let left = 0; left < cubes[0].length; left++) {
    const nde = new Node3D(left, top, 0, graph, cubes[top][left]);
    graph.add(nde);
  }
}

// graph.paint();

const isActiveCube = (n) => {
  return n.content === '#';
}

const playPart = (graph, isPart01 = false) => {
  // hack to populate all the neighbors for all initial nodes
  graph.nodes.forEach(n => n.validNeighbors.map(n => n));

  const maxCycles = 6;
  for (let i = 0; i < maxCycles; i++) {
    const nextStatesMap = new Map();
    const cubes = graph.nodes.slice();
    for (const cube of cubes) {
      const activeNeighbors = cube.allNeighbors.filter(n => isActiveCube(n)).length;
      let newState = cube.content;
      if (isActiveCube(cube)) {
        newState = (activeNeighbors === 2 || activeNeighbors === 3) ? '#' : '.';
      } else {
        newState = activeNeighbors === 3 ? '#' : '.';
      }
      nextStatesMap.set(cube.key, newState);
    }
    for (const ns of nextStatesMap.entries()) {
      graph.get(ns[0]).content = ns[1];
    }
    // console.log(`After ${i + 1} cycle(s):\n`);
    // graph.paint();
  }

  return graph.nodes.filter(n => isActiveCube(n)).length;
}

console.log(`part 1 answer: ${playPart(graph, true)}`);

const graph02 = new Graph4D(true);
for (let top = 0; top < cubes.length; top++) {
  for (let left = 0; left < cubes[0].length; left++) {
    const nde = new Node4D(left, top, 0, 0, graph02, cubes[top][left]);
    graph02.add(nde);
  }
}

// graph02.paint();

console.log(`part 2 answer: ${playPart(graph02)}`);
