import Ember from 'ember';

const { isPresent } = Ember;

export default function metaToKey(meta={}) {
  const { modelName, id, ref, guid } = meta;

  switch (false) {
    case !isPresent(id):
      return `${modelName}#${id}`;
    case !isPresent(ref):
      return `${modelName}:${ref}`;
    case !isPresent(modelName):
      return `{Object ${modelName}: ${guid}}`;
    default:
      throw new Error('You must provide either a present ref or id in your meta');
  }
}
