import Ember from 'ember';
import { ACTION } from '../-private/internals';

const { inject: { service }, run, assert } = Ember;

export default Ember.Helper.extend({
  redux: service('redux'),
  store: service('store'),
  compute([changeset]) {
    const { redux, store } = this.getProperties('redux', 'store');
    assert('[ember-with-redux] Unable to find redux', redux);
    assert('[ember-with-redux] Unable to find store', store);
    let emberAction = function() {
      run.join(redux, redux.dispatch, store.persistChangeset(changeset));
    };
    emberAction[ACTION] = true;
    return emberAction;
  }
});
