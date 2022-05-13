// *** List Projects ***

import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import history from 'utils/history';

import reducer from './reducers/projectsReducer';
import saga from './reducers/projectsSagas';

import { firebase } from '../../../firebase';

import {
  ProjectsTimeline,
  Notification
} from 'enl-components';

import {
  closeNotifAction,
  detailAction,
  fetchAction,
} from './reducers/projectsActions';

const listOptions = [
  'Learn More'
];

class ListProjects extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      lastKey: null,
    };
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      try {
        firebase.getProjects(null)
          .then(resp => {
            this.props.fetchDataHandler(resp.projects);
            this.setState({
              lastKey: resp.lastKey,
            });
            // console.log('Projects-componentDidMount fetched data');
            return;
          });
      } catch (error) {
        console.log('Projects-componentDidMount', error);
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      try {
        firebase.getProjects(null)
          .then(resp => {
            this.props.fetchDataHandler(resp.projects);
            this.setState({
              lastKey: resp.lastKey,
            });
            // console.log('Projects-componentDidUpdate fetched data');
            return;
          });
      } catch (error) {
        console.log('Projects-componentDidUpdate', error);
      }
    };
  };

  handleClickOptions = (optAction, curContent) => {
    if (optAction === 'Learn More') {
      this.props.showDetailHandler(curContent);
      const parsed = {
        projectid: curContent.get('projectId'),
      };

      history.push('/app/' + curContent.get('username') + '/projects/read-project/' + curContent.get('projectId'));
    }
    return;
  };

  handleClickLearnMore = (event, curContent) => {

    history.push('/app/' + curContent.get('username') + '/projects/read-project/' + curContent.get('projectId'));

    return;
  };

  render() {
    const title = brand.name + ' - Projects';
    const description = brand.desc;
    const {
      closeNotif,
      messageNotif,
      dataProjects,
    } = this.props;

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
        <Grid
          container
          alignItems="flex-start"
          justify="flex-start"
          direction="row"
          spacing={3}
        >
          <Grid item xs={12}>
            <div>
              {/* <WriteProject submitPost={submitPost} /> */}
              <ProjectsTimeline
                dataTimeline={dataProjects}
                optionsOpt={listOptions}
                ClickOptionsHandler={this.handleClickOptions}
                clickLearnMoreHandler={this.handleClickLearnMore}
              // onlike={submitLike}
              // submitComment={submitComment}
              // fetchComment={fetchComment}
              // commentIndex={commentIndex}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ListProjects.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  dataProjects: PropTypes.object,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  showDetailHandler: PropTypes.func,
  fetchDataHandler: PropTypes.func,
};

const authReducerKey = 'authReducer';
const timelineReducerKey = 'timeline';
const reducerKey = 'projectsReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  isAuthenticated: state.get(authReducerKey).loggedIn,
  user: state.get(authReducerKey).user,
  dataProjects: state.getIn([reducerKey, 'dataProjects']),
  messageNotif: state.getIn([timelineReducerKey, 'notifMsg']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchDataHandler: bindActionCreators(fetchAction, dispatch),
  // submitPost: bindActionCreators(postAction, dispatch),
  // submitComment: bindActionCreators(postCommentAction, dispatch),
  // submitLike: bindActionCreators(toggleLikeAction, dispatch),
  // fetchComment: bindActionCreators(fetchCommentAction, dispatch),
  showDetailHandler: bindActionCreators(detailAction, dispatch),
  closeNotif: () => dispatch(closeNotifAction),
});

const withReducer = injectReducer({ key: reducerKey, reducer });
const withSaga = injectSaga({ key: sagaKey, saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  // withStyles(styles),
)(ListProjects);
