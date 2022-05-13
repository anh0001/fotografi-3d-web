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

import reducer from './reducers/articlesReducer';
import saga from './reducers/articlesSagas';

import { firebase } from '../../../firebase';

import {
  ArticlesTimeline,
  Notification
} from 'enl-components';

import {
  closeNotifAction,
  detailAction,
  fetchAction,
} from './reducers/articlesActions';

const listOptions = [
  'Learn More'
];

class Articles extends React.Component {
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
        firebase.getArticles(null)
          .then(resp => {
            this.props.fetchDataHandler(resp.articles);
            this.setState({
              lastKey: resp.lastKey,
            });
            // console.log('Articles-componentDidMount fetched data');
            return;
          });
      } catch (error) {
        console.log('Articles-componentDidMount', error);
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      try {
        firebase.getArticles(null)
          .then(resp => {
            this.props.fetchDataHandler(resp.articles);
            this.setState({
              lastKey: resp.lastKey,
            });
            // console.log('Articles-componentDidUpdate fetched data');
            return;
          });
      } catch (error) {
        console.log('Articles-componentDidUpdate', error);
      }
    };
  };

  handleClickOptions = (optAction, curContent) => {
    if (optAction === 'Learn More') {
      this.props.showDetailHandler(curContent);
      const parsed = {
        articleid: curContent.get('articleId'),
      };

      history.push('/app/' + curContent.get('username') + '/posts/read-article/' + curContent.get('articleId'));
    }
    return;
  };

  handleClickLearnMore = (event, curContent) => {

    history.push('/app/' + curContent.get('username') + '/posts/read-article/' + curContent.get('articleId'));

    return;
  };

  render() {
    const title = brand.name + ' - Articles';
    const description = brand.desc;
    const {
      closeNotif,
      messageNotif,
      dataArticles,
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
              {/* <WriteArticle submitPost={submitPost} /> */}
              <ArticlesTimeline
                dataTimeline={dataArticles}
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

Articles.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  dataArticles: PropTypes.object,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  showDetailHandler: PropTypes.func,
  fetchDataHandler: PropTypes.func,
};

const authReducerKey = 'authReducer';
const timelineReducerKey = 'timeline';
const reducerKey = 'articlesReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  isAuthenticated: state.get(authReducerKey).loggedIn,
  user: state.get(authReducerKey).user,
  dataArticles: state.getIn([reducerKey, 'dataArticles']),
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
)(Articles);
