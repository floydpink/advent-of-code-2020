const fs = require('fs');

class Password {
  constructor(str) {
    const parts = str.split(' ');
    if (parts.length !== 3) {
      throw new Error()
    }
    const [low, high] = parts[0].split('-').map(i => parseInt(i, 10))
    this.low = low;
    this.high = high;
    this.char = parts[1].substr(0, 1);
    this.password = parts[2];
  }

  toString() {
    return `${this.low}-${this.high} ${this.char}: ${this.password}`;
  }

  isValid01() {
    const charCount = this.password.split('').filter(c => c === this.char).length;
    return charCount >= this.low && charCount <= this.high;
  }

  isValid02() {
    const firstMet = this.password[this.low - 1] === this.char;
    const secondMet = this.password[this.high - 1] === this.char;
    return firstMet ^ secondMet;
  }
}

const passwords = fs.readFileSync('input.txt')
  .toString()
  .split('\n')
  .filter(s => !!s)
  .map(s => new Password(s));

const part01Answer = passwords.filter(p => p.isValid01()).length;
console.log(`part 01 answer: ${part01Answer}`);

const part02Answer = passwords.filter(p => p.isValid02()).length;
console.log(`part 02 answer: ${part02Answer}`);
