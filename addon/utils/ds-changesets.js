import Ember from 'ember';
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

export function findChangeset(state, {modelName, ref}) {
  return state.get('dsChangesets', NULL_MAP).get(modelName, NULL_MAP).get(ref, NULL_MAP);
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

export function makeChangeset({meta, changes: rawChanges}) {
  const changes = normalizeChanges(rawChanges);
  return Immutable.Map({ meta, changes });
}

export function setChangeset(dsChangesets, changeset) {
  const { modelName, ref } = changeset.get('meta');
  Ember.assert('your changeset must have a valid modelName in its meta field', Ember.isPresent(modelName));
  Ember.assert('your changeset must have a valid ref value in its meta field', Ember.isPresent(ref));
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

export function mergeChanges(changeset, changes) {
  return changeset.update('changes', {}, (existingChanges) => {
    return Ember.assign({}, existingChanges, changes);
  });
}

export function setError(changeset, error) {
  return changeset.set('error', error);
}
