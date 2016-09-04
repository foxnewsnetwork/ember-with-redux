import Immutable from 'immutable';
import { ALL } from '../constants/functions';
import { NULL_MAP } from '../constants/initial-state';
import { getStorage } from './ds-storage';

export function setCollection(collection, {modelName, filter=ALL}, collectionMember) {
  const { name: filterName } = filter;

  return collection.update(modelName, NULL_MAP, (subCol) => {
    return subCol.set(filterName, collectionMember);
  });
}

export function makeCollectionMember({meta, status}) {
  return Immutable.Map({ meta, status });
}

export function updateCollections(state, updater) {
  return state.update('dsCollections', updater);
}

function xLog(x) {
  console.log('234234', x);
  return x;
}
export function getList(state, { modelName, filter=ALL}) {
  return getStorage(state, { modelName })
    .filter(filter)
    .toList();
}
