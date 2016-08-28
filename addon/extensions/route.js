import Ember from 'ember';
import {
  EMBER_ROUTE_MODEL_RESOLVED,
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

  afterModel(model, transition) {
    const redux = this.get('redux');

    if (Ember.isPresent(model)) {
      redux.dispatch({
        type: EMBER_ROUTE_MODEL_RESOLVED,
        routeName: this.routeName,
        model
      });
    }
    return this._super(model, transition);
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
