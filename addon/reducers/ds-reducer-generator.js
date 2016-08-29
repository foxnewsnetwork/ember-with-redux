import metaToKey from '../utils/meta-to-key';
import { recordToPOJO, recordToMeta } from '../utils/record-to';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_CREATE_RECORD_REQUESTED,
  DS_CREATE_RECORD_SUCCEEDED,
  DS_CREATE_RECORD_FAILED,
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED,
  EMBER_ROUTE_MODEL_RESOLVED,
  EMBER_DS_RESET_STATE
} from '../constants/actions';

export default function dsReducerGenerator(initialState, defaultAction) {
  return (state=initialState, action=defaultAction) => {
    switch (action.type) {
      case DS_CREATE_RECORD_REQUESTED:
        return state.update('dsStorage', (storage) => {
          const { meta, type } = action;
          return storage.set(metaToKey(meta), { meta, status: type });
        });
      case DS_CREATE_RECORD_SUCCEEDED:
        return state.update('dsStorage', (storage) => {
          const { meta: newRecordMeta, type, record: savedRecord } = action;
          const newRecordKey = metaToKey(newRecordMeta);
          const savedRecordMeta = recordToMeta(savedRecord, newRecordMeta);
          const savedRecordKey = metaToKey(savedRecordMeta);
          const newRecordModel = { meta: newRecordMeta, link: savedRecordKey, status: type };
          const savedRecordModel = {
            meta: savedRecordMeta,
            status: type,
            data: recordToPOJO(savedRecord)
          };
          return storage.set(newRecordKey, newRecordModel).set(savedRecordKey, savedRecordModel);
        });
      case DS_CREATE_RECORD_FAILED:
        return state.update('dsStorage', (storage) => {
          const { meta, type, error } = action;
          return storage.set(metaToKey(meta), {meta, error, status: type});
        });
      case DS_FIND_RECORD_REQUESTED:
        return state.update('dsStorage', (storage) => {
          const { meta, type } = action;
          return storage.set(metaToKey(meta), {meta, status: type});
        });
      case DS_FIND_RECORD_FAILED:
        return state.update('dsStorage', (storage) => {
          const { meta, type, error } = action;
          return storage.set(metaToKey(meta), {meta, error, status: type});
        });
      case DS_FIND_RECORD_SUCCEEDED:
        return state.update('dsStorage', (storage) => {
          const { meta, type, record } = action;
          return storage.set(metaToKey(meta), {
            meta: recordToMeta(record),
            data: recordToPOJO(record),
            status: type
          });
        });
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
