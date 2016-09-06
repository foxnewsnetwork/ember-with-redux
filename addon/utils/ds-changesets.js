import Immutable from 'immutable';
import { NULL_MAP } from '../constants/initial-state';
import { recordToPOJO } from './record-to';
import {
  isDSRecord,
  isPOJO
} from './is';
/**
Changesets look like:
Map{
  meta: {modelName, ref},
  changes: {}
}
*/
export function updateChangesets(state, updater) {
  return state.update('dsChangesets', updater);
}

function normalizeChanges(something) {
  switch (false) {
    case !isDSRecord(something):
      return recordToPOJO(something);
    case !isPOJO(something):
      return something;
    default:
      return {};
  }
}

export function makeChangeset({modelName, ref}, record) {
  const changes = normalizeChanges(record);
  const meta = { modelName, ref };
  return Immutable.Map({ meta, changes });
}

export function setChangeset(dsChangesets, changeset) {
  const { modelName, ref } = changeset.get('meta');
  return dsChangesets.update(modelName, NULL_MAP, (changesets) => {
    return changesets.set(ref, changeset);
  });
}

export function deleteChangeset(dsChangesets, changeset) {
  const { modelName, ref } = changeset.get('meta');
  return dsChangesets.update(modelName, NULL_MAP, (changeset) => {
    return changeset.remove(ref);
  });
}

export function setChanges(changeset, changes) {
  return changeset.set('changes', changes);
}
