import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  brand() {
    return faker.name.firstName();
  },
  price() {
    return Math.random();
  }
});
