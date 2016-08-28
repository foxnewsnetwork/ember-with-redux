import Immutable from 'npm:immutable';
import makeInitialState from 'ember-with-redux/utils/make-initial-state';

export default makeInitialState({
  makeMap(seed) {
    return Immutable.Map(seed);
  },
  makeList(seed) {
    return Immutable.List(seed);
  }
});
