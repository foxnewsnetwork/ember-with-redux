import Ember from 'ember';

const { isPresent, assert } = Ember;

export default function metaToColKey(meta={}) {
  const { modelName, guid, filter, filterName } = meta;
  assert('Meta must contain a present modelName', isPresent(modelName));
  const collectionName = Ember.String.pluralize(modelName);

  switch (false) {
    case !isPresent(filterName):
      return `${collectionName}#${filterName}`;
    case !isPresent(guid):
      return `${collectionName}:${guid}`;
    case !isPresent(filter):
      return `${collectionName}:${Ember.guid(filter)}`;
    default:
      return collectionName;
  }
}
