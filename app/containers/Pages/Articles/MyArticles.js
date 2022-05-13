import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import history from 'utils/history';
import { v4 as uuidv4 } from 'uuid';
import { getDate, getTime } from 'enl-components/helpers/dateTimeHelper';
import articleStatus from 'enl-api/apps/articleStatus';

import {
  ArticlesTimeline,
  Notification,
  AddNewArticle,
  RequestConfirmationArticle,
} from 'enl-components';
import reducer from './reducers/articlesReducer';
import saga from './reducers/articlesSagas';

import { firebase } from '../../../firebase';


import {
  closeNotifAction,
  detailAction,
  fetchAction,
  openAddNewArticleAction,
  closeAddNewArticleFormAction,
  createNewArticleAction,
  deleteArticleAction,
  updateNotificationAction,
} from './reducers/articlesActions';

const listOptions = [
  'Edit',
  'Delete'
];

class MyArticles extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      setOpenReqConfirmArticleForm: false,
    };
    this.curArticle = null;
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const {
      userId,
    } = this.props;

    if (userId) {
      this.listUserArticles();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      userId,
    } = this.props;

    if (userId && !prevProps.userId) {
      this.listUserArticles();
    }
  }

  handleClickOptions = (optAction, curContent) => {
    const {
      user,
      showDetailHandler,
      deleteArticleHandler,
    } = this.props;

    if (optAction === 'Edit') {
      showDetailHandler(curContent);
      history.push('/app/' + user.username + '/posts/edit-article');
    } else if (optAction === 'Delete') {
      deleteArticleHandler(user.userId, user.username, curContent.get('articleId'));
      this.listUserArticles();
    }
  };

  handleClickLearnMore = (event, curContent) => {
    const {
      user
    } = this.props;

    history.push('/app/' + user.username + '/posts/read-article/' + curContent.get('articleId'));
  };

  handleClickConfirmButton = (event, curContent) => {
    const {
      updateNotificationHandler
    } = this.props;

    // Change status field in the article database
    try {
      firebase.editArticle(curContent.get('userId'), curContent.get('articleId'), {
        status: articleStatus.published,
      }).then(() => {
        this.listUserArticles();
        updateNotificationHandler('The article has been confirmed');
      });
    } catch (error) {
      console.log('MyArticles-handleClickConfirmButton', error);
    }
  };

  handleRequestConfirmationButton = (event, curContent) => {
    this.setState({
      setOpenReqConfirmArticleForm: true,
    });
    this.curArticle = curContent;
  };

  handleSubmitRequestConfirmationArticle = (formValues) => {
    const {
      user,
      updateNotificationHandler
    } = this.props;

    // Change labUsername field in the article database to the specified labUsername form value
    try {
      firebase.editArticle(user.userId, this.curArticle.get('articleId'), {
        labUsername: formValues.get('labUsername'),
        status: articleStatus.waiting_confirmation,
      })
        .then(() => {
          this.listUserArticles();
          updateNotificationHandler('Request confirmation has been sent');
        });
    } catch (error) {
      console.log('MyArticles-handleSubmitRequestConfirmationArticle', error);
    }

    // Close the request confirmation form panel
    this.setState({
      setOpenReqConfirmArticleForm: false,
    });
  };

  handleCloseRequestConfirmationArticle = () => (
    this.setState({
      setOpenReqConfirmArticleForm: false,
    })
  );

  addNewArticle = (items) => {
    const {
      user,
      createNewArticle,
      closeAddNewArticleFormHandler
    } = this.props;

    const values = items.toJS();
    // console.log('items: ', values);

    // Replace spaces with dashes and make all letters lower-case
    const uuidStr = uuidv4().split('-'); // only get the first word
    const articleId = values.title.replace(/\s+/g, '-').toLowerCase() + '-' + uuidStr[0];

    const newArticle = {
      userId: user.userId,
      username: user.username,
      labUsername: '',
      icon: 'description',
      date: getDate(),
      time: getTime(),
      avatar: user.avatar,
      articleId,
      title: values.title,
      status: articleStatus.draft,
      // Initial empty block
      // TODO: change it to elegant way
      content: '{"blocks":[{"key":"30at7","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    };

    createNewArticle(newArticle);
    history.push('/app/' + user.username + '/posts/newarticle/');

    closeAddNewArticleFormHandler();
  }

  listUserArticles() {
    const {
      user,
      fetchDataHandler
    } = this.props;

    try {
      firebase.getArticlesUsingUsername(user.username)
        .then(resp => {
          fetchDataHandler(resp);
        });
    } catch (error) {
      console.log('MyArticles-updateUserArticles', error);
    }
  }

  render() {
    const title = brand.name + ' - My Articles';
    const description = brand.desc;
    const {
      user,
      closeNotif,
      messageNotif,
      dataArticles,
      setOpenAddNewArticleForm,
      openAddNewArticleHandler,
      closeAddNewArticleFormHandler,
    } = this.props;

    const {
      setOpenReqConfirmArticleForm,
    } = this.state;

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
                clickConfirmHandler={this.handleClickConfirmButton}
                clickRequestConfirmationHandler={this.handleRequestConfirmationButton}
                userType={user ? user.userType : null}
              // onlike={submitLike}
              // submitComment={submitComment}
              // fetchComment={fetchComment}
              // commentIndex={commentIndex}
              />
            </div>
          </Grid>
        </Grid>

        {user
          ? (
            <AddNewArticle
              openAddNewArticle={openAddNewArticleHandler}
              openForm={setOpenAddNewArticleForm}
              closeForm={closeAddNewArticleFormHandler}
              submit={this.addNewArticle}
            />
          ) : null}

        <RequestConfirmationArticle
          setOpenForm={setOpenReqConfirmArticleForm}
          closeFormHandler={this.handleCloseRequestConfirmationArticle}
          submit={this.handleSubmitRequestConfirmationArticle}
        />
      </div>
    );
  }
}

MyArticles.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  dataArticles: PropTypes.object,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  showDetailHandler: PropTypes.func,
  fetchDataHandler: PropTypes.func,
  setOpenAddNewArticleForm: PropTypes.bool.isRequired,
  openAddNewArticleHandler: PropTypes.func.isRequired,
  closeAddNewArticleFormHandler: PropTypes.func.isRequired,
  createNewArticle: PropTypes.func.isRequired,
  deleteArticleHandler: PropTypes.func.isRequired,
  updateNotificationHandler: PropTypes.func,
};

MyArticles.defaultProps = {
  dataArticles: null,
  showDetailHandler: null,
  fetchDataHandler: null,
  updateNotificationHandler: null,
};

const authReducerKey = 'authReducer';
const reducerKey = 'articlesReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  user: state.get(authReducerKey).user,
  userId: state.get(authReducerKey).userId,
  username: state.get(authReducerKey).username,
  dataArticles: state.getIn([reducerKey, 'dataArticles']),
  setOpenAddNewArticleForm: state.getIn([reducerKey, 'setOpenAddNewArticle']),
  messageNotif: state.getIn([reducerKey, 'notifMsg']),
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
  openAddNewArticleHandler: () => dispatch(openAddNewArticleAction),
  closeAddNewArticleFormHandler: () => dispatch(closeAddNewArticleFormAction),
  createNewArticle: bindActionCreators(createNewArticleAction, dispatch),
  deleteArticleHandler: bindActionCreators(deleteArticleAction, dispatch),
  updateNotificationHandler: bindActionCreators(updateNotificationAction, dispatch),
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
)(MyArticles);
