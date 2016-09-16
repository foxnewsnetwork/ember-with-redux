import Ember from 'ember';
import DS from 'ember-data';

const { typeOf, guid } = Ember;

function isDSModel(model) {
  return typeOf(model) === 'instance' && model instanceof DS.Model;
}

function dsModelToPOJO(dsModel) {
  const fields = Ember.get(dsModel.constructor, 'fields');
  let output = { id: dsModel.get('id') };

  fields.forEach((kind, field) => {
    output[field] = dsModel.get(field);
  });

  return output;
}

// TODO: implement me (presumably, we want to grab just the computed properties)
// and ownProperties off of this object
function emberObjectToPOJO(model) {
  return model;
}

export function recordToPOJO(model) {
  if (isDSModel(model)) {
    return dsModelToPOJO(model);
  }
  if (typeOf(model) === 'instance') {
    return emberObjectToPOJO(model);
  }
  return model;
}

function dsModelToMeta(dsModel, meta) {
  return Object.assign({}, meta, {
    modelName: dsModel.constructor.modelName,
    id: dsModel.get('id')
  });
}

function emberObjectToMeta(object, meta) {
  return Object.assign({}, meta, {
    modelName: 'instance',
    guid: guid(object)
  });
}

export function recordToMeta(model, meta={}) {
  if (isDSModel(model)) {
    return dsModelToMeta(model, meta);
  }
  if (typeOf(model) === 'instance') {
    return emberObjectToMeta(model, meta);
  }
  return { isNative: true, modelName: typeOf(model), guid: guid(model) };
}
