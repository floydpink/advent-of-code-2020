const fs = require('fs');

const instructions = fs.readFileSync('input.txt')
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(i => i.split(' '));

// console.log(instructions);

class Program {
  constructor(instructions) {
    this.idx = 0;
    this.accumulator = 0;
    this.instructions = instructions;
  }

  run() {
    const instruction = this.instructions[this.idx];
    const argument = Number(instruction[1]);
    switch (instruction[0]) {
      case 'nop':
        this.idx++;
        break;
      case 'acc':
        this.accumulator += argument;
        this.idx++;
        break;
      case 'jmp':
        this.idx += argument;
        break;
    }
    return this.idx;
  }
}

const createAndRunProgram = (instructions, isPart02 = false) => {
  const program = new Program(instructions);
  const indexes = new Set();
  indexes.add(0);
  while (true) {
    const idx = program.run();
    if (isPart02 && (idx >= program.instructions.length)) {
      console.log(`part 02 answer: ${program.accumulator}`);
      return true;
    }
    if (indexes.has(idx)) {
      if (!isPart02) {
        console.log(`part 01 answer: ${program.accumulator}`);
        break;
      } else {
        return null;
      }
    }
    indexes.add(idx);
  }
}

// part 01
createAndRunProgram(instructions);

// part 02
let lastChangedIndex = 0;
while (true) {
  const modifiedInstructions = instructions.slice();

  for (let i = lastChangedIndex; i < instructions.length; i++) {
    const instruction = instructions[i];
    if (instruction[0] === 'nop' ||instruction[0] === 'jmp') {
      modifiedInstructions[i] = [instruction[0] === 'nop' ? 'jmp' : 'nop', instruction[1]];
      lastChangedIndex = i + 1;
      break;
    }
  }
  const result = createAndRunProgram(modifiedInstructions, true);
  if (result === true) {
    break;
  }
}

console.log(lastChangedIndex);
