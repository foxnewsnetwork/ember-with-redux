import Ember from 'ember';
import Immutable from 'immutable';
import { NULL_MAP } from '../constants/initial-state';

export function makeMember(opts) {
  return Immutable.Map(opts);
}
export function setMember(dsStorage, {modelName, id, ref}, member) {
  const key = Ember.isPresent(id) ? id : ref;
  return dsStorage.update(modelName, NULL_MAP, (members) => {
    return members.set(key, member);
  });
}
export function updateNewStorage(state, updater) {
  return state.update('dsNewStorage', updater);
}
export function updateStorage(state, updater) {
  return state.update('dsStorage', updater);
}
export function getStorage(state, { modelName }, defaultValue=NULL_MAP) {
  return state.get('dsStorage').get(modelName, defaultValue);
}

export function getMember(state, {modelName, id}) {
  return state.get('dsStorage', NULL_MAP).get(modelName, NULL_MAP).get(id, NULL_MAP);
}

export function getNewMember(state, {modelName, ref}) {
  const meta = state.get('dsNewStorage', NULL_MAP)
    .get(modelName, NULL_MAP)
    .get(ref, NULL_MAP)
    .get('meta');
  if (Ember.isPresent(meta)) {
    return getMember(state, meta);
  }
}
