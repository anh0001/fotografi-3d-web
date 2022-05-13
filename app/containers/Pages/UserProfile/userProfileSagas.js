import {
    call, fork, put, take, takeLatest, takeEvery
} from 'redux-saga/effects';
import { firebase } from '../../../firebase';
import history from '../../../utils/history';
import {
    GET_USER_PROFILE,
    UPDATE_USER_PROFILE
} from './userProfileConstants';
import {
    getUserProfileSuccess,
    getUserProfileError,
    updateUserProfileError
} from './userProfileActions';

function* getUserProfileSaga( {userUid} ) {
    try {
        const snapshot = yield call(firebase.getUser, userUid);
        if (snapshot.exists) {
            // console.log('data: ' + snapshot.data().description);
            yield put(getUserProfileSuccess(snapshot.data()));
        } else
            console.log('getUserProfileSaga: snapshot does not exist');
        
    } catch (error) {
        // console.log(error);
        yield put(getUserProfileError(error));
    }
}

function* updateUserProfileSaga( {userUid, updates} ) {
    try {
        // console.log('useruid: ' + userUid);
        // console.log(updates);
        const avatarURL = yield call(firebase.storeImage, userUid, 'avatar', updates.avatar)
        const newUpdates = { ...updates, avatar: avatarURL };
        yield call(firebase.updateProfile, userUid, newUpdates);
    } catch (error) {
        console.log(error);
        yield put(updateUserProfileError(error));
    }
}

//= ====================================
//  WATCHERS
//-------------------------------------

export default function* userProfileRootSaga() {
    yield takeLatest(GET_USER_PROFILE, getUserProfileSaga);
    yield takeEvery(UPDATE_USER_PROFILE, updateUserProfileSaga);
}