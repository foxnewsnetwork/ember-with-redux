/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Immutable from 'immutable';
import { getData, setData } from 'ember-with-redux/utils/ds-storage';

describe('dsStorage | Utility Functions', function() {
  // Replace this with your real tests.
  it('gets and stores', function() {
    const dsStorage = Immutable.Map();
    const data = { id: 666 };
    const store = setData(dsStorage, 'dog', 666, data);
    const result = getData(store, 'dog', 666);
    expect(result).to.equal(data);
  });
});
