import { Model, faker } from 'ember-cli-mirage';

export default Model.extend({
  name() {
    return faker.name.firstName();
  },
  bites: true
});
