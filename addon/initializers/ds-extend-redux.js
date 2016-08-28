import DS from 'ember-data';
import Ember from 'ember';
import StoreExtensions from '../extensions/store';
import RouteExtensions from '../extensions/route';

export function initialize(/* application */) {
  DS.Store.reopen(StoreExtensions);
  Ember.Route.reopen(RouteExtensions);
}

export default {
  name: 'ds-extend-redux',
  initialize
};
