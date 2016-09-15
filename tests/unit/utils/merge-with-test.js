/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import mergeWith from 'ember-with-redux/utils/merge-with';

function multiply(a, b) { return a * b; }
const prices = {
  wings: 1, sandwich: 2, steak: 3
};
const sales = {
  wings: 10, sandwich: 20, steak: 30
};
describe('mergeWith', function() {
  // Replace this with your real tests.
  it('takes 2 hashes and merges them with a custom function', function() {
    let profits = mergeWith(multiply, prices, sales);
    expect(profits).to.deep.equal({ wings: 10, sandwich: 40, steak: 90 });
  });

  it('handles non-collisons correctly', function() {
    let x = mergeWith(multiply, prices, {});
    expect(x).to.deep.equal({ wings: 1, sandwich: 2, steak: 3});
  });
});
