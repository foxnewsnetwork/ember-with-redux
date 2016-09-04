/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import {
  getRouteModel,
  getRouteParams,
} from 'ember-with-redux/utils/route';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | route model', function() {
  let application, redux, container;

  beforeEach(function(done) {
    application = startApp();
    server.createList('dog', 10);
    visit('/');
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      done();
    });
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('should be on the right page', function() {
    expect(currentURL()).to.equal('/');
  });

  describe('visiting a dog', function() {
    let dsState;
    beforeEach(function(done) {
      visit('dog/1');
      andThen(() => {
        dsState = redux.getState().ds;
        done();
      });
    });

    it('should have a proper dog_id', function() {
      const params = getRouteParams(dsState, 'dog');
      expect(params).to.have.property('dog_id');
    });

    it('should land us on the dog index', function() {
      expect(currentPath()).to.equal('dog.index');
    });

    it('should have the dog model data on the active route', function() {
      const { meta, data } = getRouteModel(dsState, currentPath());
      expect(meta).to.have.property('modelName', 'dog');
      expect(meta).to.have.property('id', '1');
      expect(data).to.have.property('id', '1');
      expect(data).to.have.property('name');
    });
  });
});
