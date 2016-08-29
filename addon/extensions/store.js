import Ember from 'ember';
import { xSync } from '../utils/x-sync';
import uniqRef from '../utils/uniq-ref';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_CREATE_RECORD_REQUESTED,
  DS_CREATE_RECORD_SUCCEEDED,
  DS_CREATE_RECORD_FAILED
} from '../constants/actions';

const findSync = xSync({
  requestType: DS_FIND_RECORD_REQUESTED,
  successType: DS_FIND_RECORD_SUCCEEDED,
  failureType: DS_FIND_RECORD_FAILED
});
const { inject: {service} } = Ember;

export default {
  redux: service('redux'),
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
