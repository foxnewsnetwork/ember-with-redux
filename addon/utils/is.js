import Ember from 'ember';

const { typeOf, isPresent, get } = Ember;

export function isDSRecord(maybeRecord) {
  return typeOf(maybeRecord) === 'instance' && isPresent(get(maybeRecord, 'constructor.modelName'));
}

export function isPOJO(maybePOJO) {
  return typeOf(maybePOJO) === 'object';
}
