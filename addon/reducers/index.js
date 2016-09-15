import {
  setMember,
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
import {
  setupChangeset,
  destroyChangeset,
  modifyChangeset,
  modifyChangesetHooks,
  failChangeset,
  persistChangeset
} from './changeset';
import {
  routePOJOResolved,
  routeModelResolved,
  routeArrayResolved,
  routeChangesetResolved
}  from './route-resolved';
import { INITIAL_STATE } from '../constants/initial-state';
import {
  DS_FIND_RECORD_REQUESTED,
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_QUERY_COLLECTION_REQUESTED,
  DS_QUERY_COLLECTION_SUCCEEDED,
  DS_QUERY_COLLECTION_FAILED,
  DS_ALL_COLLECTION_REQUESTED,
  DS_ALL_COLLECTION_SUCCEEDED,
  DS_ALL_COLLECTION_FAILED,
  DS_CHANGESET_PERSIST_FAILED,
  DS_CHANGESET_PERSIST_SUCCEEDED,
  DS_CHANGESET_MODIFIED,
  DS_CHANGESET_CREATED,
  DS_CHANGESET_CLEARED,
  DS_CHANGESET_AFTER_SUCCESS_HOOKED,
  DS_CHANGESET_AFTER_FAILURE_HOOKED,
  DS_CHANGESET_BEFORE_PERSIST_HOOKED,
  EMBER_ROUTE_ACTIVATED,
  EMBER_ROUTE_DEACTIVATED,
  EMBER_ROUTE_PARAMS_LOADED,
  EMBER_ROUTE_MODEL_RESOLVED,
  EMBER_ROUTE_ARRAY_RESOLVED,
  EMBER_ROUTE_POJO_RESOLVED,
  EMBER_ROUTE_CHANGESET_RESOLVED,
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
    case DS_CHANGESET_AFTER_SUCCESS_HOOKED:
    case DS_CHANGESET_AFTER_FAILURE_HOOKED:
    case DS_CHANGESET_BEFORE_PERSIST_HOOKED:
      return modifyChangesetHooks(state, action);
    case DS_CHANGESET_CREATED:
      return setupChangeset(state, action);
    case DS_CHANGESET_CLEARED:
      return destroyChangeset(state, action);
    case DS_CHANGESET_MODIFIED:
      return modifyChangeset(state, action);
    case DS_CHANGESET_PERSIST_FAILED:
      return failChangeset(state, action);
    case DS_CHANGESET_PERSIST_SUCCEEDED:
      return persistChangeset(state, action);
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
    case EMBER_ROUTE_POJO_RESOLVED:
      return routePOJOResolved(state, action);
    case EMBER_ROUTE_ARRAY_RESOLVED:
      return routeArrayResolved(state, action);
    case EMBER_ROUTE_MODEL_RESOLVED:
      return routeModelResolved(state, action);
    case EMBER_ROUTE_CHANGESET_RESOLVED:
      return routeChangesetResolved(state, action);
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
