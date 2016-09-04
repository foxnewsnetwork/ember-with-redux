/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import Ember from 'ember';
import { getList } from 'ember-with-redux/utils/ds-collections';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

function dogThatBites(dog) {
  return dog.get('data', {}).bites;
}

describe('Acceptance: QueryFilter', function() {
  let application, container, redux, store;

  before(function(done) {
    application = startApp();
    visit('/');
    server.createList('dog', 10, { bites: false });
    server.createList('dog', 10);
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      store = container.lookup('service:store');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  describe('successfully querying for dogs that bite', function() {
    let models, dsState;
    const meta = { modelName: 'dog', filter: dogThatBites };
    before(function(done) {
      Ember.run(() => {
        store.query(meta.modelName, { bites: true }, meta.filter).finally(() => {
          dsState = redux.getState().ds;
          models = getList(dsState, meta);
          done();
        });
      });
    });

    it('should return sane data', function() {
      expect(models).to.respondTo('count');
      expect(models.count()).to.equal(10);
    });
    it('should return 10 dogs that bites', function() {
      models.map((model) => {
        const meta = model.get('meta');
        const data = model.get('data');
        expect(meta).to.have.property('modelName', 'dog');
        expect(meta).to.have.property('id');
        expect(data).to.have.property('name');
        expect(data).to.have.property('bites', true);
      });
    });
  });
});
