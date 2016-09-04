import Ember from 'ember';
import { xSync } from '../utils/x-sync';
import uniqRef from '../utils/uniq-ref';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_CREATE_RECORD_REQUESTED,
  DS_CREATE_RECORD_SUCCEEDED,
  DS_CREATE_RECORD_FAILED,
  DS_QUERY_COLLECTION_REQUESTED,
  DS_QUERY_COLLECTION_SUCCEEDED,
  DS_QUERY_COLLECTION_FAILED
} from '../constants/actions';
import { ALL } from '../constants/functions';

const findSync = xSync({
  requestType: DS_FIND_RECORD_REQUESTED,
  successType: DS_FIND_RECORD_SUCCEEDED,
  failureType: DS_FIND_RECORD_FAILED
});
const querySync = xSync({
  requestType: DS_QUERY_COLLECTION_REQUESTED,
  successType: DS_QUERY_COLLECTION_SUCCEEDED,
  failureType: DS_QUERY_COLLECTION_FAILED
});
const { inject: {service} } = Ember;

export default {
  redux: service('redux'),
  query(modelName, params, filter=ALL, syncWithRedux=true) {
    const guid = Ember.guidFor(filter);
    const collectionPromise = this._super(modelName, params);

    if (syncWithRedux) {
      const meta = { modelName, filter, guid };
      const redux = this.get('redux');
      const dispatch = redux.dispatch.bind(redux);

      return querySync(dispatch, meta, collectionPromise);
    }
    return collectionPromise;
  },
  findAll(modelName, opts, syncWithRedux=true) {
    const collectionPromise = this._super(modelName, opts);
    if (syncWithRedux) {
      const meta = { modelName, filter: ALL };
      const redux = this.get('redux');
      const dispatch = redux.dispatch.bind(redux);

      return querySync(dispatch, meta, collectionPromise);
    }
  },
  findRecord(modelName, id, opts, syncWithRedux=true) {
    const recordPromise = this._super(modelName, id, opts);
    if (syncWithRedux) {
      const meta = { modelName, id };
      const redux = this.get('redux');
      const dispatch = redux.dispatch.bind(redux);

      return findSync(dispatch, meta, recordPromise);
    }
    return recordPromise;
  },
  setupRecord(modelName, data) {
    const meta = { modelName, ref: uniqRef() };
    return { meta, data };
  },
  persistRecord({meta, data}) {
    return (dispatch) => {
      dispatch({ type: DS_CREATE_RECORD_REQUESTED, meta });
      const dirtyRecord = this.createRecord(meta.modelName, data);
      return dirtyRecord.save().then((record) => {
        dispatch({ type: DS_CREATE_RECORD_SUCCEEDED, record, meta });
        return record;
      }).catch(function(error) {
        dispatch({ type: DS_CREATE_RECORD_FAILED, error, meta });
        dirtyRecord.rollbackAttributes();
        throw error;
      });
    };
  }
};
