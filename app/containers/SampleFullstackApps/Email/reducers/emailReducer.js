import produce from 'immer';
import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_EMAIL_SUCCESS,
  SEND_MAIL,
  SEND_MAIL_SUCCESS,
  UPDATE_MAIL,
  UPDATE_MAIL_SUCCESS,
  DELETE_MAIL_SUCCESS,
  OPEN_MAIL,
  FILTER_MAIL,
  COMPOSE_MAIL,
  DISCARD_MESSAGE,
  SEARCH_MAIL,
} from './emailConstants';

const initialState = {
  inbox: [],
  selectedMail: 0,
  selectedMailId: '',
  keywordValue: '',
  currentPage: 'inbox',
  openFrm: false,
  notifMsg: '',
  loading: true,
  processing: false,
};

/* eslint-disable default-case, no-param-reassign */
const emailReducer = (state = initialState, action = {}) => produce(state, draft => {
  switch (action.type) {
    case FETCH_EMAIL_SUCCESS:
      draft.inbox = action.payload;
      draft.loading = false;
      break;
    case SEND_MAIL:
    case UPDATE_MAIL:
      draft.processing - true;
      break;
    case SEND_MAIL_SUCCESS:
      draft.inbox.unshift(action.payload);
      draft.selectedMail = '';
      draft.openFrm = false;
      draft.notifMsg = notif.sent;
      draft.processing = false;
      break;
    case DELETE_MAIL_SUCCESS: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.payload.key);
      if (index !== -1) {
        draft.inbox.splice(index, 1);
        draft.notifMsg = notif.removed;
      }
      break;
    }
    case UPDATE_MAIL_SUCCESS: {
      const index = draft.inbox.findIndex((obj) => obj.key === action.payload.key);
      if (index !== -1) {
        draft.inbox[index] = action.payload;
        draft.notifMsg = notif.updated;
      }
      break;
    }
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
    case CLOSE_NOTIF:
      draft.notifMsg = '';
      break;
    default:
      break;
  }
});

export default emailReducer;
