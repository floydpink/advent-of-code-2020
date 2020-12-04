const fs = require('fs');

const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n');

const passports = [];
let current = {};
for (const line of input) {
  if (!line) {
    passports.push(current);
    current = {};
  } else {
    const attrs = line.split(' ');
    for (const attr of attrs) {
      const [k, v] = attr.split(':').map(c => c.trim());
      current[k] = v;
    }
  }
}

// part 01
const validPassports = passports.filter(p => {
  return Object.keys(p).length >= 7 &&
    p.byr != null &&
    p.iyr != null &&
    p.eyr != null &&
    p.hgt != null &&
    p.hcl != null &&
    p.ecl != null &&
    p.pid != null;
});
console.log(`part 01 answer: ${validPassports.length}`);

// part 02
class Passport {
  constructor(obj) {
    this.birthYear = obj.byr;
    this.issueYear = obj.iyr;
    this.expirationYear = obj.eyr;
    this.height = obj.hgt;
    this.hairColor = obj.hcl;
    this.eyeColor = obj.ecl;
    this.passportId = obj.pid;
    this.countryId = obj.cid;
  }

  static validYear(year, min = 1900, max = 2050) {
    return year != null && new RegExp(/^\d\d\d\d$/).test(year) && year >= min && year <= max;
  }

  get hasValidBirthYear() {
    return Passport.validYear(this.birthYear, 1920, 2002);
  }

  get hasValidIssueYear() {
    return Passport.validYear(this.issueYear, 2010, 2020);
  }

  get hasValidExpirationYear() {
    return Passport.validYear(this.expirationYear, 2020, 2030);
  }

  get hasValidHeight() {
    const height = this.height;
    if (height == null) {
      return false;
    }

    const validExpression = new RegExp(/^\d+cm$/).test(height) || new RegExp(/^\d+in$/).test(height);

    let validRange = false;
    if (height.includes('cm')) {
      const number = parseInt(height.replace('cm', ''), 10);
      validRange = number >= 150 && number <= 193;
    } else if (height.includes('in')) {
      const number = parseInt(height.replace('cm', ''), 10);
      validRange = number >= 59 && number <= 76;
    }

    return validExpression && validRange;
  }

  get hasValidHairColor() {
    return this.hairColor != null && new RegExp(/^#[a-f0-9]{6}$/).test(this.hairColor);
  }

  get hasValidEyeColor() {
    return this.eyeColor != null && new RegExp(/^amb|blu|brn|gry|grn|hzl|oth$/).test(this.eyeColor);
  }

  get hasValidPassportId() {
    return this.passportId != null && new RegExp(/^[0-9]{9}$/).test(this.passportId);
  }

  get isValid() {
    return this.hasValidBirthYear && this.hasValidIssueYear && this.hasValidExpirationYear &&
      this.hasValidHeight && this.hasValidHairColor && this.hasValidEyeColor && this.hasValidPassportId;
  }
}

const pp = passports.map(p => new Passport(p));
console.log(`part 02 answer: ${pp.filter(p => p.isValid).length}`);
