const fs = require('fs');
const {range} = require('../lib/utils');

const inputPath = 'input.txt';
const passes = fs.readFileSync(inputPath)
  .toString()
  .split('\n');

class Seat {
  constructor(pass) {
    this.pass = pass;
    this.row = undefined;
    this.column = undefined;
    this.compute();
  }

  compute() {
    let rows = range(128);
    for (let i = 0; i < 7; i++) {
      const pointer = this.pass[i];
      let half = Math.floor(rows.length / 2);
      rows = pointer === 'F' ? rows.slice(0, half) : rows.slice(half)
    }
    this.row = rows[0];

    let columns = range(8);
    for (let i = 7; i < 10; i++) {
      const pointer = this.pass[i];
      let half = Math.floor(columns.length / 2);
      columns = pointer === 'L' ? columns.slice(0, half) : columns.slice(half)
    }
    this.column = columns[0];
  }

  get seatId() {
    return this.row * 8 + this.column;
  }

  toString() {
    return `${this.row} | ${this.column} > ${this.seatId}`;
  }
}

const seats = passes.map(p => new Seat(p));
// console.log(seats.map(s => s.toString()));

const seatIds = seats.map(s => s.seatId);

// part 01
const maxSeatId = Math.max.apply(null, seatIds);
console.log(`part 01 answer: ${maxSeatId}`);

// part 02
const minSeatId = Math.min.apply(null, seatIds)
const sum = seatIds.reduce((a, b) => a + b);
const expectedSum = range(minSeatId, maxSeatId + 1).reduce((a, b) => a + b);
const missingNumber = expectedSum - sum;
console.log(`part 02 answer: ${missingNumber}`);