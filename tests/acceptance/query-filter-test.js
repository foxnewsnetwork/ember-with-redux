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

function dogThatBites(dog) {
  return dog.get('bites');
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
    let dsCollections, dsStorage;
    before(function(done) {
      Ember.run(() => {
        store.query('dog', { bites: true }, dogThatBites).finally(() => {
          dsCollections = redux.getState().ds.get('dsCollections');
          dsStorage = redux.getState().ds.get('dsStorage');
          done();
        });
      });
    });

    it('should return 10 dogs that bites', function() {
      const { data } = dsCollections.get('dogs#dogThatBites');
      expect(data).to.have.lengthOf(10);
      expect(data).to.be.a('array');
      data.map((dogKey) => {
        const { data: dog } = dsStorage.get(dogKey);
        expect(dogKey).to.match(/^dog#\d+$/);
        expect(dog).to.have.property('bites', true);
      });
    });
    it('should return the correct meta', function(){
      const { meta } = dsCollections.get('dogs#dogThatBites');
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('guid', Ember.guidFor(dogThatBites));
    });
  });
});
