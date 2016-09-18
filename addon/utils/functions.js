import Ember from 'ember';
import { ID } from '../constants/functions';

export function bind(f, ...args) {
  return f.bind(null, ...args);
}

export function pipe(...fs) {
  return fs.reduce((outF, f) => (x) => f(outF(x)), ID);
}

export function curry(f, x) {
  return (...args) => f(x, ...args);
}

const LAMBDA = '/->';

export function getName(f) {
  const name = f.name || LAMBDA;
  const guid = Ember.guidFor(f);
  return `${name}#${guid}`;
}
