import { createSelector } from 'reselect';
import { initialState } from './userProfileReducer';
import { AuthState } from 'enl-redux/modules/authReducer';

export const selectUserProfile = state => state.get("userProfileReducer", initialState);

const selectAuth = state => state.get("authReducer", AuthState);

export const makeSelectUserProfile = () =>
    createSelector(
        selectUserProfile,
        state => state.userProfile,
    );

export const makeSelectAuthUser = () =>
    createSelector(
        selectAuth,
        state => state.user,
    );

export const makeSelectAuthLoggedIn = () =>
    createSelector(
        selectAuth,
        state => state.loggedIn,
    );