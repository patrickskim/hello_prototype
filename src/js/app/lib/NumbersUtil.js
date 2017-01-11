import _ from 'lodash';

function randomNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}

function randomNegNum(start, end) {
  return _.random(start, end) * randomNeg();
}

export { randomNeg, randomNegNum };
