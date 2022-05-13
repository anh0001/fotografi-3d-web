import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the tryContainer state domain
 */

const selectTryContainerDomain = state =>
  state.get("tryContainer", initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TryContainer
 */

const makeSelectTryContainer = () =>
  createSelector(
    selectTryContainerDomain,
    substate => substate.toJS()
  );

export default makeSelectTryContainer;
export { selectTryContainerDomain };
