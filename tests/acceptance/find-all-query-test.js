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

describe('Acceptance: FindAllQuery', function() {
  let application, container, redux, store;

  before(function(done) {
    application = startApp();
    visit('/');
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

  describe('Successfully finding all', function() {
    let dsState, models;
    before(function(done) {
      Ember.run(() => {
        store.findAll('dog').finally(() => {
          dsState = redux.getState().ds;
          models = getList(dsState, { modelName: 'dog' });
          done();
        });
      });
    });
    it('should have fetched the models', function() {
      expect(models).to.be.ok;
      expect(models).to.respondTo('push');
      expect(models).to.respondTo('pop');
    });
    it('should be the right length', function() {
      expect(models.count()).to.equal(10);
    });
    it('should contain the correct stuff', function() {
      models.map((model) => {
        const meta = model.get('meta');
        const data = model.get('data');
        expect(meta).to.have.property('modelName', 'dog');
        expect(meta).to.have.property('id');
        expect(data).to.have.property('name');
        expect(data).to.have.property('id', meta.id);
      });
    });
  });
});
