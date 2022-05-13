import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import userTypes from 'enl-api/apps/userTypes';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import history from 'utils/history';
import { v4 as uuidv4 } from 'uuid';
import { getDate, getTime } from 'enl-components/helpers/dateTimeHelper';
import projectStatus from 'enl-api/apps/projectStatus';

import reducer from './reducers/projectsReducer';
import saga from './reducers/projectsSagas';

import { firebase } from '../../../firebase';

import {
  ProjectsTimeline,
  Notification,
  AddNewProject,
  RequestConfirmationProject,
} from 'enl-components';

import {
  closeNotifAction,
  detailAction,
  fetchAction,
  openAddNewProjectAction,
  closeAddNewProjectFormAction,
  createNewProjectAction,
  deleteProjectAction,
  updateNotificationAction,
} from './reducers/projectsActions';

const listOptions = [
  'Edit',
  'Delete'
];

class MyProjects extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      lastKey: null,
      setOpenReqConfirmProjectForm: false,
    };
    this.curProject = null;
    // this.handleClick = this.handleClick.bind(this);
  }

  listUserProjects() {
    const {
      user,
    } = this.props;

    try {
      firebase.getProjectsUsingUsername(user.username)
        .then(resp => {
          this.props.fetchDataHandler(resp);
          return;
        });
    } catch (error) {
      console.log('MyProjects-updateUserProjects', error);
    }
  }

  componentDidMount() {
    const {
      userId,
    } = this.props;

    if (userId) {
      this.listUserProjects();
    };
  }

  componentDidUpdate(prevProps) {
    const {
      userId,
    } = this.props;

    if (userId && !prevProps.userId) {
      this.listUserProjects();
    };
  };

  handleClickOptions = (optAction, curContent) => {
    const {
      user
    } = this.props;

    if (optAction === 'Edit') {
      this.props.showDetailHandler(curContent);
      history.push('/app/' + user.username + '/projects/edit-project');

    } else if (optAction === 'Delete') {
      this.props.deleteProjectHandler(user.userId, user.username, curContent.get('projectId'));
      this.listUserProjects();
    }
    return;
  };

  handleClickLearnMore = (event, curContent) => {

    history.push('/app/' + curContent.get('username') + '/projects/read-project/' + curContent.get('projectId'));

    return;
  };

  handleClickConfirmButton = (event, curContent) => {
    // Change status field in the project database
    try {
      firebase.editProject(curContent.get('userId'), curContent.get('projectId'), {
        status: projectStatus.published,
      }).then(() => {
        this.listUserProjects();
        this.props.updateNotificationHandler('The project has been confirmed');
      });
    } catch (error) {
      console.log('MyProjects-handleClickConfirmButton', error);
    }

    return;
  };

  handleRequestConfirmationButton = (event, curContent) => {
    this.setState({
      setOpenReqConfirmProjectForm: true,
    });
    this.curProject = curContent;
    return;
  };

  handleSubmitRequestConfirmationProject = (formValues) => {
    const {
      curProject,
    } = this.state;
    const {
      user,
    } = this.props;

    // Change labUsername field in the project database to the specified labUsername form value
    try {
      firebase.editProject(user.userId, this.curProject.get('ProjectId'), {
        labUsername: formValues.get('labUsername'),
        status: projectStatus.waiting_confirmation,
      })
        .then(() => {
          this.listUserProjects();
          this.props.updateNotificationHandler('Request confirmation has been sent');
        });
    } catch (error) {
      console.log('MyProjects-handleSubmitRequestConfirmationProject', error);
    }

    // Close the request confirmation form panel
    this.setState({
      setOpenReqConfirmProjectForm: false,
    });

    return;
  };

  handleCloseRequestConfirmationProject = () => (
    this.setState({
      setOpenReqConfirmProjectForm: false,
    })
  );

  addNewProject = (items) => {
    const {
      user,
    } = this.props;

    const values = items.toJS();
    // console.log('items: ', values);

    //Replace spaces with dashes and make all letters lower-case
    const uuidStr = uuidv4().split('-');  // only get the first word
    const projectId = values.title.replace(/\s+/g, '-').toLowerCase() + '-' + uuidStr[0];
    const currentDate = new Date();
    const startingDate = new Date(values.startingDate.toString());
    const endingDate = new Date(values.endingDate.toString());
    const project_status = (currentDate >= startingDate && currentDate <= endingDate) ? projectStatus.ongoing
      : (currentDate > endingDate ? projectStatus.finished : projectStatus.draft);

    const newProject = {
      userId: user.userId,
      username: user.username,
      icon: 'description',
      dateCreated: getDate(),
      timeCreated: getTime(),
      avatar: user.avatar,
      projectId: projectId,
      status: project_status,
      ...values,
      // Initial empty block
      //TODO: change it to elegant way
      content: '{"blocks":[{"key":"30at7","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    };
    // console.log('items: ', newProject);

    this.props.createNewProject(newProject);
    history.push('/app/' + user.username + '/projects/newproject/');

    this.props.closeAddNewProjectFormHandler();
  }

  render() {
    const title = brand.name + ' - My Projects';
    const description = brand.desc;
    const {
      user,
      closeNotif,
      messageNotif,
      dataProjects,
      addNewProjectHandler,
      setOpenAddNewProjectForm,
      openAddNewProjectHandler,
      closeAddNewProjectFormHandler,
    } = this.props;

    const {
      setOpenReqConfirmProjectForm,
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
              {/* <WriteProject submitPost={submitPost} /> */}
              <ProjectsTimeline
                dataTimeline={dataProjects}
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

        {user && user.userType === userTypes.lab ?
          <AddNewProject
            openAddNewProject={openAddNewProjectHandler}
            openForm={setOpenAddNewProjectForm}
            closeForm={closeAddNewProjectFormHandler}
            submit={this.addNewProject}
          /> : null}

        <RequestConfirmationProject
          setOpenForm={setOpenReqConfirmProjectForm}
          closeFormHandler={this.handleCloseRequestConfirmationProject}
          submit={this.handleSubmitRequestConfirmationProject}
        />
      </div>
    );
  }
}

MyProjects.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  dataProjects: PropTypes.object,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  showDetailHandler: PropTypes.func,
  fetchDataHandler: PropTypes.func,
  setOpenAddNewProjectForm: PropTypes.bool.isRequired,
  openAddNewProjectHandler: PropTypes.func.isRequired,
  closeAddNewProjectFormHandler: PropTypes.func.isRequired,
  createNewProject: PropTypes.func.isRequired,
  deleteProjectHandler: PropTypes.func.isRequired,
  updateNotificationHandler: PropTypes.func,
};

MyProjects.defaultProps = {
  setOpenAddNewProjectForm: false,
};

const authReducerKey = 'authReducer';
const reducerKey = 'projectsReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  user: state.get(authReducerKey).user,
  userId: state.get(authReducerKey).userId,
  username: state.get(authReducerKey).username,
  dataProjects: state.getIn([reducerKey, 'dataProjects']),
  setOpenAddNewProjectForm: state.getIn([reducerKey, 'setOpenAddNewProject']),
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
  openAddNewProjectHandler: () => dispatch(openAddNewProjectAction),
  closeAddNewProjectFormHandler: () => dispatch(closeAddNewProjectFormAction),
  createNewProject: bindActionCreators(createNewProjectAction, dispatch),
  deleteProjectHandler: bindActionCreators(deleteProjectAction, dispatch),
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
)(MyProjects);
