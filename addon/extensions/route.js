import Ember from 'ember';
import {
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED
} from '../constants/actions';

export default {
  redux: Ember.inject.service('redux'),

  model(params, transition) {
    const redux = this.get('redux');
    redux.dispatch({
      type: EMBER_ROUTE_PARAMS_LOADED,
      routeName: this.routeName,
      params
    });
    return this._super(params, transition);
  },

  activate() {
    const redux = this.get('redux');
    redux.dispatch({
      type: EMBER_ROUTE_ACTIVATED,
      routeName: this.routeName
    });
  },

  deactivate() {
    const redux = this.get('redux');
    redux.dispatch({
      type: EMBER_ROUTE_DEACTIVATED,
      routeName: this.routeName
    });
  }
};
