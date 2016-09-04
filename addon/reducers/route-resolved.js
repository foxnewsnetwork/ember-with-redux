import {
  updateRoutesModels,
  setRouteModel,
  makeRouteModel,
  makeRouteArray,
  makeRoutePOJO
} from '../utils/route';

export function routeModelResolved(state, action) {
  const { routeName, type, model } = action;

  return updateRoutesModels(state, (routes) => {
    return setRouteModel(routes, routeName, makeRouteModel({routeName, type, model}));
  });
}

export function routeArrayResolved(state, action) {
  const { routeName, type, array } = action;

  return updateRoutesModels(state, (routes) => {
    return setRouteModel(routes, routeName, makeRouteArray({routeName, type, array}));
  });
}

export function routePOJOResolved(state, action) {
  const { routeName, type, pojo } = action;

  return updateRoutesModels(state, (routes) => {
    return setRouteModel(routes, routeName, makeRoutePOJO({routeName, type, pojo}));
  });
}
