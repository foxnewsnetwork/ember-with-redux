import { recordToMeta, recordToPOJO } from '../utils/record-to';
import {
  updateChangesets,
  deleteChangeset,
  setChangeset,
  mergeChanges,
  setError
} from '../utils/ds-changesets';
import {
  setMember,
  updateStorage,
  makeMember
} from '../utils/ds-storage';

export function modifyChangeset(state, action) {
  const { changeset, changes } = action;
  return updateChangesets(state, (changesets) => {
    return setChangeset(changesets, mergeChanges(changeset, changes));
  });
}

export function setupChangeset(state, action) {
  const { changeset } = action;
  return updateChangesets(state, (changesets) => {
    return setChangeset(changesets, changeset);
  });
}

export function destroyChangeset(state, action) {
  const { changeset } = action;
  return updateChangesets(state, (changesets) => {
    return deleteChangeset(changesets, changeset);
  });
}

export function failChangeset(state, action) {
  const { changeset, error } = action;
  return updateChangesets(state, (changesets) => {
    return setChangeset(changesets, setError(changeset, error));
  });
}

export function persistChangeset(state, action) {
  const { changeset: preSaveChangeset, record } = action;
  const preSaveMeta = preSaveChangeset.get('meta');
  const data = recordToPOJO(record);
  const meta = recordToMeta(record, preSaveMeta);
  const changeset = preSaveChangeset.set('meta', meta);
  const changedState = updateChangesets(state, (changesets) => {
    return setChangeset(changesets, changeset);
  });
  return updateStorage(changedState, (storage) => {
    return setMember(storage, meta, makeMember({ meta, data, status }));
  });
}
