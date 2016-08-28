import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  bites: DS.attr('boolean')
});
