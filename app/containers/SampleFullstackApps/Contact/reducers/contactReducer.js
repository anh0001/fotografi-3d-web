import produce from 'immer';
import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_CONTACT_SUCCESS,
  CREATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_SUCCESS,
  DELETE_CONTACT_SUCCESS,
  SEARCH_CONTACT,
  SHOW_DETAIL_CONTACT_FIREBASE,
  HIDE_DETAIL,
  EDIT_CONTACT_FIREBASE,
  ADD_CONTACT,
  CLOSE_CONTACT_FORM,
} from './contactConstants';

const initialState = {
  formValues: null,
  selectedIndex: 0,
  selectedId: '',
  keywordValue: '',
  avatarInit: '',
  openFrm: false,
  showMobileDetail: false,
  notifMsg: '',
  contactList: [],
  loading: true,
};
// let editingIndex = 0;

/* eslint-disable default-case, no-param-reassign */
const contactReducer = (state = initialState, action = {}) => produce(state, draft => {
  switch (action.type) {
    case FETCH_CONTACT_SUCCESS:
      draft.contactList = action.payload;
      draft.loading = false;
      break;
    case CREATE_CONTACT_SUCCESS:
      draft.contactList.unshift(action.payload);
      draft.formValues = null;
      draft.avatarInit = '';
      draft.openFrm = false;
      draft.notifMsg = notif.saved;
      break;
    case UPDATE_CONTACT_SUCCESS: {
      const index = draft.contactList.findIndex((obj) => obj.key === action.payload.key);
      if (index !== -1) {
        draft.contactList[index] = action.payload;
      }
      draft.formValues = null;
      draft.avatarInit = '';
      draft.openFrm = false;
      draft.notifMsg = notif.updated;
      break;
    }
    case DELETE_CONTACT_SUCCESS: {
      const index = draft.contactList.findIndex((obj) => obj.key === action.payload.key);
      if (index !== -1) {
        draft.contactList.splice(index, 1);
        draft.notifMsg = notif.removed;
      }
      break;
    }
    case SEARCH_CONTACT: {
      action.keyword.persist();
      const keyword = action.keyword.target.value.toLowerCase();
      draft.keywordValue = keyword;
      break;
    }
    case ADD_CONTACT:
      draft.openFrm = true;
      draft.formValues = null;
      draft.avatarInit = '';
      break;
    case CLOSE_CONTACT_FORM:
      draft.openFrm = false;
      draft.formValues = null;
      draft.avatarInit = '';
      draft.notifMsg = notif.discard;
      break;
    case EDIT_CONTACT_FIREBASE:
      draft.openFrm = true;
      draft.selectedId = action.item.key;
      draft.formValues = action.item.toJS();
      draft.avatarInit = action.item.avatar;
      break;
    case SHOW_DETAIL_CONTACT_FIREBASE: {
      const index = state.contactList.indexOf(action.item);
      draft.selectedIndex = index || 0;
      draft.showMobileDetail = true;
      break;
    }
    case HIDE_DETAIL:
      draft.showMobileDetail = false;
      break;
    case CLOSE_NOTIF:
      draft.notifMsg = '';
      break;
    default:
      break;
  }
});

export default contactReducer;
