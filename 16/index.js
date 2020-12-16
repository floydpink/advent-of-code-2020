const assert = require('assert');
const fs = require('fs');

const input = 'input.txt';
const lines = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l);

const splitStringToNumbers = (line, delimiter = ',') => {
  return line.split(delimiter).map(c => Number(c));
}

const validFieldCandidates = new Set();
const fieldRules = new Map();
let myTicket = []
let nearby = false;
const validTickets = [];

// part 01
let ticketScanningErrorRate = 0;
for (let j = 0; j < lines.length; j++) {
  const line = lines[j];
  if (line.startsWith('your ticket:')) {
    myTicket = splitStringToNumbers(lines[++j]);
  } else if (line.startsWith('nearby tickets:')) {
    nearby = true;
  } else {
    // parse field rules
    const ranges = line.substr(line.indexOf(':') + 1).split('or').map(c => c.trim());
    const field = line.substr(0, line.indexOf(':'));
    fieldRules.set(field, new Set());
    for (const range of ranges) {
      const [low, hi] = splitStringToNumbers(range, '-');
      for (let i = low; i <= hi; i++) {
        validFieldCandidates.add(i);
        fieldRules.get(field).add(i);
      }
    }

    if (!nearby) continue;

    // parse nearby tickets
    let isValid = true;
    for (const n of splitStringToNumbers(line).filter(c => !validFieldCandidates.has(c))) {
      ticketScanningErrorRate += n;
      isValid = false;
    }
    if (isValid) {
      validTickets.push(line);
    }
  }
}

console.log(`part 01 answer: ${ticketScanningErrorRate}`);

// part 02
const getInitialPositionMap = () => {
  const fieldsMap = new Map();
  for (const field of [...fieldRules.keys()]) {
    fieldsMap.set(field, true);
  }
  return fieldsMap;
}

const positionsMap = new Map();
for (const ticket of validTickets) {
  const fieldValues = splitStringToNumbers(ticket);
  for (let pos = 0; pos < fieldValues.length; pos++) {
    for (const [name, validNumbers] of fieldRules.entries()) {
      if (!positionsMap.has(pos)) {
        positionsMap.set(pos, getInitialPositionMap());
      }
      const fieldsMap = positionsMap.get(pos);
      fieldsMap.set(name, fieldsMap.get(name) && validNumbers.has(fieldValues[pos]))
    }
  }
}

// console.log(positionsMap);

const positions = [];
for (const [number, fm] of positionsMap.entries()) {
  positions.push({number, validFields: [...fm.entries()].filter(c => c[1]).map(c => c[0])});
}

const sortedPositions = positions.sort((a, b) => a.validFields.length - b.validFields.length);
// console.log(sortedPositions);

const foundPositions = new Map();
for (const position of sortedPositions) {
  const fields = position.validFields.filter(c => !foundPositions.has(c));
  assert(fields.length === 1)
  foundPositions.set(fields[0], position.number);
}

// console.log(foundPositions);

const desiredFields = [...foundPositions.entries()].filter(c => c[0].startsWith('departure')).map(c => c[1]);
let product = 1;
for (const [i, v] of myTicket.entries()) {
  if (desiredFields.includes(i)) {
    product *= v;
  }
}

console.log(`part 02 answer: ${product}`);
