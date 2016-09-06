/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  dsMut
} from 'ember-with-redux/helpers/ds-mut';

describe('DsMutHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = dsMut(42);
    expect(result).to.be.ok;
  });
});
