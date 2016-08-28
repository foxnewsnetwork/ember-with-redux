import {
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED,
  EMBER_DS_RESET_STATE
} from '../constants/actions';

export default function dsReducerGenerator(initialState, defaultAction) {
  return (state=initialState, action=defaultAction) => {
    switch (action.type) {
      case EMBER_ROUTE_ACTIVATED:
        return state.update('activeRoutes', (routes) => {
          return routes.push(action.routeName);
        });
      case EMBER_ROUTE_DEACTIVATED:
        return state.update('activeRoutes', (routes) => {
          return routes.pop();
        });
      case EMBER_ROUTE_PARAMS_LOADED:
        return state.update('routesParams', (routes) => {
          return routes.set(action.routeName, action.params);
        });
      case EMBER_DS_RESET_STATE:
        return initialState;
      default:
        return state;
    }
  };
}
