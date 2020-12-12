const fs = require('fs');

const input = 'input.txt';
const instructions = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l);

// console.log(instructions);

// part 01
let current = [0, 0];
let direction = 'E';

const setNewDirection = (side, degrees) => {
  const turningLeft = side === 'L';
  switch (degrees) {
    case '90':
      switch (direction) {
        case 'N':
          direction = turningLeft ? 'W' : 'E';
          return;
        case 'S':
          direction = turningLeft ? 'E' : 'W';
          return;
        case 'E':
          direction = turningLeft ? 'N' : 'S';
          return;
        case 'W':
          direction = turningLeft ? 'S' : 'N';
          return;
        default:
          throw new Error(`Unexpected direction value: ${direction}`);
      }
    case '180':
      switch (direction) {
        case 'N':
          direction = 'S';
          return;
        case 'S':
          direction = 'N';
          return;
        case 'E':
          direction = 'W';
          return;
        case 'W':
          direction = 'E';
          return;
        default:
          throw new Error(`Unexpected direction value: ${direction}`);
      }
    case '270':
      switch (direction) {
        case 'N':
          direction = turningLeft ? 'E' : 'W';
          return;
        case 'S':
          direction = turningLeft ? 'W' : 'E';
          return;
        case 'E':
          direction = turningLeft ? 'S' : 'N';
          return;
        case 'W':
          direction = turningLeft ? 'N' : 'S';
          return;
        default:
          throw new Error(`Unexpected direction value: ${direction}`);
      }
    default:
      throw new Error(`Unexpected degrees value: ${degrees}`);
  }
};

const move = (point, towards, steps) => {
  const value = Number(steps) * (['S', 'W'].includes(towards) ? -1 : 1);
  if (['N', 'S'].includes(towards)) {
    point = [point[0], point[1] + value];
  } else if (['E', 'W'].includes(towards)) {
    point = [point[0] + value, point[1]];
  }
  return point;
};

for (const instruction of instructions) {
  const [action, ...valueStrings] = instruction.split('');
  let value = valueStrings.join('');
  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      current = move(current, action, value);
      break;
    case 'L':
    case 'R':
      setNewDirection(action, value);
      break;
    case 'F':
      current = move(current, direction, value);
      break;
  }
}

console.log(`part 01 answer: ${Math.abs(current[0]) + Math.abs(current[1])}`);

// part 02
let waypoint = [10, 1];
current = [0, 0];

const moveShip = (valueStr) => {
  const value = Number(valueStr);
  const delta = [waypoint[0] * value, waypoint[1] * value];
  current = [current[0] + delta[0], current[1] + delta[1]];
  return current;
};

const turnWaypoint = (waypoint, side, degrees) => {
  const turningRight = side === 'R';
  if (turningRight) {
    if (degrees === '90') {
      degrees = '270';
    } else if (degrees === '270') {
      degrees = '90';
    }
  }
  switch (degrees) {
    case '90':
      return [-1 * waypoint[1], waypoint[0]];
    case '180':
      return [-1 * waypoint[0], -1 * waypoint[1]];
    case '270':
      return [waypoint[1], -1 * waypoint[0]];
  }
};

for (const instruction of instructions) {
  const [action, ...valueStrings] = instruction.split('');
  let value = valueStrings.join('');
  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      waypoint = move(waypoint, action, value);
      break;
    case 'L':
    case 'R':
      waypoint = turnWaypoint(waypoint, action, value);
      break;
    case 'F':
      current = moveShip(value);
      break;
  }
}

console.log(`part 02 answer: ${Math.abs(current[0]) + Math.abs(current[1])}`);
