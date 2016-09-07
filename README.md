# Ember-with-redux

A set of extensions to `DS.Store` and `Ember.Route` so that Ember + Ember Data are properly aware of redux and interface with them correctly

## Overview
The goal of this addon is to bridge the gap between ember+ember-data and [ember-redux](http://www.ember-redux.com/) as to allow for ember users to keep much of what they love about ember (and data) and get all the functional benefits of also using redux to manage state.

## Motivation
The TL;DR of it is as ember devs, we want to keep all the good I/O related stuff ember-data offers us but at the same time, we want to move towards a centralized state management system like redux to keep our apps sensible...

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

## Usage Example 1.5 - Using the ember-controller
If you've ever programmed in react / redux, you're probably familiar with the concept of keeping the so-called container (aka delegate) components separate from the presentation (aka dumb) components. While in `ember-redux`, you're expected to write a `my-route-container` component for every route you have, in this addon, we recognize that Ember's route+controller architecture actually serves as your top-most level container component. As such, continuing from our example above, `controllers/admin/game.js` automatically is registered with redux and allows you to access the `routeModel` states in the `templates/admin/game.hbs` file:

```handlebars
<h1 class='page-title'>{{meta.modelName}} - {{meta.id}}</h1>
<ul class='object-details'>
  <li>{{data.gameName}}</li>
</ul>
```

note that `routeModel` is an `Immutable.Map` structure and the fields `meta`, `data`, etc. are `readOnly` aliased fields off of `routeModel`. Take a look at `addon/extensions/controller.js` to see the rest of the aliased fields (also reproduced here):
```javascript
data: readOnly('routeModel', 'data'), // available in findRecord routes
meta: readOnly('routeModel', 'meta'), // available everywhere
pojo: readOnly('routeModel', 'pojo'), // available in routes whose model hook resolves a pojo or a js native
list: readOnly('routeModel', 'list'), // available in findAll or query routes
error: readOnly('routeModel', 'error'), // available when any route errors out
status: readOnly('routeModel', 'status'), // available everywhere
changes: readOnly('changeset', 'changes'), // available in routes where checkoutChangeset is called
changeset: readOnly('routeModel', 'changeset'), // same as above
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
  const pigs = getRouteModel(state.ds, 'farm.pigs');
  const meta = pigs.get('meta');
  const list = pigs.get('list');
  return {
    modelName: meta.modelName,
    pigs: list
  }
}
connect(computedState, ...)
```

## Usage Example 3 - Persisting records
Now, let's consider how we handle persisting a record to I/O (via redux-thunk):
We handle this by introducing 2 new methods to `ds.store`, namely: `checkoutChangeset`
and `persistChangeset` like so:

Say perhaps you have a `new-pig-route-container` component:
```javascript
function computedState(state) {
  const pigAttrs = getDefaultPigAttrs(state);
  return {
    changeset: this.store.checkoutChangeset({modelName: 'pig', changes: pigAttrs});
  }
}
function dispatchActions(dispatch) {
  return {
    // pigAttrs = { nickname: 'napster', weight: 899, ... }
    savePig(changeset) {
      const thunk = this.store.persistRecord(changeset);
      redux.dispatch(thunk);
    }
  };
}
connect(computedState, dispatchActions)(Component.extend())
```
See the `tests/acceptance/create-record-test:33` for an example of how to attach `.then` actions to I/O actions.

Alternatively, to keep the developer from writing too much js boilerplate, we introduce 2 helpers `ds-mut-action` and `ds-persist-action` to allow users to make changes to changesets based upon user input and persist thunks on user submission:

```handlebars
<from {{action (ds-persist-action changeset) on='submit'}}>
  {{one-way-input changes.fooField update=(ds-mut-action changeset 'fooField') }}
  {{one-way-input changes.barField update=(ds-mut-action changeset 'barField') }}
  {{one-way-input changes.bazField update=(ds-mut-action changeset 'bazField') }}
  <button type='submit'>submit</button>
</form>
```
`{{one-way-input}}` is from the [ember-one-way-controls](https://github.com/DockYard/ember-one-way-controls) addon which is necessary to resolve a rather silly bug with DDAU input with handlebars

### Side Notes - What are changesets?
The concept originally came from [Elixir's Ecto](https://github.com/elixir-ecto/ecto) (if we stretch our imaginations, we can probably also claim it came from the whole branches concept in git), but the TL;DR of it as follows:

it's a blob of data 'checked out' from some model that represents changes to be made against that model. An user modifies the changeset as appropriate, then persists those changes upstream and thus updating the actual model.

We want to do this because, this way, we get rid of the idea of "dirty records", and instead create a framework where changes are atomic despite the complexities of async I/O. Also, we retain DDAU this way.

#### TODO
consider optionally integrating with https://github.com/DockYard/ember-changeset or at least supporting the option of using their changeset library

## Usage Example 4 - Querying for Records
Logically, we next tackle how to query the `ds.store` for records. As per Ember Convention,
we use the `store.query` function (with 1 optional change):
```javascript
function fatPigsTransform(pigs) {
  return pigs.filter( (pig) => pig.getWithDefault('weight', 0) > 240 );
}
function model() {
  const searchParams = { weight: '>240lbs' };
  return this.store.query('pig', searchParams, fatPigsTransform);
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
  dsChangesets: {
    'dog': {
      '12312332.2': { meta, changes, status }, // locally created dog model with a link
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
