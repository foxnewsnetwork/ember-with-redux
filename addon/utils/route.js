import Ember from 'ember';
import Immutable from 'immutable';
import { recordToMeta } from '../utils/record-to';
import { recordsToMeta } from '../utils/records-to';
import { NULL_MAP } from '../constants/initial-state';
import { LIST, RECORD, CHANGESET, POJO } from '../constants/route-model-types';
import { findChangeset } from './ds-changesets';
import { getMember } from './ds-storage';
const { assert, typeOf } = Ember;
const { assign } = Object;
export function getRouteModel(state, routeName) {
  const routeModel = state.get('routesModels').get(routeName, NULL_MAP);
  switch (routeModel.get('dataType')) {
    case LIST:
      return routeModel.update('list', (metas) => metas.map( meta => getMember(state, meta)));
    case RECORD:
      return routeModel.set('data', getMember(state, routeModel.get('meta')).get('data') );
    case CHANGESET:
      return routeModel.set('changeset', findChangeset(state, routeModel.get('meta')));
    case POJO:
      return routeModel;
    default:
      return NULL_MAP;
  }
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
    dataType: RECORD,
    meta: assign({routeName}, recordToMeta(record))
  });
}

export function makeRouteArray({routeName, type, array: records}) {
  return Immutable.Map({
    dataType: LIST,
    status: type,
    list: Immutable.List(records.map(recordToMeta)),
    meta: assign({routeName}, recordsToMeta(records))
  });
}

export function makeRoutePOJO({routeName, type, pojo}) {
  return Immutable.Map({
    dataType: POJO,
    status: type,
    pojo,
    meta: { routeName }
  });
}

export function makeRouteChangeset({routeName, type, changeset}) {
  return Immutable.Map({
    dataType: CHANGESET,
    status: type,
    meta: assign({routeName}, changeset.get('meta'))
  });
}
