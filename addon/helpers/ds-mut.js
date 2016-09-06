import Ember from 'ember';
import { ACTION } from '../-private/internals';
import { DS_MODIFY_CHANGESET } from '../constants/actions';

const { run, inject: { service } } = Ember;

export default Ember.Helper.extend({
  redux: service('redux'),
  compute([changeset, propName]) {
    const redux = this.get('redux');

    let emberAction = function(change) {
      let changes = {};
      changes[propName] = change;
      run.join(redux, redux.dispatch, { type: DS_MODIFY_CHANGESET, changeset, change });
    };
    emberAction[ACTION] = true;
    return emberAction;
  }
});
