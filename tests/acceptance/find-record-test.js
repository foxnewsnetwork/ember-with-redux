/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | find record', function() {
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
    beforeEach(function(done) {
      visit('dog/1');
      andThen(() => done());
    });

    it('should land us on the dog index', function() {
      expect(currentPath()).to.equal('dog.index');
    });
  });
});
