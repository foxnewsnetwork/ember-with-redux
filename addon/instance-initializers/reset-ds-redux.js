import { EMBER_DS_RESET_STATE } from '../constants/actions';

export function initialize( appInstance ) {
  const redux = appInstance.lookup('service:redux');

  redux.dispatch({ type: EMBER_DS_RESET_STATE });
}

export default {
  name: 'reset-ds-redux',
  initialize
};
