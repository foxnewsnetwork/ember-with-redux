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
  let application, container, controller, routeModel, redux;

  before(function(done) {
    application = startApp();
    server.createList('dog', 1, { name: 'rivendale' });
    visit('dog/1/edit');
    andThen(() => {
      container = application.__container__;
      controller = container.lookup('controller:dog/edit');
      routeModel = controller.get('routeModel');
      redux = container.lookup('service:redux');
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
    expect(routeModel).to.be.ok;
    expect(routeModel).to.respondTo('get');
  });

  it('should have sensible changes in the routeModel', function() {
    const changes = routeModel.get('changeset').get('changes');
    expect(changes).to.be.a('object');
    expect(changes).to.have.property('name', 'rivendale');
    expect(changes).to.have.property('id', '1');
  });

  it('should have sensible meta values in the changeset routeModel', function() {
    const meta = routeModel.get('meta');
    expect(meta).to.be.a('object');
    expect(meta).to.have.property('routeName', 'dog.edit');
    expect(meta).to.have.property('modelName', 'dog');
    expect(meta).to.have.property('ref');
  });

  it('should put us on the correct route', function() {
    expect(currentPath()).to.equal('dog.edit');
  });

  it('should have the proper data upfront', function() {
    const pageTitle = find('.page-title').text();
    expect(pageTitle).to.match(/^dog \- \w+$/);
  });

  it('should properly change the data value', function() {
    const dataDogName = find('.dog-data-name').text();
    expect(dataDogName).to.equal('rivendale');
  });

  it('should have the proper field data', function() {
    const nameField = find('.dog-name-field').text();
    expect(nameField).to.equal('rivendale');
  });

  it('should have the proper value in the input field', function() {
    const nameInput = find('input[name=dogName]').val();
    expect(nameInput).to.equal('rivendale');
  });

  describe('changing values', function() {
    before(function() {
      fillIn('[name=dogName]', 'axelrod');
    });
    it('should have changed the dog name', function() {
      const nameField = find('.dog-name-field').text();
      expect(nameField).to.equal('axelrod');
    });
    it('should have changed the value in the input field as well', function() {
      const nameInput = find('input[name=dogName]').val();
      expect(nameInput).to.equal('axelrod');
    });
    it('should not change the data value', function() {
      const dataDogName = find('.dog-data-name').text();
      expect(dataDogName).to.equal('rivendale');
    });
    describe('persisting changes', function() {
      before(function(done) {
        click('[type=submit]');
        andThen(() => {
          done();
        });
      });
      it('should properly change the data value', function() {
        const dataDogName = find('.dog-data-name').text();
        expect(dataDogName).to.equal('axelrod');
      });
    });
  });
});
