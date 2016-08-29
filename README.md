# Ember-with-redux

## Ember State
At any given time, the state exposed by this addon looks like:
```javascript
{
  dsStorage: {
    'dog#1': { meta, data, status }, // server-persisted dog model with id 1
    'dog#2': { meta, data, status }, // server-persisted dog model with id 2
    'dog:12312332.2': { meta, link, status}, // locally created dog model with a link
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

`link` is a string that looks like `dog#1` which literally refers to another key in the dsStorage
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
