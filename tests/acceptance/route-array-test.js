/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import { expect } from 'chai';
import { getRouteModel } from 'ember-with-redux/utils/route';
import { getMember } from 'ember-with-redux/utils/ds-storage';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: RouteArray', function() {
  let application, container, redux, store, dsState, routeModel;

  before(function(done) {
    application = startApp();
    server.createList('dog', 10);
    visit('dogs');
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      store = container.lookup('service:store');
      dsState = redux.getState().ds;
      routeModel = getRouteModel(dsState, 'dogs');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  it('lands me on the dogs page', function() {
    expect(currentPath()).to.equal('dogs');
  });

  it('should have a sensible routeModel', function() {
    expect(routeModel).to.be.ok;
    expect(routeModel).to.respondTo('get');
  });

  it('should have the proper meta', function() {
    const meta = routeModel.get('meta');
    expect(meta).to.have.property('modelName', 'dog');
    expect(meta).to.have.property('routeName', 'dogs');
  });

  it('should have the proper list data', function() {
    const list = routeModel.get('list');
    expect(list).to.respondTo('count');
    expect(list.count()).to.equal(10);
  });

  it('should have a list with proper data', function() {
    routeModel.get('list').map((meta) => {
      expect(meta).to.have.property('modelName', 'dog');
      return getMember(dsState, meta);
    }).map((dog) => {
      const meta = dog.get('meta');
      const data = dog.get('data');

      expect(meta).to.have.property('modelName', 'dog');
      expect(data).to.have.property('name');
    });
  });
});
