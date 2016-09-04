import { recordToMeta, recordToPOJO } from '../utils/record-to';
import {
  makeMember,
  setMember,
  updateNewStorage,
  updateStorage
} from '../utils/ds-storage';

function makeSavedRecordMeta({ meta, record }) {
  return recordToMeta(record, meta);
}

function makeNewMember(action) {
  return makeMember({
    meta: makeSavedRecordMeta(action),
    status: action.type
  });
}

function makeRegularMember(action) {
  return makeMember({
    meta: makeSavedRecordMeta(action),
    data: recordToPOJO(action.record),
    status: action.type
  });
}

export default function createRecordSucceeded(state, action) {
  const storedState = updateNewStorage(state, (storage) => {
    return setMember(storage, action.meta, makeNewMember(action));
  });
  return updateStorage(storedState, (storage) => {
    const meta = makeSavedRecordMeta(action);
    return setMember(storage, meta, makeRegularMember(action));
  });
}
