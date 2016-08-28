import Ember from 'ember';
import { xSync } from '../utils/x-sync';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED
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
  }
};
