const {Node, Graph} = require('./graph');

class Node3D extends Node {
  constructor(left, top, depth, graph, content = '.',
              includeDiagonalNeighbors = true,
              openNeighborsPredicate = (node) => true,
              openAndAccessibleNeighborsPredicate = (node) => true,
              debug = (msg) => null) {
    super(left, top, graph, content, includeDiagonalNeighbors, openNeighborsPredicate,
      openAndAccessibleNeighborsPredicate, debug);

    this.depth = depth;
  }

  get key() {
    return Node3D.makeKey(this.left, this.top, this.depth);
  }

  static makeKey(left, top, depth) {
    return `${left}|${top}|${depth}`;
  }

  get allNeighbors() {
    const neighbors = [];
    for (let d = this.depth - 1; d <= this.depth + 1; d++) {
      for (let t = this.top - 1; t <= this.top + 1; t++) {
        for (let l = this.left - 1; l <= this.left + 1; l++) {
          const key = Node3D.makeKey(l, t, d);
          if (key !== this.key) {
            neighbors.push(this.graph.get(key));
          }
        }
      }
    }
    return neighbors;
  }
}

class Graph3D extends Graph {
  constructor(infinite = false) {
    super(infinite);
    this.minDepth = Number.POSITIVE_INFINITY;
    this.maxDepth = Number.NEGATIVE_INFINITY;
  }

  add(node) {
    const key = node.key;
    if (this.positionsMap.has(key)) {
      throw new Error(`Graph already has an entry for ${key}`);
    }

    const [left, top, depth] = key.split('|').map(Number);
    this.minLeft = Math.min(this.minLeft, left);
    this.minTop = Math.min(this.minTop, top);
    this.minDepth = Math.min(this.minDepth, depth);
    this.maxLeft = Math.max(this.maxLeft, left);
    this.maxTop = Math.max(this.maxTop, top);
    this.maxDepth = Math.max(this.maxDepth, depth);

    this.positionsMap.set(key, node);
  }

  get(key) {
    if (!this.positionsMap.has(key) && this.isInfinite) {
      const [left, top, depth] = key.split('|').map(Number);
      const cube = new Node3D(left, top, depth, this);
      this.add(cube);
    }
    return this.positionsMap.get(key);
  }

  paint(fn = row => console.log(row), transformContent = (key, content) => content) {
    for (let depth = this.minDepth; depth <= this.maxDepth; depth++) {
      fn(`z: ${depth}`);
      for (let top = this.minTop; top <= this.maxTop; top++) {
        let row = '';
        for (let left = this.minLeft; left <= this.maxLeft; left++) {
          let key = Node3D.makeKey(left, top, depth);
          const pos = this.get(key);
          if (pos) {
            const content = pos.content;
            row += transformContent(key, content);
          } else {
            row += ' ';
          }
        }
        fn(row);
      }
      fn('');
    }
  }
}

class Node4D extends Node3D {
  constructor(left, top, depth, fourthD, graph, content = '.') {
    super(left, top, depth, graph, content);
    this.fourthD = fourthD;
  }

  get key() {
    return Node4D.makeKey(this.left, this.top, this.depth, this.fourthD);
  }

  static makeKey(left, top, depth, fourthD) {
    return `${left}|${top}|${depth}|${fourthD}`;
  }

  get allNeighbors() {
    const neighbors = [];
    for (let f = this.fourthD - 1; f <= this.fourthD + 1; f++) {
      for (let d = this.depth - 1; d <= this.depth + 1; d++) {
        for (let t = this.top - 1; t <= this.top + 1; t++) {
          for (let l = this.left - 1; l <= this.left + 1; l++) {
            const key = Node4D.makeKey(l, t, d, f);
            if (key !== this.key) {
              neighbors.push(this.graph.get(key));
            }
          }
        }
      }
    }
    return neighbors;
  }

}

class Graph4D extends Graph3D {
  constructor(infinite = false) {
    super(infinite);
    this.minFourthD = Number.POSITIVE_INFINITY;
    this.maxFourthD = Number.NEGATIVE_INFINITY;
  }

  add(node) {
    const key = node.key;
    if (this.positionsMap.has(key)) {
      throw new Error(`Graph already has an entry for ${key}`);
    }

    const [left, top, depth, fourthD] = key.split('|').map(Number);
    this.minLeft = Math.min(this.minLeft, left);
    this.minTop = Math.min(this.minTop, top);
    this.minDepth = Math.min(this.minDepth, depth);
    this.minFourthD = Math.min(this.minFourthD, fourthD);
    this.maxLeft = Math.max(this.maxLeft, left);
    this.maxTop = Math.max(this.maxTop, top);
    this.maxDepth = Math.max(this.maxDepth, depth);
    this.maxFourthD = Math.max(this.maxFourthD, fourthD);

    this.positionsMap.set(key, node);
  }

  get(key) {
    if (!this.positionsMap.has(key) && this.isInfinite) {
      const [left, top, depth, fourthD] = key.split('|').map(Number);
      const cube = new Node4D(left, top, depth, fourthD, this);
      this.add(cube);
    }
    return this.positionsMap.get(key);
  }

  paint(fn = row => console.log(row), transformContent = (key, content) => content) {
    for (let fourth = this.minFourthD; fourth <= this.maxFourthD; fourth++) {
      for (let depth = this.minDepth; depth <= this.maxDepth; depth++) {
        fn(`z: ${depth}, w=${fourth}`);
        for (let top = this.minTop; top <= this.maxTop; top++) {
          let row = '';
          for (let left = this.minLeft; left <= this.maxLeft; left++) {
            let key = Node4D.makeKey(left, top, depth, fourth);
            const pos = this.get(key);
            if (pos) {
              const content = pos.content;
              row += transformContent(key, content);
            } else {
              row += ' ';
            }
          }
          fn(row);
        }
        fn('');
      }
    }
  }
}

module.exports = {Node3D, Graph3D, Node4D, Graph4D};
