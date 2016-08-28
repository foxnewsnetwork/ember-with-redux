import dsReducerGenerator from 'ember-with-redux/reducers/ds-reducer-generator';
import initialState from '../constants/initial-state';

const noOp = {};

export default {
  ds: dsReducerGenerator(initialState, noOp)
};
