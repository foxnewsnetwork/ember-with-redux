import {
  DS_CHANGESET_AFTER_SUCCESS_HOOKED,
  DS_CHANGESET_AFTER_FAILURE_HOOKED,
  DS_CHANGESET_BEFORE_PERSIST_HOOKED
} from '../constants/actions';
export function afterSuccess(changeset, f) {
  const hooks = { afterSuccess: f }
  return { type: DS_CHANGESET_AFTER_SUCCESS_HOOKED, changeset, hooks };
}

export function afterFailure(changeset, f) {
  const hooks = { afterFailure: f }
  return { type: DS_CHANGESET_AFTER_FAILURE_HOOKED, changeset, hooks };
}

export function beforePersist(changeset, f) {
  const hooks = { beforePersist: f }
  return { type: DS_CHANGESET_BEFORE_PERSIST_HOOKED, changeset, hooks };
}
