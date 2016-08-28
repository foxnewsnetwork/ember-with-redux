import { recordToPOJO, recordToMeta } from '../utils/record-to';
import {
  // DS_FIND_RECORD_REQUESTED,
  // DS_FIND_RECORD_SUCCEEDED,
  // DS_FIND_RECORD_FAILED,
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED,
  EMBER_ROUTE_MODEL_RESOLVED,
  EMBER_DS_RESET_STATE
} from '../constants/actions';

export default function dsReducerGenerator(initialState, defaultAction) {
  return (state=initialState, action=defaultAction) => {
    switch (action.type) {
      // case DS_FIND_RECORD_REQUESTED:
      //   return state.update('routesModels', (routes) => {
      //     const { meta, routeName, type } = action;
      //     return routes.set(routeName, {meta, status: type});
      //   });
      // case DS_FIND_RECORD_FAILED:
      //   return state.update('routesModels', (routes) => {
      //     const { meta, routeName, type, error } = action;
      //     return routes.set(routeName, {meta, error, status: type});
      //   });
      // case DS_FIND_RECORD_SUCCEEDED:
      case EMBER_ROUTE_MODEL_RESOLVED:
        return state.update('routesModels', (routes) => {
          const { routeName, type, model } = action;
          return routes.set(routeName, {
            meta: recordToMeta(model),
            data: recordToPOJO(model),
            status: type
          });
        });
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
