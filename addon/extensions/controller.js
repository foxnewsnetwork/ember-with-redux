import Ember from 'ember';
import { getRouteModel } from '../utils/route';
import { get } from '../utils/get-polyfill';

const { inject: {service}, computed, isPresent } = Ember;

function readOnly(...keys) {
  return computed(keys.join('.'), function() {
    return keys.reduce((base, key) => {
      if (isPresent(base)) {
        return get(base, key);
      }
    }, this);
  }).readOnly();
}
export default {
  redux: service('redux'),

  routeModel: computed('routeName', 'redux', function() {
    const {routeName, redux} = this.getProperties('routeName', 'redux');
    const dsState = redux.getState().ds;
    let routeModel;
    if (isPresent(routeName)) {
      routeModel = getRouteModel(dsState, routeName);
    }
    return routeModel;
  }).readOnly(),

  data: readOnly('routeModel', 'data'),
  meta: readOnly('routeModel', 'meta'),
  pojo: readOnly('routeModel', 'pojo'),
  list: readOnly('routeModel', 'list'),
  error: readOnly('routeModel', 'error'),
  status: readOnly('routeModel', 'status'),
  changes: readOnly('changeset', 'changes'),
  changeset: readOnly('routeModel', 'changeset'),

  didActivateRoute() {
    this.unsubscribe = this.get('redux').subscribe(() => {
      this.notifyPropertyChange('routeModel');
    });
  },
  willDeactivateRoute() {
    this.unsubscribe();
  }
};
