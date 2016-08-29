/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import metaToKey from 'ember-with-redux/utils/meta-to-key';
import Ember from 'ember';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

// 🌎 <- hey, it's a globe
describe('Acceptance: CreateRecord', function() {
  let application, container, store, redux;

  before(function(done) {
    application = startApp();
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

  describe('it should be able to persist a dog', function() {
    let model, originalMeta, dsStorage;
    before(function(done) {
      Ember.run(() => {
        const { meta, data } = store.setupRecord('dog', { name: 'rover' });
        originalMeta = meta;
        const persistThunk = store.persistRecord({meta, data});
        const fullThunk = (dispatch) => {
          return persistThunk(dispatch).then(() => {
            dsStorage = redux.getState().ds.get('dsStorage');
            model = dsStorage.get(metaToKey(originalMeta));
            done();
          });
        };
        redux.dispatch(fullThunk);
      });
    });
    it('should generated a sensible storage key', function() {
      const key = metaToKey(originalMeta);
      expect(key).to.match(/^dog:\d+\.\d+$/);
    });
    it('should persist a dog', function() {
      const { meta } = model;
      expect(originalMeta.ref).to.be.ok;
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('ref', originalMeta.ref);
    });
    it('should have a link', function() {
      expect(model).to.have.property('link');
      expect(model.link).to.match(/^dog#\d+$/);
    });
    it('should have a link to the proper dog', function() {
      const { data, meta } = dsStorage.get(model.link);
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id');
      expect(meta.id).to.be.ok;
      expect(data).to.have.property('name', 'rover');
    });
  });

});
