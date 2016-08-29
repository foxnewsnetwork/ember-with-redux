import Ember from 'ember';

export default function metaToKey(meta) {
  Ember.assert('You must pass in an object with at least a property called modelName', Ember.isPresent(meta));
  const { modelName, id } = meta;
  if (Ember.isPresent(id)) {
    return `${modelName}#${id}`;
  } else {
    return `${modelName}:new`;
  }
}
