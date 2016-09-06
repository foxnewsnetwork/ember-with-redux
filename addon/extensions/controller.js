import Ember from 'ember';
import { getRouteModel } from '../utils/route';

const { inject: {service}, computed, isBlank, isPresent, assert } = Ember;

function readOnly(...keys) {
  return computed(keys.join('.'), function() {
    return keys.reduce((base, key) => {
      if (isPresent(base)) {
        return base.get(key);
      }
    }, this);
  }).readOnly();
}
export default {
  redux: service('redux'),

  dsState: computed('redux', function() {
    const dsState = this.get('redux').getState().ds;
    assert('For now, all the relevant ember state must live in the `ds` namespace in your reducers', isPresent(dsState));
    return dsState;
  }),

  routeModel: computed('routeName', 'dsState', function() {
    const {routeName, dsState} = this.getProperties('routeName', 'dsState');
    if (isBlank(routeName)) {
      return;
    }
    return getRouteModel(dsState, routeName);
  }),

  data: readOnly('routeModel', 'data'),
  meta: readOnly('routeModel', 'meta'),
  pojo: readOnly('routeModel', 'pojo'),
  list: readOnly('routeModel', 'list'),
  error: readOnly('routeModel', 'error'),
  status: readOnly('routeModel', 'status'),

  didActivateRoute() {
    this.notifyPropertyChange('dsState');
    this.unsubscribe = this.get('redux').subscribe(() => {
      this.notifyPropertyChange('dsState');
    });
  },
  willDeactivateRoute() {
    this.unsubscribe();
  }
};
