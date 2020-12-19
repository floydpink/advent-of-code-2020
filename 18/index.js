const assert = require('assert');
const fs = require('fs');

const input = 'input.txt';
const lines = fs.readFileSync(input)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(l => l.split('').filter(c => c !== ' ').map(c => ['(', ')', '+', '*'].includes(c) ? c : Number(c)));

// console.log(lines);
let isPart02 = false;
const parseExpression = (expression) => {
  assert(expression.length > 2);
  if (isPart02 && expression.includes('+')) {
    const signIndex = expression.indexOf('+');
    const left = expression[signIndex - 1];
    const right = expression[signIndex + 1];
    const result = left + right;
    if (signIndex - 1 === 0) {
      return expression.length === 3 ? result : parseExpression([result, ...expression.slice(3)]);
    }
    return parseExpression(expression.slice(0, signIndex - 1).concat([result, ...expression.slice(signIndex + 2)]));
  }
  const left = expression[0];
  const sign = expression[1];
  const right = expression[2];
  const result = sign === '*' ? left * right : left + right;
  return expression.length === 3 ? result : parseExpression([result, ...expression.slice(3)]);
};

const findMatchingEndingParenthesis = (expression, start) => {
  let begins = 0;
  for (let i = start; i < expression.length; i++) {
    const char = expression[i];
    if (char === ')') {
      if (begins === 0) {
        return i;
      }
      begins--;
    } else if (char === '(') {
      begins++;
    }
  }
};

const parseParentheses = (expression) => {
  if (!expression.includes('(')) {
    return parseExpression(expression);
  }
  const start = expression.indexOf('(');
  const end = findMatchingEndingParenthesis(expression, start + 1);
  const substitution = parseParentheses(expression.slice(start + 1, end));
  const left = expression.slice(0, start);
  const right = expression.slice(end + 1);
  const newExpression = left.concat(substitution).concat(right);
  return parseParentheses(newExpression);
};

// part 01
let result = 0;
for (const line of lines) {
  result += parseParentheses(line);
}

console.log(`part 01 answer: ${result}`);

// part 02
isPart02 = true;

result = 0;
for (const line of lines) {
  result += parseParentheses(line);
}

console.log(`part 02 answer: ${result}`);

