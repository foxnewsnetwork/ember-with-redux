import Ember from 'ember';
import {
  isDSRecord,
  isChangeset
} from '../utils/is';
import {
  EMBER_ROUTE_MODEL_RESOLVED,
  EMBER_ROUTE_ARRAY_RESOLVED,
  EMBER_ROUTE_POJO_RESOLVED,
  EMBER_ROUTE_CHANGESET_RESOLVED,
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED
} from '../constants/actions';

const { isArray } = Ember;
const ActionImplementation = {
  dsArray(array) { return { type: EMBER_ROUTE_ARRAY_RESOLVED, array }; },
  dsModel(model) { return { type: EMBER_ROUTE_MODEL_RESOLVED, model }; },
  pojoModel(pojo) { return { type: EMBER_ROUTE_POJO_RESOLVED, pojo }; },
  changesetModel(changeset) { return { type: EMBER_ROUTE_CHANGESET_RESOLVED, changeset }; }
};

function modelAction(model) {
  switch(false) {
    case !isArray(model):
      return ActionImplementation.dsArray(model);
    case !isDSRecord(model):
      return ActionImplementation.dsModel(model);
    case !isChangeset(model):
      return ActionImplementation.changesetModel(model);
    default:
      return ActionImplementation.pojoModel(model);
  }
}

export default {
  redux: Ember.inject.service('redux'),

  setupController(controller, model) {
    controller.set('routeName', this.routeName);
    controller.didActivateRoute();
    return this._super(controller, model);
  },

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
    const actionBase = { routeName: this.routeName };
    const action = Ember.assign(actionBase, modelAction(model));
    redux.dispatch(action);
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
    this.controller.willDeactivateRoute();
  }
};
