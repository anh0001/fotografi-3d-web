import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  EmailHeader,
  EmailList,
  EmailSidebar,
  ComposeEmail,
  Notification
} from 'enl-components';
import styles from 'enl-components/Email/email-jss';
import { getVisibleMail } from './reducers/selectors';
import {
  sendAction,
  composeAction,
  updateAction,
  openMailAction,
  filterAction,
  deleteAction,
  discardAction,
  searchAction,
  closeNotifAction
} from './reducers/emailActions';

// validation functions
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : ''
);

class Email extends React.Component {
  state = {
    to: '',
    subject: '',
    validMail: '',
    mobileOpen: false,
  };

  handleChange = (event, name) => {
    if (name === 'to') {
      this.setState({ validMail: email(event.target.value) });
    }
    this.setState({
      [name]: event.target.value,
    });
  };

  handleReply = (mail) => {
    const { compose } = this.props;
    compose();
    this.setState({
      to: mail.get('name'),
      subject: 'Reply: ' + mail.get('subject'),
    });
  }

  handleCompose = () => {
    const { compose } = this.props;
    compose();
    this.setState({
      to: '',
      subject: '',
    });
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const {
      classes,
      emailData, openMail,
      goto, currentPage,
      openFrm, discard,
      search, keyword,
      sendEmail, remove, update,
      closeNotif, messageNotif,
      loading, processing
    } = this.props;
    const {
      to,
      subject,
      validMail,
      mobileOpen
    } = this.state;
    const title = brand.name + ' - Email';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Notification close={() => closeNotif()} message={messageNotif} />
        <div className={classes.root}>
          <EmailHeader search={search} handleDrawerToggle={this.handleDrawerToggle} />
          <EmailSidebar
            compose={this.handleCompose}
            goto={goto}
            selected={currentPage}
            handleDrawerToggle={this.handleDrawerToggle}
            mobileOpen={mobileOpen}
          />
          <EmailList
            emailData={emailData}
            openMail={openMail}
            filterPage={currentPage}
            keyword={keyword}
            moveTo={update}
            remove={remove}
            toggleStar={update}
            reply={this.handleReply}
            loading={loading}
          />
        </div>
        <ComposeEmail
          to={to}
          subject={subject}
          compose={this.handleCompose}
          validMail={validMail}
          sendEmail={sendEmail}
          inputChange={this.handleChange}
          open={openFrm}
          closeForm={discard}
          processing={processing}
        />
      </div>
    );
  }
}

Email.propTypes = {
  classes: PropTypes.object.isRequired,
  emailData: PropTypes.object.isRequired,
  sendEmail: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  openMail: PropTypes.func.isRequired,
  goto: PropTypes.func.isRequired,
  compose: PropTypes.func.isRequired,
  discard: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  openFrm: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  processing: PropTypes.bool,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
};

Email.defaultProps = {
  loading: false,
  processing: false
};

const reducer = 'emailFullstack';
const mapStateToProps = state => ({
  emailData: getVisibleMail(state.get(reducer)),
  currentPage: state.getIn([reducer, 'currentPage']),
  keyword: state.getIn([reducer, 'keywordValue']),
  openFrm: state.getIn([reducer, 'openFrm']),
  messageNotif: state.getIn([reducer, 'notifMsg']),
  loading: state.getIn([reducer, 'loading']),
  processing: state.getIn([reducer, 'processing']),
  ...state
});

const constDispatchToProps = dispatch => ({
  sendEmail: bindActionCreators(sendAction, dispatch),
  remove: bindActionCreators(deleteAction, dispatch),
  update: bindActionCreators(updateAction, dispatch),
  openMail: bindActionCreators(openMailAction, dispatch),
  goto: bindActionCreators(filterAction, dispatch),
  search: bindActionCreators(searchAction, dispatch),
  compose: () => dispatch(composeAction),
  discard: () => dispatch(discardAction),
  closeNotif: () => dispatch(closeNotifAction),
});

const EmailMapped = connect(
  mapStateToProps,
  constDispatchToProps
)(Email);

export default withStyles(styles)(EmailMapped);
