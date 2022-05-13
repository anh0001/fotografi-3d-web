import { fromJS, List, Map } from 'immutable';
import notif from 'enl-api/ui/notifMessage';
import dummy from 'enl-api/dummy/dummyContents';
import { getDate, getTime } from 'enl-components/helpers/dateTimeHelper';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_DATA_PROJECTS,
  POST,
  TOGGLE_LIKE,
  FETCH_COMMENT_DATA,
  POST_COMMENT,
  SHOW_DETAIL_PROJECT,
  OPEN_ADD_NEW_PROJECT,
  CLOSE_ADD_NEW_PROJECT_FORM,
  CREATE_NEW_PROJECT_SUCCESS,
  DELETE_PROJECT,
  UPDATE_NOTIFICATION,
} from './projectsConstants';

const initialState = {
  dataProjects: List([]),
  commentIndex: 0,
  notifMsg: '',
  projectIndex: 0,
  requestConfirmationProjectFormValues: Map(),
  setOpenAddNewProject: false,

  newProjectData: Map(),
};

const icon = privacyType => {
  switch (privacyType) {
    case 'public':
      return 'language';
    case 'friends':
      return 'people';
    default:
      return 'lock';
  }
};

const buildTimeline = (text, image, privacy) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  const imageSrc = image !== undefined ? URL.createObjectURL(image[0]) : '';
  return Map({
    id,
    name: 'Guest',
    date: getDate(),
    time: getTime(),
    icon: icon(privacy),
    avatar: dummy.user.avatar,
    image: imageSrc,
    content: text,
    liked: false,
    comments: List([])
  });
};

const buildComment = (message, curData) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  const newData = Map({
    id,
    from: 'Guest',
    avatar: dummy.user.avatar,
    date: getDate(),
    message,
  });
  return curData.push(newData);
};

const initialImmutableState = fromJS(initialState);

export default function projectReducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case FETCH_DATA_PROJECTS:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataProjects', items);
      });
    case POST:
      return state.withMutations((mutableState) => {
        mutableState
          .update(
            'dataProjects',
            dataProjects => dataProjects.unshift(
              buildTimeline(action.text, action.media, action.privacy)
            )
          )
          .set('notifMsg', notif.posted);
      });
    case TOGGLE_LIKE:
      return state.withMutations((mutableState) => {
        const index = state.get('dataProjects').indexOf(action.item);
        mutableState.update('dataProjects', dataArticles => dataArticles
          .setIn([index, 'liked'], !state.getIn(['dataProjects', index, 'liked']))
        );
      });
    case FETCH_COMMENT_DATA:
      return state.withMutations((mutableState) => {
        const index = state.get('dataProjects').indexOf(action.item);
        mutableState.set('commentIndex', index);
      });
    case SHOW_DETAIL_PROJECT:
      return state.withMutations((mutableState) => {
        const index = state.get('dataProjects').indexOf(action.item);
        mutableState.set('projectIndex', index);
      });
    case OPEN_ADD_NEW_PROJECT:
      return state.withMutations((mutableState) => {
        mutableState
          .set('setOpenAddNewProject', true);
      });
    case CLOSE_ADD_NEW_PROJECT_FORM:
      return state.withMutations((mutableState) => {
        mutableState
          .set('setOpenAddNewProject', false);
      });
    case CREATE_NEW_PROJECT_SUCCESS:
      return state.withMutations((mutableState) => {
        const newProject = fromJS(action.project);
        mutableState
          .set('newProjectData', newProject)
          .set('notifMsg', notif.saved);
      });
    case DELETE_PROJECT:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', notif.removed);
      });
    case POST_COMMENT:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataProjects',
            dataProjects => dataProjects.setIn(
              [state.get('commentIndex'), 'comments'],
              buildComment(action.comment, state.getIn(['dataProjects', state.get('commentIndex'), 'comments']))
            )
          )
          .set('notifMsg', notif.commented);
      });
    case UPDATE_NOTIFICATION:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', action.message);
      });
    case CLOSE_NOTIF:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', '');
      });
    default:
      return state;
  }
}
