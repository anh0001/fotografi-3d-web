import * as notification from 'enl-redux/constants/notifConstants';
import * as types from './projectsConstants';

export const fetchAction = items => ({
  type: types.FETCH_DATA_PROJECTS,
  items,
});

export const updateContentProjectAction = (payload) => ({
  type: types.UPDATE_CONTENT_PROJECT,
  payload,
});

export const detailAction = item => ({
  type: types.SHOW_DETAIL_PROJECT,
  item
});

export const openAddNewProjectAction = {
  type: types.OPEN_ADD_NEW_PROJECT,
};

export const closeAddNewProjectFormAction = {
  type: types.CLOSE_ADD_NEW_PROJECT_FORM,
};

export const createNewProjectAction = (project) => ({
  type: types.CREATE_NEW_PROJECT,
  project,
});

export const deleteProjectAction = (userId, username, projectId) => ({
  type: types.DELETE_PROJECT,
  userId,
  username,
  projectId
});

export const createNewProjectSuccessAction = (project) => ({
  type: types.CREATE_NEW_PROJECT_SUCCESS,
  project,
});

export const updateNotificationAction = (message) => ({
  type: types.UPDATE_NOTIFICATION,
  message,
});

export const closeNotifAction = {
  type: notification.CLOSE_NOTIF
};