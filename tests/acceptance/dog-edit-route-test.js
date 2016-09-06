/* jshint expr:true */
import {
  describe,
  it,
  before,
  after
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: DogEditRoute', function() {
  let application, container, controller;

  before(function(done) {
    application = startApp();
    server.createList('dog', 1);
    visit('dog/1/edit');
    andThen(() => {
      container = application.__container__;
      controller = container.lookup('controller:dog/edit');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  it('should be ok', function() {
    expect(controller).to.be.ok;
  });

  it('should have a sensible routeModel', function() {
    const routeModel = controller.get('routeModel');
    expect(routeModel).to.be.ok;
  });

  it('should put us on the correct route', function() {
    expect(currentPath()).to.equal('dog.edit');
  });

  it('should have the proper data upfront', function() {
    const pageTitle = find('.page-title').text();
    expect(pageTitle).to.match(/^dog \- \w+$/);
  });
});
