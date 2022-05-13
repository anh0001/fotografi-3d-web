// import { Record } from 'immutable';
import {
    GET_USER_PROFILE,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_ERROR,
    UPDATE_USER_PROFILE,
    UPDATE_USER_PROFILE_ERROR
} from './userProfileConstants';

export const initialState = {
    loading: false,
    uid: null,
    message: null,
    userProfile: null
};

export default function userProfileReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_USER_PROFILE:
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                loading: true,
                message: null,
                uid: action.userUid
            };

        case GET_USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                message: null,
                userProfile: action.userData
            };

        case GET_USER_PROFILE_ERROR:
        case UPDATE_USER_PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                message: action.error.message
            };

        default:
            return state;
    }
}
