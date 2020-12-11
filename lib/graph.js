let nodeId = 0;

class Node {
  constructor(left, top, graph, content,
              includeDiagonalNeighbors = false,
              openNeighborsPredicate = (node) => true,
              openAndAccessibleNeighborsPredicate = (node) => true,
              debug = (msg) => null) {
    this.id = nodeId++;
    this.left = left;
    this.top = top;
    this.graph = graph;
    this.content = content;

    this.openNeighborsPredicate = openNeighborsPredicate;
    this.openAndAccessibleNeighborsPredicate = openAndAccessibleNeighborsPredicate;
    this.debug = debug;
    this.includeDiagonalNeighbors = includeDiagonalNeighbors;
  }

  toString() {
    return `[ ${this.key} > ${this.content} ]`;
  }

  isReachableFrom(position) {
    const queue = [];
    const visited = new Set();
    queue.push(this);

    while (queue.length > 0) {
      let current = queue.shift();
      if (!visited.has(current)) {
        if (current === position) return true;
        visited.add(current);
        current.openAndAccessibleNeighbors.forEach(n => queue.push(n));
      }
    }
    return false;
  }

  static findPath(destination) {
    let path = [];
    let current = destination;
    while (current.previous !== null) {
      path.push(current);
      current = current.previous;
    }

    path = path.reverse();

    return {
      distance: destination.distance,
      path,
      toString: () => ` (${destination.distance}) ${path} `
    };
  }

  findMinimumDistancePathTo(position) {
    const queue = [];
    const visited = new Set();

    this.distance = 0;
    this.previous = null;
    queue.push(this);

    while (queue.length > 0) {
      let current = queue.shift();
      if (current === position) {
        return Node.findPath(current);
      }

      for (let neighbor of current.openAndAccessibleNeighbors) {
        if (visited.has(neighbor)) {
          continue;
        }

        neighbor.distance = current.distance + 1;
        neighbor.previous = current;
        let existingPathSegment = queue.find(v => v === neighbor);
        if (existingPathSegment) {
          if (existingPathSegment.distance > neighbor.distance) {
            this.debug('!!!handle this...');
          }
        } else {
          queue.push(neighbor);
        }
      }

      visited.add(current);
    }

    return [];
  }

  get key() {
    return Node.makeKey(this.left, this.top);
  }

  static makeKey(left, top) {
    return `${left}|${top}`;
  }

  get upNeighborKey() {
    return `${this.left}|${this.top - 1}`;
  }

  get upRightNeighborKey() {
    return `${this.left + 1}|${this.top - 1}`;
  }

  get rightNeighborKey() {
    return `${this.left + 1}|${this.top}`;
  }

  get downRightNeighborKey() {
    return `${this.left + 1}|${this.top + 1}`;
  }

  get downNeighborKey() {
    return `${this.left}|${this.top + 1}`;
  }

  get downLeftNeighborKey() {
    return `${this.left - 1}|${this.top + 1}`;
  }

  get leftNeighborKey() {
    return `${this.left - 1}|${this.top}`;
  }

  get upLeftNeighborKey() {
    return `${this.left - 1}|${this.top - 1}`;
  }

  get upNeighbor() {
    return this.graph.get(this.upNeighborKey);
  }

  get upRightNeighbor() {
    return this.graph.get(this.upRightNeighborKey);
  }

  get rightNeighbor() {
    return this.graph.get(this.rightNeighborKey);
  }

  get downRightNeighbor() {
    return this.graph.get(this.downRightNeighborKey);
  }

  get downNeighbor() {
    return this.graph.get(this.downNeighborKey);
  }

  get downLeftNeighbor() {
    return this.graph.get(this.downLeftNeighborKey);
  }

  get leftNeighbor() {
    return this.graph.get(this.leftNeighborKey);
  }

  get upLeftNeighbor() {
    return this.graph.get(this.upLeftNeighborKey);
  }

  get allNeighbors() {
    const standardNeighbors = [this.leftNeighbor, this.rightNeighbor, this.upNeighbor, this.downNeighbor];
    const diagonalNeighbors = [this.upRightNeighbor, this.downRightNeighbor, this.downLeftNeighbor, this.upLeftNeighbor];
    return this.includeDiagonalNeighbors ? standardNeighbors.concat(diagonalNeighbors) : standardNeighbors;
  }

  get validNeighbors() {
    return this.allNeighbors.filter(n => n != null);
  }

  get openNeighbors() {
    return this.validNeighbors.filter(this.openNeighborsPredicate);
  }

  get openAndAccessibleNeighbors() {
    return this.openNeighbors.filter(this.openAndAccessibleNeighborsPredicate);
  }
}

class Graph {
  constructor() {
    this.positionsMap = new Map();
    this.minLeft = Number.POSITIVE_INFINITY;
    this.maxLeft = Number.NEGATIVE_INFINITY;
    this.minTop = Number.POSITIVE_INFINITY;
    this.maxTop = Number.NEGATIVE_INFINITY;
  }

  add(node) {
    const key = node.key;
    if (this.positionsMap.has(key)) {
      throw new Error(`Graph already has an entry for ${key}`);
    }

    const [left, top] = key.split('|').map(Number);
    this.minLeft = Math.min(this.minLeft, left);
    this.minTop = Math.min(this.minTop, top);
    this.maxLeft = Math.max(this.maxLeft, left);
    this.maxTop = Math.max(this.maxTop, top);

    this.positionsMap.set(key, node);
  }

  get(key) {
    return this.positionsMap.get(key);
  }

  paint(fn = row => console.log(row), transformContent = (key, content) => content) {
    for (let top = this.minTop; top <= this.maxTop; top++) {
      let row = '';
      for (let left = this.minLeft; left <= this.maxLeft; left++) {
        let key = Node.makeKey(left, top);
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
  }

  get nodes() {
    return [...this.positionsMap.values()];
  }
}

module.exports = {Node, Graph};
