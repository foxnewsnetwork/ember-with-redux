# Ember-with-redux

A set of extensions to `DS.Store` and `Ember.Route` so that Ember + Ember Data are properly aware of redux and interface with them correctly

## Usage Example 1 - Routes that find single records
Consider a route declared like so:
```javascript
this.route('admin', { path: 'admin'}, function() {
  this.route('game', { path: 'game/:game_id'});
})
```
With model + adapter files (written completely in accordance with ember-data) that look something like:
```javascript
DS.Model.extend({
  gameName: DS.attr('string'),
  ...
});

MyBackendAdapter.extend({
  findRecord() {
    ...
  }
})
```
You can now directly use the `store` from ember-data in your route like so: (this is actually ember's default route implementation if you don't declare one)
```javascript
Ember.Route.extend({
  model({game_id}) {
    return this.store.findRecord('game', game_id);
  }
});
```
You can access the `game` POJO in redux in the `game-route-container` component like so:
```javascript
import { getRouteModel } from 'ember-with-redux/utils/route';
function computedState(state) {
  const game = getRouteModel(state.ds, 'admin.game');
  // game is an Immutable.Map
  const meta = game.get('meta');
  const data = game.get('data');
  return {
    modelName: meta.modelName,
    gameName: data.gameName
  };
}
connect(computedState, ...)
```

## Usage Example 2 - Routes that find an array of records
Next, let's consider an index route:
```javascript
this.route('farm', { path: 'farm' }, function() {
  this.route('pigs');
});
```
With similarly declared model + adapter like so (adapter omitted):
```javascript
const Pig = DS.Model.extend({
  nickname: DS.attr('string'),
  weight: DS.attr('number'),
  purchasedAt: DS.attr('moment')
})
```
You can continue using the `ds.store` as the ember-approved endpoint to access I/O:
```javascript
Ember.Route.extend({
  model() {
    return this.store.findAll('pig');
  }
})
```
You can access the `pigs` POJO via redux in the `pigs-route-container` component like so:
```javascript
import getRouteModel from 'ember-with-redux/utils/route';
function computedState(state) {
  const routesModels = state.ds.get('routesModels');
  const dsStorage = state.ds.get('dsStorage');
  const { meta, data } = routesModels.get('farm.pigs');
  return {
    modelName: meta.modelName,
    pigs: pigKeys.map((key) => dsStorage.get(key) )
  }
}
connect(computedState, ...)
```

## Usage Example 3 - Persisting records
Now, let's consider how we handle persisting a record to I/O (via redux-thunk):
We handle this by introducing 2 new methods to `ds.store`, namely: `setupRecord`
and `persistRecord` like so:

Say perhaps you have a `new-pig-route-container` component:
```javascript
function dispatchActions(dispatch) {
  return {
    // pigAttrs = { nickname: 'napster', weight: 899, ... }
    savePig(pigAttrs) {
      const { meta, data } = this.store.setupRecord('pig', pigAttrs);
      const thunk = this.store.persistRecord({meta, data});
      redux.dispatch(thunk);
    }
  };
}
connect(..., dispatchActions)(Component.extend())
```
See the `tests/acceptance/create-record-test:33` for an example of how to attach `.then` actions to I/O actions.

## Usage Example 4 - Querying for Records
Logically, we next tackle how to query the `ds.store` for records. As per Ember Convention,
we use the `store.query` function (with 1 optional change):
```javascript
function fatPigs(pig) {
  return pig.getWithDefault('weight', 0) > 240;
}
function model() {
  const searchParams = { weight: '>240lbs' };
  return this.store.query('pig', searchParams, fatPigs);
}
connect({model})
```
In accordance with the ds adapter notes found here: http://emberjs.com/api/data/classes/DS.Store.html#method_query,

`searchParams` is a POJO hash that will be consumed by the adapter and then possibly fed further upstream your favorite backend service for server-side querying.

We deviate from the standard implementation of `store.query` by allowing the user to pass in a filter function, `fatPigs` in this case, which is run against all the results we get returned from the server.

Why do we essentially double-check the server with a filter function? This is so that if we happen to get more pigs from another server response, we have a tool to decide if we wish to include these additional pigs into this current query. For example:

## Ember State
At any given time, the state exposed by this addon looks like: (bear in mind {} is actually an Immutable.Map)
```javascript
{
  dsCollections: {
    'dogs': { meta, status } // data is an array in this case
  },
  dsStorage: {
    'dog': {
      '1': { meta, data, status }, // server-persisted dog model with id 1
      'rover': { meta, data, status }, // server-persisted dog model with id 2
    }
  },
  dsNewStorage: {
    'dog': {
      '12312332.2': { meta, status }, // locally created dog model with a link
    }
  },
  routesParams: {
    'application': {},
    'index': {},
    'dog': { dog_id: 1 },
    'dog.index': {}
  },
  routesModels: {
    'dog': { meta, data }
  },
  activeRoutes: ['application', 'dog', 'dog.index']
}
```
`meta` is a hash that looks like:
```javascript
meta = {
  modelName: 'dog',
  id: 1,
  ref: 12134134134.33 // locally assigned unique id assigned to things without a real id
}
```
`data` is a POJO that looks exactly like how you declared your dog model, e.g.:
```javascript
const Dog = DS.Model.extend({
  name: DS.attr('string'),
  bitesMailman: DS.attr('boolean'),
  lastSeenAt: DS.attr('moment')
});

data = {
  name: 'Rover Mcfluffster',
  bitesMailman: true,
  lastSeenAt: [Object moment]
};
```

`status` is the last action that updated the entire hash

## Installation

* `git clone <repository-url>` this repository
* `cd ember-with-redux`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
