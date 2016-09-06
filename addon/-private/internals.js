import Ember from 'ember';
// Stolen shamelessly from dockyard
//  https://github.com/DockYard/ember-route-action-helper/blob/master/addon/-private/internals.js
let ClosureActionModule;

if ('ember-htmlbars/keywords/closure-action' in Ember.__loader.registry) {
  ClosureActionModule = Ember.__loader.require('ember-htmlbars/keywords/closure-action');
} else if ('ember-routing-htmlbars/keywords/closure-action' in Ember.__loader.registry) {
  ClosureActionModule = Ember.__loader.require('ember-routing-htmlbars/keywords/closure-action');
} else {
  ClosureActionModule = { };
}

export const ACTION = ClosureActionModule.ACTION;
