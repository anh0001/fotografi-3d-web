import produce from 'immer';
import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_EMAIL_DATA,
  OPEN_MAIL,
  FILTER_MAIL,
  COMPOSE_MAIL,
  SUBMIT_MAIL,
  DISCARD_MESSAGE,
  SEARCH_MAIL,
  REMOVE_MAIL,
  MOVE_TO,
  TOGGLE_STARED
} from './emailConstants';

const initialState = {
  inbox: [],
  selectedMail: 0,
  selectedMailId: '',
  keywordValue: '',
  currentPage: 'inbox',
  openFrm: false,
  notifMsg: '',
};

const buildMessage = mail => {
  const key = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  const newData = {
    key,
    ...mail
  };
  return newData;
};

/* eslint-disable default-case, no-param-reassign */
const emailReducer = (state = initialState, action = {}) => produce(state, draft => {
  switch (action.type) {
    case FETCH_EMAIL_DATA:
      draft.inbox = action.items;
      break;
    case OPEN_MAIL: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.mail.key);
      if (index !== -1) {
        draft.selectedMail = index;
      }
      break;
    }
    case FILTER_MAIL:
      draft.currentPage = action.filter;
      break;
    case COMPOSE_MAIL:
      draft.openFrm = true;
      break;
    case SUBMIT_MAIL: {
      const newMail = buildMessage(action.payload);
      draft.inbox.unshift(newMail);
      draft.selectedMail = '';
      draft.openFrm = false;
      draft.notifMsg = notif.sent;
      break;
    }
    case DISCARD_MESSAGE:
      draft.openFrm = false;
      draft.selectedMailId = '';
      draft.notifMsg = notif.discard;
      break;
    case SEARCH_MAIL: {
      action.keyword.persist();
      const keyword = action.keyword.target.value.toLowerCase();
      draft.keywordValue = keyword;
      break;
    }
    case REMOVE_MAIL: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.mail.key);
      if (index !== -1) {
        draft.inbox.splice(index, 1);
        draft.notifMsg = notif.removed;
      }
      break;
    }
    case TOGGLE_STARED: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.mail.key);
      if (index !== -1) {
        draft.inbox[index].stared = !draft.inbox[index].stared;
      }
      break;
    }
    case MOVE_TO: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.mail.key);
      draft.inbox[index].category = action.group.category;
      draft.notifMsg = notif.labeled;
      break;
    }
    case CLOSE_NOTIF:
      draft.notifMsg = '';
      break;
    default:
      break;
  }
});

export default emailReducer;
