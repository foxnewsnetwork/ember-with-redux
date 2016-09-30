export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = 'http://localhost:4200';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = '/api';    // make this `api`, for example, if your API is namespaced
  this.timing = 10;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/
  */
  this.get('/trees/:id');
  this.get('/trees');

  this.get('/dogs/:id');
  this.get('/dogs');
  this.post('/dogs');
  this.patch('/dogs/:id', function(db, request) {
    const { dogs } = db;
    const id = request.params.id;
    const attrs = this.normalizedRequestAttrs();
    const dog = dogs.find(id);
    const updatedDog = dog.update('attrs', attrs);
    return updatedDog;
  });
  this.get('/shops');
  this.get('/guns');
}
