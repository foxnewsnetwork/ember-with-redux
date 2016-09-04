/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import Ember from 'ember';
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
    before(function(done) {
      Ember.run(() => {
        store.findAll('dog').finally(done);
      });
    });
    it('should have all the dogs', function() {
      const dsAllCollections = redux.getState().ds.get('dsAllCollections');
      const {meta, data} = dsAllCollections.get('dogs#ALL');

      expect(data).to.be.a('array');
      expect(data).to.be.lengthOf(10);
      expect(meta).to.have.property('modelName', 'dog');
      data.map((key) => {
        expect(key).to.match(/^dog#\d+$/);
      });
    });
    it('should be able to find the actual dogs in dsStorage', function() {
      const dsAllCollections = redux.getState().ds.get('dsAllCollections');
      const dsStorage = redux.getState().ds.get('dsStorage');
      const {data} = dsAllCollections.get('dogs#ALL');
      const dogs = data.map((key) => dsStorage.get(key));
      expect(dogs).to.be.lengthOf(10);
      expect(dogs).to.be.a('array');
      dogs.map(({meta, data: dog}) => {
        expect(meta).to.have.property('modelName', 'dog');
        expect(dog).to.have.property('name');
        expect(dog).to.have.property('id');
        expect(dog.name).to.match(/^\w+$/);
      });
    });
  });
});
