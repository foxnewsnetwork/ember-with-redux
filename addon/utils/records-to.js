// Read about DS RecordArrays here:
// http://emberjs.com/api/data/classes/DS.RecordArray.html
export function recordsToMeta(dsRecords, meta={}) {
  const { type: { modelName }, meta: dsMeta } = dsRecords;

  return Object.assign({}, meta, { modelName, dsMeta });
}

export function recordsToArray(dsRecords) {
  return dsRecords.map((x) => x);
}
