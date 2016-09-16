import Ember from 'ember';
import { xSync } from '../utils/x-sync';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_CHANGESET_PERSIST_FAILED,
  DS_CHANGESET_PERSIST_SUCCEEDED,
  DS_CHANGESET_CREATED,
  DS_QUERY_COLLECTION_REQUESTED,
  DS_QUERY_COLLECTION_SUCCEEDED,
  DS_QUERY_COLLECTION_FAILED
} from '../constants/actions';
import { ALL } from '../constants/functions';
import {
  checkoutChangeset,
  checkoutNewChangeset
} from '../utils/checkout-changeset';
import {
  makeChangeThunk
} from '../utils/ds-changesets';
import {
  isDSRecord
} from '../utils/is';
import { curry } from '../utils/functions';

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
const { inject: {service}, isPresent } = Ember;

const USAGE_MESSAGE = 'You must either pass in a `{ record: DS.Model }` or a ' +
'`{ modelName: String }` to get back a changeset object';

function maybePeekRecord(store, modelName, id) {
  if (isPresent(modelName) && isPresent(id)) {
    return store.peekRecord(modelName, id);
  }
}

function setupAttributes(record, data={}) {
  record.setProperties(data);
  return record;
}

function persistChangeset(store, dispatch, changeset) {
  const { modelName, id } = changeset.get('meta', {});
  const data = changeset.get('changes', {});
  const cleanRecord = maybePeekRecord(store, modelName, id) || store.createRecord(modelName);
  const dirtyRecord = setupAttributes(cleanRecord, data);

  dispatch({ type: DS_CHANGESET_CREATED, changeset });
  return dirtyRecord.save().then((record) => {
    dispatch({ type: DS_CHANGESET_PERSIST_SUCCEEDED, record, changeset });
    return record;
  }).catch(function(error) {
    dispatch({ type: DS_CHANGESET_PERSIST_FAILED, error, changeset });
    dirtyRecord.rollbackAttributes();
    throw error;
  });
}

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
  checkoutChangeset({modelName, record, changes={}}) {
    const redux = this.get('redux');
    const persist = curry(persistChangeset, this);
    switch (false) {
      case !isDSRecord(record):
        return checkoutChangeset(redux, record, changes, persist);
      case !isPresent(modelName):
        return checkoutNewChangeset(redux, modelName, changes, persist);
      default:
        throw new Error(USAGE_MESSAGE);
    }
  },
  persistChangeset(changeset) {
    const redux = this.get('redux');
    const changeThunk = makeChangeThunk(changeset);

    return redux.dispatch(changeThunk);
  }
};
