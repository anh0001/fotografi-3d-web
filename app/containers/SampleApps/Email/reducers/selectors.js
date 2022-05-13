import { createSelector } from 'reselect';

export function getEmail(state) {
  return state;
}

export function getEmailList(state) {
  return getEmail(state).inbox;
}

export function getEmailCategory(state) {
  return getEmail(state).currentPage;
}

// =====================================
//  MEMOIZED SELECTORS
// -------------------------------------

export const getVisibleMail = createSelector(
  getEmailCategory,
  getEmailList,
  (category, emailList) => {
    switch (category) {
      case 'inbox':
        return emailList.filter(item => item.category !== 'sent' && item.category !== 'spam');
      case 'stared':
        return emailList.filter(item => item.stared);
      case 'sent':
        return emailList.filter(item => item.category === 'sent');
      case 'spam':
        return emailList.filter(item => item.category === 'spam');
      case 'updates':
        return emailList.filter(item => item.category === 'updates');
      case 'social':
        return emailList.filter(item => item.category === 'social');
      case 'forums':
        return emailList.filter(item => item.category === 'forums');
      case 'promos':
        return emailList.filter(item => item.category === 'promos');
      default:
        return emailList;
    }
  }
);
