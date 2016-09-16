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

describe('Acceptance: ChangesetHooks', function() {
  let application, container, redux, store, changeset, cs;

  before(function(done) {
    application = startApp();
    visit('/');
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      store = container.lookup('service:store');
      cs = container.lookup('service:ds-changeset');
      changeset = store.checkoutChangeset({ modelName: 'dog', changes: { name: 'rover' }});
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  it('allow the user to setup after run chains', function(done) {
    const nextChangeset = cs.afterSuccess(changeset, (dispatch, record) => {
      expect(record.constructor).to.have.property('modelName', 'dog');
      expect(record).to.have.property('id');
      done();
    });
    Ember.run(() => store.persistChangeset(nextChangeset));
  });

  it('multiple hooks should work together', function(done) {
    let count = 0;
    const changeset1 = cs.beforePersist(changeset, (dispatch, x) => {
      expect(x.get('meta')).to.deep.equal(changeset.get('meta'));
      expect(x.get('changes')).to.deep.equal(changeset.get('changes'));
      count++;
      return x;
    });
    const changeset2 = cs.afterSuccess(changeset1, (dispatch, record) => {
      count++;
      return record;
    });
    const changeset3 = cs.afterSuccess(changeset2, () => {
      count++;
      expect(count).to.equal(3);
      done();
    });
    Ember.run(() => store.persistChangeset(changeset3));
  });
});
