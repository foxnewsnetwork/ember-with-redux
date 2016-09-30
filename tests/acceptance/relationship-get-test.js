/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import { expect } from 'chai';
import { getList } from 'ember-with-redux/utils/ds-collections';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: RelationshipGet', function() {
  let application, container, store, redux;

  before(function(done) {
    application = startApp();
    server.create('shop', 'hasGuns');
    server.create('shop');
    visit('/');
    andThen(() => {
      container = application.__container__;
      store = container.lookup('service:store');
      redux = container.lookup('service:redux');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  describe('finding shops', function() {
    let shops, dsState;
    before(function(done) {
      store.findAll('shop').then(() => {
        dsState = redux.getState().ds;
        shops = getList(dsState, { modelName: 'shop' });
        done();
      });
    });

    it('should be a list', function() {
      expect(shops).to.be.ok;
      expect(shops).to.respondTo('push');
      expect(shops).to.respondTo('pop');
    });

    it('should have the correct count', function() {
      expect(shops.count()).to.equal(2);
    });

    describe('shop with guns', function() {
      let shop;
      before(function() {
        shop = shops.first();
      });
      it('should have be the correct model', function() {
        const meta = shop.get('meta');
        expect(meta).to.have.property('modelName', 'shop');
        expect(meta).to.have.property('id');
      });
      describe('relational data', function() {
        let data;
        before(function() {
          data = shop.get('data');
        });
        it('should have sensible regular data', function() {
          expect(data).to.have.property('name');
        });
        it('should have a relational reference', function() {
          expect(data).to.have.property('guns');
        });
      });
    });
  });
});
