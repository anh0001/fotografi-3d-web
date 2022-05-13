import firebase from '../../../firebase';
import * as types from './userProfileConstants';

//= ====================================
//  User Profile
//-------------------------------------

export const getUserProfile = userUid => ({
    type: types.GET_USER_PROFILE,
    userUid
});

export const getUserProfileSuccess = userData => ({
    type: types.GET_USER_PROFILE_SUCCESS,
    userData
});

export const getUserProfileError = error => ({
    type: types.GET_USER_PROFILE_ERROR,
    error
});

export const updateUserProfile = (userUid, updates) => ({
    type: types.UPDATE_USER_PROFILE,
    userUid,
    updates
});

export const updateUserProfileError = error => ({
    type: types.UPDATE_USER_PROFILE_ERROR,
    error
});