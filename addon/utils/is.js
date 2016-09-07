import Ember from 'ember';

const { typeOf, isPresent, get } = Ember;

export function isDSRecord(maybeRecord) {
  return typeOf(maybeRecord) === 'instance' && isPresent(get(maybeRecord, 'constructor.modelName'));
}

export function isPOJO(maybePOJO) {
  return typeOf(maybePOJO) === 'object';
}

export function isChangeset(maybeChangeset) {
  return typeOf(maybeChangeset) === 'object' &&
    typeOf(maybeChangeset.get) === 'function' &&
    isPresent(maybeChangeset.get('meta')) &&
    isPresent(maybeChangeset.get('changes'));
}
