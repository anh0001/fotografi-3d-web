import { fromJS } from 'immutable';
import tryContainerReducer from '../reducer';

describe('tryContainerReducer', () => {
  it('returns the initial state', () => {
    expect(tryContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
