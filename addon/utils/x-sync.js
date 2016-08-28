import { recordToMeta, recordToPOJO } from './record-to';

export function xSync({successType, failureType, requestType}) {
  return (dispatch, meta, promise) => {
    dispatch({ type: requestType, meta });
    return promise.then((record) => {
      dispatch({ type: successType, meta: recordToMeta(record), data: recordToPOJO(record) });
      return record;
    }).catch((error) => {
      dispatch({ type: failureType, error, meta });
      throw error;
    });
  };
}
