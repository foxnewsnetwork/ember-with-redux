import Immutable from 'immutable';

export const NULL_LIST = Immutable.List();
export const NULL_MAP = Immutable.Map();
export const INITIAL_STATE = Immutable.Map({
  activeRoutes: NULL_LIST,
  routesParams: NULL_MAP,
  routesModels: NULL_MAP,
  dsStorage: NULL_MAP,
  dsCollections: NULL_MAP,
  dsChangesets: NULL_MAP
});
