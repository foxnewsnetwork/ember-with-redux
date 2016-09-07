import Ember from 'ember';

export default Ember.Route.extend({
  model(...args) {
    const record = this._super(...args);
    return this.store.checkoutChangeset({record});
  }
});
