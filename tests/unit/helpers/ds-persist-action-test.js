/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import dsPersistAction from 'ember-with-redux/helpers/ds-persist-action';

describe('DsPersistActionHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = dsPersistAction.create();
    expect(result).to.be.ok;
  });
});
