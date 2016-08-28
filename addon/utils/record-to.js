import Ember from 'ember';

export function recordToPOJO(dsModel) {
  // fields is an Ember.Map
  const fields = Ember.get(dsModel.constructor, 'fields');
  let output = { id: dsModel.get('id') };

  fields.forEach((kind, field) => {
    output[field] = dsModel.get(field);
  });

  return output;
}

export function recordToMeta(dsModel, meta={}) {
  return Ember.assign({}, meta, {
    modelName: dsModel.constructor.modelName,
    id: dsModel.get('id')
  });
}
