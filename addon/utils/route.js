export function getRouteModel(state, routeName) {
  return state.get('routesModels').get(routeName);
}

export function getRouteParams(state, routeName) {
  return state.get('routesParams').get(routeName);
}
