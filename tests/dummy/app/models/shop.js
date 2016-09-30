import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  guns: DS.hasMany('gun')
});
