import Ember from 'ember';
import { ACTION } from '../-private/internals';
import { DS_CHANGESET_MODIFIED } from '../constants/actions';

const { run, inject: { service }, get, assert } = Ember;

export default Ember.Helper.extend({
  redux: service('redux'),
  compute([changeset, propName]) {
    const redux = get(this, 'redux');
    assert('[ember-with-redux] Unable to find redux', redux);

    let emberAction = function(change) {
      let changes = {};
      changes[propName] = change;
      run.join(redux, redux.dispatch, { type: DS_CHANGESET_MODIFIED, changeset, changes });
    };

    emberAction[ACTION] = true;
    return emberAction;
  }
});
