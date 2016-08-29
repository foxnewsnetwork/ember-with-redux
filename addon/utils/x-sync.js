export function xSync({successType, failureType, requestType}) {
  return (dispatch, meta, promise) => {
    dispatch({ type: requestType, meta });
    return promise.then((record) => {
      dispatch({ type: successType, record, meta });
      return record;
    }).catch((error) => {
      dispatch({ type: failureType, error, meta });
      throw error;
    });
  };
}
