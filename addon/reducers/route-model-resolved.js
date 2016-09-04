import Ember from 'ember';
import { recordToPOJO, recordToMeta } from '../utils/record-to';
import { recordsToMeta } from '../utils/records-to';

const { isArray } = Ember;

export default function routeModelResolved(state, action) {
  const { routeName, type, model, meta } = action;

  return state.update('routesModels', (routes) => {
    if (isArray(model)) {
      const records = model;
      return routes.set(routeName, {
        meta: recordsToMeta(records, meta),
        data: records.map(recordToMeta),
        status: type
      });
    } else {
      const record = model;
      return routes.set(routeName, {
        meta: recordToMeta(record),
        data: recordToPOJO(record),
        status: type
      });
    }
  });
}
