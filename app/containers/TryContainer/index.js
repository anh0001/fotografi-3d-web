/**
 *
 * TryContainer
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import makeSelectTryContainer from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";

function TryContainer() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

TryContainer.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  tryContainer: makeSelectTryContainer()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "tryContainer", reducer });
const withSaga = injectSaga({ key: "tryContainer", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(TryContainer);
