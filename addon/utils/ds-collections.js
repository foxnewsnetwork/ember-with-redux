import Immutable from 'immutable';
import { ALL } from '../constants/functions';
import { NULL_MAP, NULL_LIST } from '../constants/initial-state';
import { getMember } from './ds-storage';

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

export function getCollection(state, {modelName, filter=ALL}) {
  const { name: filterName } = filter;
  const metasList = state.get('dsCollections', NULL_MAP).get(modelName, NULL_MAP).get(filterName, NULL_MAP).get('list', NULL_LIST);

  return metasList.map(meta => getMember(state, meta)).filter(filter);
}
