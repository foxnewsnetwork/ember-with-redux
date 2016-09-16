import Ember from 'ember';
import { EMBER_DS_RESET_STATE } from '../constants/actions';

export function initialize( appInstance ) {
  let redux;
  if (Ember.typeOf(appInstance.lookup) === 'function') {
    redux = appInstance.lookup('service:redux');
  } else {
    redux = appInstance.container.lookup('service:redux');
  }

  redux.dispatch({ type: EMBER_DS_RESET_STATE });
}

export default {
  name: 'reset-ds-redux',
  initialize
};
