import DS from 'ember-data';
import Ember from 'ember';
import StoreExtensions from '../extensions/store';
import RouteExtensions from '../extensions/route';
import ControllerExtensions from '../extensions/controller';

export function initialize(/* application */) {
  DS.Store.reopen(StoreExtensions);
  Ember.Route.reopen(RouteExtensions);
  Ember.Controller.reopen(ControllerExtensions);
}

export default {
  name: 'ds-extend-redux',
  initialize
};
