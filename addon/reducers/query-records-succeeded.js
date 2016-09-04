import {
  updateCollections,
  setCollection,
  makeCollectionMember
} from '../utils/ds-collections';
import findRecordSucceeded from './find-record-succeeded';

export default function queryRecordsSucceeded(state, { type: status, meta, record: records }) {
  const collectionsState = updateCollections(state, (collections) => setCollection(collections, meta, makeCollectionMember({meta, status})));
  return records.reduce((state, record) => {
    return findRecordSucceeded(state, { record });
  }, collectionsState);
}
