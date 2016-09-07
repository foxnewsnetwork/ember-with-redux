import Ember from 'ember';

const { isBlank, typeOf } = Ember;

function respondTo(obj, fkey) {
  return typeof obj === 'object' && typeOf(obj[fkey]) === 'function';
}

export function get(obj, keyPath='') {
  switch (false) {
    case !(isBlank(keyPath) || isBlank(obj)):
      return obj;
    case !respondTo(obj, 'get'):
      const [key, ...keys] = keyPath.split('.');
      return get(obj.get(key), keys.join('.'));
    default:
      return Ember.get(obj, keyPath);
  }
}
