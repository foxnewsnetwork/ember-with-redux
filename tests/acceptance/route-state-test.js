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

describe('Acceptance: Redux should properly maintain router state', function() {
  let application, redux, container;

  before(function(done) {
    application = startApp();
    server.createList('tree', 10);
    visit('/');
    andThen(() => {
      container = application.__container__;
      redux = container.lookup('service:redux');
      done();
    });
  });

  after(function() {
    destroyApp(application);
  });

  it('should be sane', function() {
    const { ds: state } = redux.getState();
    expect(redux).to.be.ok;
    expect(container).to.be.ok;
    expect(state).to.be.ok;
  });
  it('can visit /', function() {
    expect(currentURL()).to.equal('/');
  });
  it('tracked the routes', function(){
    const activeRoutes = redux.getState().ds.get('activeRoutes');
    expect(activeRoutes).to.be.ok;
    expect(activeRoutes.toArray).to.be.a('function');
    const routes = activeRoutes.toArray();
    expect(routes).to.have.lengthOf(2);
    expect(routes).to.deep.equal(['application', 'index']);
  });

  describe('visit orchard', function() {
    before(function(done) {
      visit('/orchard');
      andThen(() => done());
    });

    it('should be on orchard', function() {
      expect(currentPath()).to.equal('orchard.index');
    });

    it('should have the proper states', function() {
      const { ds: state } = redux.getState();
      expect(state).to.be.ok;
      const routes = state.get('activeRoutes').toArray();
      expect(routes).to.deep.equal(['application', 'orchard', 'orchard.index']);
    });

    describe('visiting a tree in an orchard', function() {
      let activeRoutes;
      before(function(done) {
        visit('/orchard/tree/1');
        andThen(() => {
          activeRoutes = redux.getState().ds.get('activeRoutes');
          done();
        });
      });
      it('should match the routes', function() {
        expect(activeRoutes.toArray()).to.deep.equal(['application', 'orchard', 'orchard.tree', 'orchard.tree.index']);
      });

      describe('visiting an apple in a tree in an orchard', function() {
        let activeRoutes;
        before(function(done) {
          visit('/orchard/tree/1/apple');
          andThen(() => {
            activeRoutes = redux.getState().ds.get('activeRoutes');
            done();
          });
        });

        it('should match routes', function() {
          expect(activeRoutes.toArray()).to.deep.equal(['application', 'orchard', 'orchard.tree', 'orchard.tree.apple']);
        });

        describe('switching over to a chicken coop', function() {
          let activeRoutes;
          before(function(done) {
            visit('/ranch/coop/chicken');
            andThen(function() {
              activeRoutes = redux.getState().ds.get('activeRoutes');
              done();
            });
          });
          it('should have properly switched over all the routes', function() {
            expect(activeRoutes.toArray()).to.deep.equal(['application', 'ranch', 'ranch.coop', 'ranch.coop.chicken']);
          });
        });
      });
    });
  });
});
