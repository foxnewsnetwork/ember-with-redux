import DS from 'ember-data';

export default DS.Model.extend({
  brand: DS.attr('string'),
  price: DS.attr('number'),
  shop: DS.belongsTo('shop')
});
