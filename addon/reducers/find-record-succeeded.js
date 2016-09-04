import {
  recordToPOJO,
  recordToMeta
} from '../utils/record-to';
import {
  updateStorage,
  setStorage,
  makeMember
} from '../utils/ds-storage';

export default function findRecordSucceeded(state, { type: status, record }) {
  const data = recordToPOJO(record);
  const meta = recordToMeta(record);

  return updateStorage(state, (storage) => {
    return setStorage(storage, meta, makeMember({ meta, status, data }));
  });
}
