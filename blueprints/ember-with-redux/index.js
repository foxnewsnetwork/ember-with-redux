/*jshint node:true*/
module.exports = {
  description: 'Installs dependencies for ember-with-redux',

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux', target: '^1.5.3'},
        {name: 'ember-immutable', target: '^0.1.1'}
      ]
    });
  }
};
