import Ember from 'ember';

const { isPresent, get } = Ember;

function getAllKeys(hashA, hashB) {
  let keys = Ember.A(Object.keys(hashA));
  let bKeys = Object.keys(hashB);
  for(let i = 0; i < get(keys, 'length'); i++) {
    const key = bKeys[i];
    if (!keys.includes(key)) {
      keys.push(bKeys[i]);
    }
  }
  return keys;
}
export default function mergeWith(onCollison, hashA, hashB) {
  const allKeys = getAllKeys(hashA, hashB);
  let output = {};
  for(let i = 0; i < get(allKeys, 'length'); i++) {
    const key = allKeys[i];
    const aVal = get(hashA, key);
    const bVal = get(hashB, key);
    let val;
    if (isPresent(aVal) && isPresent(bVal)) {
      val = onCollison(aVal, bVal);
    } else {
      val = aVal || bVal
    }
    set(output, key, val);
  }
  return output;
}
