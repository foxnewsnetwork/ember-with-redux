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
import { getMember } from 'ember-with-redux/utils/ds-storage';
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

  describe('interim', function() {
    let member, promise;
    const meta = { modelName: 'dog', id: '2' };
    before(function() {
      Ember.run(() => {
        promise = store.findRecord(meta.modelName, meta.id);
        member = getMember(redux.getState().ds, meta);
      });
    });

    after(function(done) {
      promise.finally(done);
    });

    it('should be ok', function() {
      expect(member).to.be.ok;
      expect(member).to.respondTo('get');
      expect(member.count()).to.be.greaterThan(1);
    });
    it('should match meta', function() {
      expect(member.get('meta')).to.deep.equal(meta);
    });
    it('should have the proper status', function() {
      expect(member.get('status')).to.equal(DS_FIND_RECORD_REQUESTED);
    });
  });

  describe('successfully finding stuff', function() {
    let dsRecord, member, dsState;
    before(function(done) {
      Ember.run(() => {
        store.findRecord('dog', '1').then(function(record) {
          dsRecord = record;
          dsState = redux.getState().ds;
          member = getMember(dsState, { modelName: 'dog', id: '1' });
          done();
        });
      });
    });

    it('should have the right status', function() {
      const status = member.get('status');
      expect(status).to.equal(DS_FIND_RECORD_SUCCEEDED);
    });
    it('storage should contain the right meta and data', function() {
      const meta = member.get('meta');
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id', '1');
    });
    it('should have the right data', function() {
      const data = member.get('data');
      expect(data).to.have.property('name', dsRecord.get('name'));
    });
  });

  describe('404-ing the find', function() {
    let dsError, dsMember;
    const meta = { modelName: 'dog', id: '666' };
    before(function(done) {
      Ember.run(() => {
        store.findRecord(meta.modelName, meta.id).catch(function(error) {
          dsError = error;
          dsMember = getMember(redux.getState().ds, meta);
          done();
        });
      });
    });
    it('should have a proper error', function() {
      expect(dsError).to.be.ok;
      expect(dsError.message).to.match(/404/);
    });
    it('should have the error status', function() {
      const status = dsMember.get('status');
      expect(status).to.equal(DS_FIND_RECORD_FAILED);
    });
    it('should have the proper error', function() {
      const error = dsMember.get('error');
      expect(error).to.equal(dsError);
    });
    it('should have the proper meta', function() {
      expect(dsMember.get('meta')).to.deep.equal(meta);
    });
  });
});
