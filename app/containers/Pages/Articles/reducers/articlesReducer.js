import { fromJS, List, Map } from 'immutable';
import notif from 'enl-api/ui/notifMessage';
import dummy from 'enl-api/dummy/dummyContents';
import { getDate, getTime } from 'enl-components/helpers/dateTimeHelper';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_DATA_ARTICLES,
  POST,
  TOGGLE_LIKE,
  FETCH_COMMENT_DATA,
  POST_COMMENT,
  SHOW_DETAIL_ARTICLE,
  OPEN_ADD_NEW_ARTICLE,
  CLOSE_ADD_NEW_ARTICLE_FORM,
  CREATE_NEW_ARTICLE_SUCCESS,
  DELETE_ARTICLE,
  UPDATE_NOTIFICATION,
} from './articlesConstants';

const initialState = {
  dataArticles: List([]),
  commentIndex: 0,
  notifMsg: '',
  articleIndex: 0,
  addNewArticleFormValues: Map(),
  requestConfirmationArticleFormValues: Map(),
  setOpenAddNewArticle: false,

  newArticleData: Map(),
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

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case FETCH_DATA_ARTICLES:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataArticles', items);
      });
    case POST:
      return state.withMutations((mutableState) => {
        mutableState
          .update(
            'dataArticles',
            dataArticles => dataArticles.unshift(
              buildTimeline(action.text, action.media, action.privacy)
            )
          )
          .set('notifMsg', notif.posted);
      });
    case TOGGLE_LIKE:
      return state.withMutations((mutableState) => {
        const index = state.get('dataArticles').indexOf(action.item);
        mutableState.update('dataArticles', dataArticles => dataArticles
          .setIn([index, 'liked'], !state.getIn(['dataArticles', index, 'liked']))
        );
      });
    case FETCH_COMMENT_DATA:
      return state.withMutations((mutableState) => {
        const index = state.get('dataArticles').indexOf(action.item);
        mutableState.set('commentIndex', index);
      });
    case SHOW_DETAIL_ARTICLE:
      return state.withMutations((mutableState) => {
        const index = state.get('dataArticles').indexOf(action.item);
        mutableState.set('articleIndex', index);
      });
    case OPEN_ADD_NEW_ARTICLE:
      return state.withMutations((mutableState) => {
        mutableState
          .set('addNewArticleFormValues', Map())
          .set('setOpenAddNewArticle', true);
      });
    case CLOSE_ADD_NEW_ARTICLE_FORM:
      return state.withMutations((mutableState) => {
        mutableState
          .set('addNewArticleFormValues', Map())
          .set('setOpenAddNewArticle', false);
      });
    case CREATE_NEW_ARTICLE_SUCCESS:
      return state.withMutations((mutableState) => {
        const newArticle = fromJS(action.article);
        mutableState
          .set('newArticleData', newArticle)
          .set('notifMsg', notif.saved);
      });
    case DELETE_ARTICLE:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', notif.removed);
      });
    case POST_COMMENT:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataArticles',
            dataArticles => dataArticles.setIn(
              [state.get('commentIndex'), 'comments'],
              buildComment(action.comment, state.getIn(['dataArticles', state.get('commentIndex'), 'comments']))
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
