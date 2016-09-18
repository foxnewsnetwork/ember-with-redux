import Immutable from 'immutable';
import { ID } from '../constants/functions';
import { NULL_MAP } from '../constants/initial-state';
import { getStorage } from './ds-storage';
import { getName } from './functions';

export function setCollection(collection, {modelName, transducer=ID}, collectionMember) {
  const transducerName = getName(transducer);

  return collection.update(modelName, NULL_MAP, (subCol) => {
    return subCol.set(transducerName, collectionMember);
  });
}

export function makeCollectionMember({meta, status}) {
  return Immutable.Map({ meta, status });
}

export function updateCollections(state, updater) {
  return state.update('dsCollections', updater);
}

export function getList(state, { modelName, transducer=ID}) {
  return transducer(getStorage(state, { modelName })).toList();
}
