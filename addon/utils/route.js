import Ember from 'ember';
import Immutable from 'immutable';
import { recordToPOJO, recordToMeta } from '../utils/record-to';
import { recordsToMeta } from '../utils/records-to';

const { assert, typeOf, assign } = Ember;
export function getRouteModel(state, routeName) {
  return state.get('routesModels').get(routeName);
}

export function getRouteParams(state, routeName) {
  return state.get('routesParams').get(routeName);
}

export function updateRoutesModels(state, updater) {
  return state.update('routesModels', updater);
}

export function setRouteModel(routesModels, routeName, routeModel) {
  assert('routeName should be the string present on Ember Routes that look like "foo.bar.index"', typeOf(routeName) === 'string');
  return routesModels.set(routeName, routeModel);
}

export function makeRouteModel({routeName, type, model: record}) {
  return Immutable.Map({
    status: type,
    data: recordToPOJO(record),
    meta: assign({routeName}, recordToMeta(record))
  });
}

export function makeRouteArray({routeName, type, array: records}) {
  return Immutable.Map({
    status: type,
    list: Immutable.List(records.map(recordToMeta)),
    meta: assign({routeName}, recordsToMeta(records))
  });
}

export function makeRoutePOJO({routeName, type, pojo}) {
  return Immutable.Map({
    status: type,
    pojo,
    meta: { routeName }
  });
}
