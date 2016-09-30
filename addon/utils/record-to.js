import Ember from 'ember';
import DS from 'ember-data';

const { typeOf, guid, getWithDefault } = Ember;

function isDSModel(model) {
  return typeOf(model) === 'instance' && model instanceof DS.Model;
}

const Getters = {
  attribute(dsModel, field) {
     return dsModel.get(field);
  },
  hasMany(dsModel, field) {
    return dsModel.hasMany(field);
  },
  belongsTo(dsModel, field) {
    return dsModel.belongsTo(field);
  },
  explodeAndDie(dsModel, field, kind) {
    Ember.Logger.warn('[ember-with-redux] bad field in model', dsModel);
    throw new Error(`While trying to access field: '${field}', I expected a sensible field-kind like 'attribute', 'hasMany', or 'belongsTo', but instead you gave me '${kind}' which I don't know how to handle.`);
  }
};

function dsModelToPOJO(dsModel) {
  const fields = Ember.get(dsModel.constructor, 'fields');
  let output = { id: dsModel.get('id') };

  fields.forEach((kind, field) => {
    output[field] = getWithDefault(Getters, kind, Getters.explodeAndDie)(dsModel, field, kind);
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
