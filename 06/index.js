const fs = require('fs');

const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n');

class Group {
  constructor() {
    this.questions = new Set();
    this.personQuestions = new Map();
    this.people = 0;
  }

  add(person) {
    for (const a of person.split('')) {
      this.questions.add(a);
      if (!this.personQuestions.has(a)) {
        this.personQuestions.set(a, 0);
      }
      this.personQuestions.set(a, this.personQuestions.get(a) + 1);
    }
    this.people++;
  }

  get validQuestions() {
    return [...this.personQuestions.values()].filter(v => v === this.people).length;
  }
}

const groups = [];
let current = new Group();
for (let i = 0; i < input.length; i++) {
  let person = input[i];
  if (person === '') {
    groups.push(current);
    current = new Group();
  } else {
    current.add(person);
  }
}

const combinedQuestionsCount = groups.map(g => g.questions.size).reduce((a, b) => a + b);
console.log(`part 01 answer: ${combinedQuestionsCount}`);

let allQuestionsCount = groups.map(g => g.validQuestions).reduce((a, b) => a + b);
console.log(`part 02 answer: ${allQuestionsCount}`);