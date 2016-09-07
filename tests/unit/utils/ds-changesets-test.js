/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it,
  before
} from 'mocha';
import {
  updateChangesets,
  setChangeset,
  mergeChanges
} from 'ember-with-redux/utils/ds-changesets';
import { INITIAL_STATE, NULL_MAP } from 'ember-with-redux/constants/initial-state';

describe('updateChangesets', function() {
  const initialChangeset = NULL_MAP.set('meta', {modelName: 'iphone', ref: '54'}).set('changes', { name: 'xxx', force: 'zane'});
  const changes = { name: 'yyy' };
  let laterState, changeset, meta, actualChanges;
  before(function() {
    laterState = updateChangesets(INITIAL_STATE, (changesets) => {
      return setChangeset(changesets, mergeChanges(initialChangeset, changes));
    });
    changeset = laterState.get('dsChangesets').get('iphone').get('54');
    meta = changeset.get('meta');
    actualChanges = changeset.get('changes');
  });

  it('should have changed the state meta', function() {
    expect(meta).to.have.property('modelName', 'iphone');
    expect(meta).to.have.property('ref', '54');
  });

  it('should have the proper changes', function() {
    expect(actualChanges).to.have.property('name', 'yyy');
    expect(actualChanges).to.have.property('force', 'zane');
  });
});
