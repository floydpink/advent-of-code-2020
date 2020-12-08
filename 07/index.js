const fs = require('fs');

let inputPath = 'input.txt';

const bags = new Map();

class Bag {
  constructor(color) {
    this.color = color;
    this.depsSet = new Set();
    this.depsArray = [];
  }

  static get(color) {
    if (!bags.has(color)) {
      bags.set(color, new Bag(color));
    }

    return bags.get(color);
  }

  toString() {
    return `B:${this.color} ( ${[...this.depsSet].map(d => d.toString())} )`;
  }

  get hasShinyGold() {
    return [...this.depsSet].map(d => d.toString()).join('').includes('shiny gold');
  }

  get size() {
    return 1 + this.depsArray.map(b => b.size).reduce((a, b) => a + b, 0);
  }
}

const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .filter(l => !!l)

for (const s of input) {
  let str = s.replace('.', '').split('bags').join('').split('bag').join('');
  const [left, right] = str.split('contain').map(s => s.trim());
  const deps = right === 'no other' ? [] :
    right.split(',').map(s => s.trim()).map(s => {
      const [num, ...colors] = s.split(' ');
      return [num, colors.join(' ')]
    });
  const l = Bag.get(left);
  for (const d of deps) {
    let dep = Bag.get(d[1]);
    l.depsSet.add(dep);
    for (let i = 0; i < d[0]; i++) {
      l.depsArray.push(dep);
    }
  }
}

// console.log([...bags.entries()].map(b => `${b.toString()}`));

// part 01
const bagsContainingShinyGold = [...bags.values()].filter(b => b.hasShinyGold).length;
console.log(`part 01 answer: ${bagsContainingShinyGold}`);

// part 02
const childrenBagsCount = Bag.get('shiny gold').size - 1;
console.log(`part 02 answer: ${childrenBagsCount}`);
