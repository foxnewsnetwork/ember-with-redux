/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it,
  before
} from 'mocha';
import {
  checkoutNewChangeset
} from 'ember-with-redux/utils/checkout-changeset';

const FauxRedux = {
  dispatch() {}
};

describe('checkoutNewChangeset', function() {
  let changeset;
  before(function() {
    changeset = checkoutNewChangeset(FauxRedux, 'dog', { name: 'rover' });
  });
  // Replace this with your real tests.
  it('works', function() {
    expect(changeset).to.be.ok;
    expect(changeset).to.respondTo('get');
  });
  it('should have a proper meta', function() {
    const meta = changeset.get('meta');
    expect(meta).to.have.property('modelName', 'dog');
    expect(meta).to.have.property('ref');
    expect(meta.ref).to.be.ok;
  });
  it('should have proper changes', function() {
    const changes = changeset.get('changes');
    expect(changes).to.have.property('name', 'rover');
  });
});
