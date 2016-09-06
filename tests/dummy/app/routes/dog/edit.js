import Ember from 'ember';

export default Ember.Route.extend({
  model(...args) {
    return this.store.checkoutChangeset(this._super(...args));
  }
});
