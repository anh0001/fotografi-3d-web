import * as notification from 'enl-redux/constants/notifConstants';
import * as types from './articlesConstants';

export const fetchAction = items => ({
  type: types.FETCH_DATA_ARTICLES,
  items,
});

export const updateContentArticleAction = (payload) => ({
  type: types.UPDATE_CONTENT_ARTICLE,
  payload,
});

export const detailAction = item => ({
  type: types.SHOW_DETAIL_ARTICLE,
  item
});

export const openAddNewArticleAction = {
  type: types.OPEN_ADD_NEW_ARTICLE,
};

export const closeAddNewArticleFormAction = {
  type: types.CLOSE_ADD_NEW_ARTICLE_FORM,
};

export const createNewArticleAction = (article) => ({
  type: types.CREATE_NEW_ARTICLE,
  article,
});

export const deleteArticleAction = (userId, username, articleId) => ({
  type: types.DELETE_ARTICLE,
  userId,
  username,
  articleId
});

export const createNewArticleSuccessAction = (article) => ({
  type: types.CREATE_NEW_ARTICLE_SUCCESS,
  article,
});

export const updateNotificationAction = (message) => ({
  type: types.UPDATE_NOTIFICATION,
  message,
});

export const closeNotifAction = {
  type: notification.CLOSE_NOTIF
};