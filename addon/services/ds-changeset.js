import Ember from 'ember';
import {
  afterSuccess,
  afterFailure,
  beforePersist
} from '../utils/changeset-hooks';
import { findChangeset } from '../utils/ds-changesets';

const { inject: { service } } = Ember;

function attachHook(redux, changeset, hookAction) {
  const meta = changeset.get('meta');

  redux.dispatch(hookAction);
  return findChangeset(redux.getState().ds, meta);
}

export default Ember.Service.extend({
  redux: service('redux'),
  afterSuccess(changeset, fn) {
    return attachHook(this.get('redux'), changeset, afterSuccess(changeset, fn));
  },
  afterFailure(changeset, fn) {
    return attachHook(this.get('redux'), changeset, afterFailure(changeset, fn));
  },
  beforePersist(changeset, fn) {
    return attachHook(this.get('redux'), changeset, beforePersist(changeset, fn));
  }
});
