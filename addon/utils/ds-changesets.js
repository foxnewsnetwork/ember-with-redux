import Ember from 'ember';
import Immutable from 'immutable';
import { NULL_MAP } from '../constants/initial-state';
import { recordToPOJO } from './record-to';
import {
  isDSRecord,
  isPOJO
} from './is';
import { ID2, DIE2 } from '../constants/functions';
import mergeWith from './merge-with';
import { pipe, curry } from './functions';
/**
Changesets look like:
Map{
  meta: {modelName, ref},
  changes: {}
}
*/
const { isPresent, assert } = Ember;

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

function makeAfterPersist(afterSuccess, afterFailure) {
  return (promise) => promise.then(afterSuccess).catch(afterFailure);
}

export function makeChangeset({meta, hooks, changes: rawChanges}) {
  const changes = normalizeChanges(rawChanges);

  return Immutable.Map({ meta, changes, hooks });
}

export function makeChangeThunk(changeset) {
  const { beforePersist=ID2, persist, afterSuccess=ID2, afterFailure=DIE2 } = changeset.get('hooks');
  return (dispatch) => {
    const afterPersist = makeAfterPersist(curry(afterSuccess, dispatch), curry(afterFailure, dispatch));
    const changeFun = pipe(curry(beforePersist, dispatch), curry(persist, dispatch), afterPersist);
    return changeFun(changeset);
  };
}

export function setChangeset(dsChangesets, changeset) {
  const { modelName, ref } = changeset.get('meta');
  assert('your changeset must have a valid modelName in its meta field', isPresent(modelName));
  assert('your changeset must have a valid ref value in its meta field', isPresent(ref));
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

export function mergeHooks(changeset, hooks) {
  return changeset.update('hooks', {}, (existingHooks) => {
    return mergeWith(pipe, existingHooks, hooks);
  });
}

export function setError(changeset, error) {
  return changeset.set('error', error);
}
