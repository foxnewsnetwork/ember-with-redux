import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  shop: belongsTo('shop')
});
