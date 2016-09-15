import Ember from 'ember';
import uniqRef from './uniq-ref';
import {
  DS_CHANGESET_CREATED
} from '../constants/actions';
import {
  recordToMeta,
  recordToPOJO
} from './record-to';
import { makeChangeset } from './ds-changesets';

export function checkoutChangeset(redux, dsRecord, defaultChanges, persist) {
  const ref = Ember.guidFor(dsRecord);
  const meta = recordToMeta(dsRecord, {ref});
  const changes = Ember.assign(recordToPOJO(dsRecord), defaultChanges);
  const hooks = { persist };
  const changeset = makeChangeset({meta, changes});

  redux.dispatch({ type: DS_CHANGESET_CREATED, changeset, hooks });
  return changeset;
}

export function checkoutNewChangeset(redux, modelName, changes, persist) {
  const ref = uniqRef();
  const meta = { modelName, ref };
  const hooks = { persist };
  const changeset = makeChangeset({meta, changes});

  redux.dispatch({ type: DS_CHANGESET_CREATED, changeset, hooks });
  return changeset;
}
