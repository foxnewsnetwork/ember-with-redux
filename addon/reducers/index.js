import {
  setMember,
  updateNewStorage,
  updateStorage,
  makeMember
} from '../utils/ds-storage';
import {
  updateCollections,
  setCollection,
  makeCollectionMember
} from '../utils/ds-collections';
import queryRecordsSucceeded from './query-records-succeeded';
import findRecordSucceeded from './find-record-succeeded';
import createRecordSucceeded from './create-record-succeeded';
import routeModelResolved from './route-model-resolved';
import { INITIAL_STATE } from '../constants/initial-state';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_CREATE_RECORD_REQUESTED,
  DS_CREATE_RECORD_SUCCEEDED,
  DS_CREATE_RECORD_FAILED,
  DS_QUERY_COLLECTION_REQUESTED,
  DS_QUERY_COLLECTION_SUCCEEDED,
  DS_QUERY_COLLECTION_FAILED,
  DS_ALL_COLLECTION_REQUESTED,
  DS_ALL_COLLECTION_SUCCEEDED,
  DS_ALL_COLLECTION_FAILED,
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED,
  EMBER_ROUTE_MODEL_RESOLVED,
  EMBER_DS_RESET_STATE
} from '../constants/actions';

/**
Note the naturally functional pipping nature of every action handler.
If we were in a functional language (e.g. elixir, haskell, or even livescript),
we'd be able to write each handler as something like:

```haskell
state . updateCollections $ setCollection(meta, makeCollectionMember(meta, status))
```
if put collections as the last member in the param list of the setCollection function
Luckily, haskell is a meme language so we can use symbols and constructions less
arcane than `.`, `$`, `<$>`, and `>>=`
*/
export default function ds(state=INITIAL_STATE, action={}) {
  const { meta, error, type: status } = action;
  switch (action.type) {
    case DS_QUERY_COLLECTION_REQUESTED:
    case DS_ALL_COLLECTION_REQUESTED:
      return updateCollections(state,  (collections) => {
        return setCollection(collections, meta, makeCollectionMember({meta, status}));
      });
    case DS_ALL_COLLECTION_SUCCEEDED:
    case DS_QUERY_COLLECTION_SUCCEEDED:
      return queryRecordsSucceeded(state, action);
    case DS_QUERY_COLLECTION_FAILED:
    case DS_ALL_COLLECTION_FAILED:
      return updateCollections(state, (collections) => {
        return setCollection(collections, meta, makeCollectionMember({meta, error, status}));
      });
    case DS_CREATE_RECORD_REQUESTED:
      return updateNewStorage(state, (storage) => {
        return setMember(storage, meta, makeMember({meta, status}));
      });
    case DS_CREATE_RECORD_SUCCEEDED:
      return createRecordSucceeded(state, action);
    case DS_CREATE_RECORD_FAILED:
      return updateNewStorage(state, (storage) => {
        return setMember(storage, meta, makeMember({meta, status, error}));
      });
    case DS_FIND_RECORD_REQUESTED:
      return updateStorage(state, (storage) => {
        return setMember(storage, meta, makeMember({meta, status}));
      });
    case DS_FIND_RECORD_FAILED:
      return updateStorage(state, (storage) => {
        return setMember(storage, meta, makeMember({meta, error, status}));
      });
    case DS_FIND_RECORD_SUCCEEDED:
      return findRecordSucceeded(state, action);
    case EMBER_ROUTE_MODEL_RESOLVED:
      return routeModelResolved(state, action);
    case EMBER_ROUTE_ACTIVATED:
      return state.update('activeRoutes', (routes) => routes.push(action.routeName));
    case EMBER_ROUTE_DEACTIVATED:
      return state.update('activeRoutes', (routes) => routes.pop());
    case EMBER_ROUTE_PARAMS_LOADED:
      return state.update('routesParams', (routes) => routes.set(action.routeName, action.params));
    case EMBER_DS_RESET_STATE:
      return INITIAL_STATE;
    default:
      return state;
  }
}
