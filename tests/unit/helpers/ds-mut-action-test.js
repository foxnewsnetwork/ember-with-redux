/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import dsMutAction from 'ember-with-redux/helpers/ds-mut-action';

describe('DsMutActionHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let helper = dsMutAction.create();
    expect(helper).to.respondTo('compute');
  });
});
