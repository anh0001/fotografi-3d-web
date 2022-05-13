import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';

import reducer from './userProfileReducer';
import saga from './userProfileSagas';

import {
  makeSelectAuthUser,
  makeSelectAuthLoggedIn,
  makeSelectUserProfile
} from './userProfileSelectors';
import {
  getUserProfile
} from './userProfileActions';

import AppBar from '@material-ui/core/AppBar';
import dummy from 'enl-api/dummy/dummyContents';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import { withStyles } from '@material-ui/core/styles';
import {
  Cover,
  About,
  Connection,
  Albums
} from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'enl-components/Profile/messages';
import styles from 'enl-components/Profile/cover-jss';

function TabContainer(props) {
  const { children } = props;
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class UserProfile extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  // componentDidMount() {
  //   if (this.props.isAuthenticated) {
  //     this.props.getUserProfilehandler(this.props.user.uid);
  //   };
  // };

  // componentDidUpdate(prevProps) {
  //   if (this.props.user && !prevProps.user) {
  //     this.props.getUserProfilehandler(this.props.user.uid);
  //   };
  // };

  render() {
    const title = brand.name + ' - Profile';
    const description = brand.desc;
    const {
      classes,
      intl,
      user,
      // isAuthenticated,
      // userProfile
    } = this.props;
    const { value } = this.state;
    const profile = userProfile => {
      if (userProfile) {
        return (
          userProfile.fullname
        );
      }
      return (
        ''
      );
    };

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
        <Cover
          coverImg=""
          avatar={user && user.avatar ? user.avatar : dummy.user.avatar}
          name={profile(user)}
          desc={user && user.description ? user.description : ' '}
        />
        <AppBar position="static" className={classes.profileTab}>
          <Hidden mdUp>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab icon={<AccountCircle />} />
              <Tab icon={<SupervisorAccount />} />
              <Tab icon={<PhotoLibrary />} />
            </Tabs>
          </Hidden>
          <Hidden smDown>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab icon={<AccountCircle />} label={intl.formatMessage(messages.about)} />
              <Tab icon={<SupervisorAccount />} label={'20 ' + intl.formatMessage(messages.connections)} />
              <Tab icon={<PhotoLibrary />} label={'4 ' + intl.formatMessage(messages.albums)} />
            </Tabs>
          </Hidden>
        </AppBar>
        {value === 0 && <TabContainer><About /></TabContainer>}
        {value === 1 && <TabContainer><Connection /></TabContainer>}
        {value === 2 && <TabContainer><Albums /></TabContainer>}
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  // userProfile: PropTypes.object,
  // getUserProfilehandler: PropTypes.func
};

UserProfile.defaultProps = {
  user: null,
  isAuthenticated: null,
  // userProfile: null
};

const mapStateToProps = state => createStructuredSelector({
  isAuthenticated: makeSelectAuthLoggedIn(),
  user: makeSelectAuthUser(),
  // userProfile: makeSelectUserProfile()
});

const mapDispatchToProps = dispatch => ({
  // getUserProfilehandler: bindActionCreators(getUserProfile, dispatch),
});

const withReducer = injectReducer({ key: "userProfileReducer", reducer });
const withSaga = injectSaga({ key: "userProfileReducer", saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(injectIntl(UserProfile));