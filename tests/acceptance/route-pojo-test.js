/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import { expect } from 'chai';
import { getRouteModel } from 'ember-with-redux/utils/route';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: RoutePojo', function() {
  let application, container, redux, store, dsState, routeModel;

  before(function(done) {
    application = startApp();
    visit('pojo');
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      store = container.lookup('service:store');
      dsState = redux.getState().ds;
      routeModel = getRouteModel(dsState, 'pojo');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  it('should have the correct pojo model', function() {
    const pojo = routeModel.get('pojo');
    expect(pojo).to.be.a('string');
    expect(pojo).to.equal('7 apples on a witch\'s tree');
  });
  it('should also have a sensible meta', function() {
    const meta = routeModel.get('meta');
    expect(meta).to.have.property('routeName', currentPath());
  });
});
