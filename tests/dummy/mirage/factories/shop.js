import { Factory, trait, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },

  hasGuns: trait({
    afterCreate(shop, server) {
      server.createList('gun', 5, { shop });
    }
  })
});
