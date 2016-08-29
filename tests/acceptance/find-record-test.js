/* jshint expr:true */
import Ember from 'ember';
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import {
  DS_FIND_RECORD_SUCCEEDED,
  DS_FIND_RECORD_FAILED,
  DS_FIND_RECORD_REQUESTED
} from 'ember-with-redux/constants/actions';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: FindRecord', function() {
  let application, redux, store, container;

  before(function(done) {
    application = startApp();
    server.createList('dog', 10);
    visit('/');
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

  it('should have a pending in the interim that the find takes place', function(done) {
    Ember.run(() => {
      store.findRecord('dog', 2).finally(done);
      const storage = redux.getState().ds.get('dsStorage');
      const { meta, status } = storage.get('dog#2');
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id', 2);
      expect(status).to.equal(DS_FIND_RECORD_REQUESTED);
    });
  });

  describe('successfully finding stuff', function() {
    let dsRecord, dsStorage;
    before(function(done) {
      Ember.run(() => {
        store.findRecord('dog', 1).then(function(record) {
          dsRecord = record;
          dsStorage = redux.getState().ds.get('dsStorage');
          done();
        });
      });
    });

    it('storage should contain the right meta and data', function() {
      const { meta, data, status } = dsStorage.get('dog#1');
      expect(status).to.equal(DS_FIND_RECORD_SUCCEEDED);
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id', '1');
      expect(data).to.have.property('name', dsRecord.get('name'));
    });
  });

  describe('404-ing the find', function() {
    let dsError, dsStorage;
    before(function(done) {
      Ember.run(() => {
        store.findRecord('dog', 666).catch(function(error) {
          dsError = error;
          dsStorage = redux.getState().ds.get('dsStorage');
          done();
        });
      });
    });
    it('should have a proper error', function() {
      expect(dsError).to.be.ok;
      expect(dsError.message).to.match(/404/);
    });
    it('should have an error in the storage', function() {
      const { meta, error, status } = dsStorage.get('dog#666');
      expect(error).to.equal(dsError);
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id', 666);
      expect(status).to.equal(DS_FIND_RECORD_FAILED);
    });
  });
});
