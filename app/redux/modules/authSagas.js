import {
  call, fork, put, take, takeEvery, all
} from 'redux-saga/effects';
import { firebaseAuth, firebase } from '../../firebase';
import history from '../../utils/history';
import {
  LOGIN_REQUEST,
  LOGIN_WITH_EMAIL_REQUEST,
  LOGOUT_REQUEST,
  REGISTER_WITH_EMAIL_REQUEST,
  REGISTER_WITH_EMAIL_SUCCESS,
  PASSWORD_FORGET_REQUEST,
} from '../constants/authConstants';
import {
  loginSuccess,
  loginFailure,
  logoutSuccess,
  logoutFailure,
  loginWithEmailSuccess,
  loginWithEmailFailure,
  syncUser,
  registerWithEmailSuccess,
  registerWithEmailFailure,
  createUserSuccess,
  createUserFailure,
  usernameAlreadyExist,
  passwordForgetSuccess,
  passwordForgetFailure,
} from '../actions/authActions';

function getUrlVars() {
  const vars = {};
  const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { // eslint-disable-line
    vars[key] = value;
  });
  return vars;
}

function* loginSaga(provider) {
  try {
    const data = yield call(firebaseAuth.signInWithPopup, provider.payload.authProvider);
    yield put(loginSuccess(data));
    if (getUrlVars().next) {
      // Redirect to next route
      yield history.push(getUrlVars().next);
    } else {
      // Redirect to dashboard if no next parameter
      yield history.push('/app');
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

function* loginWithEmailSaga(payload) {
  try {
    const data = yield call(firebaseAuth.signInWithEmailAndPassword, payload.email, payload.password);
    yield put(loginWithEmailSuccess(data));

    const snapshot = yield call(firebase.getUser, data.user.uid);
    if (snapshot.exists) {
      yield call(firebaseAuth.updateProfile, {
        displayName: snapshot.data().fullname,
        photoURL: snapshot.data().avatar,
      });
    } else console.log('loginWithEmailSaga: snapshot does not exist');

    if (snapshot.data().username) yield history.push('/app/' + snapshot.data().username);
    else yield history.push('/app');
  } catch (error) {
    yield put(loginWithEmailFailure(error));
  }
}

function* registerWithEmailSaga(payload) {
  try {
    const usernameExist = yield call(firebase.isUsernameExist, payload.username);
    if (!usernameExist) {
      const ref = yield call(firebaseAuth.createUserWithEmailAndPassword, payload.email, payload.password);
      const fullname = payload.name.split(' ').map(name => name[0].toUpperCase().concat(name.substring(1))).join(' ');
      yield call(firebaseAuth.updateProfile, {
        displayName: fullname,
      });
      const credential = {
        username: payload.username,
        fullname,
        name: fullname,
        uid: ref.user.uid,
        email: payload.email,
        userType: payload.usertype,
        avatar: ref.user.photoURL,
        dateJoined: ref.user.metadata.creationTime || new Date().getTime()
      };

      yield put(registerWithEmailSuccess(credential));
      // Redirect to dashboard
      yield history.push('/app/' + credential.username);
    } else {
      const error = {
        message: 'Username already exist',
      };
      yield put(usernameAlreadyExist(error));
    }
  } catch (error) {
    yield put(registerWithEmailFailure(error));
  }
}

function* logoutSaga() {
  try {
    const data = yield call(firebaseAuth.signOut);
    yield put(logoutSuccess(data));
    // Redirect to home
    yield history.replace('/');
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

function* syncUserSaga() {
  const channel = yield call(firebaseAuth.channel);
  while (true) {
    const { user } = yield take(channel);
    if (user) {
      const snapshot = yield call(firebase.getUser, user.uid);
      if (snapshot.exists) {
        yield put(syncUser({ ...snapshot.data() }));
      } else {
        yield put(syncUser(user));
      }
    } else {
      yield put(syncUser(null));
    }
  }
}

function* createUserSaga({ credential }) {
  try {
    const user = {
      username: credential.username,
      userId: credential.uid,
      fullname: credential.fullname,
      name: credential.name,
      avatar: credential.avatar,
      banner: '',
      email: credential.email,
      address: '',
      mobile: {},
      userType: credential.userType,
      description: '',
      birthDate: '',
      location: '',
      dateJoined: credential.dateJoined
    };

    yield call(firebase.addUser, credential.uid, user);
    yield put(createUserSuccess(credential));
  } catch (error) {
    yield put(createUserFailure(error));
  }
}

function* passwordForgetSaga({ email }) {
  try {
    yield call(firebaseAuth.sendPasswordResetEmail, email);
    yield put(passwordForgetSuccess());
  } catch (error) {
    yield put(passwordForgetFailure(error));
  }
}


//= ====================================
//  WATCHERS
//-------------------------------------

function* loginRootSaga() {
  yield fork(syncUserSaga);
  yield all([
    takeEvery(LOGIN_REQUEST, loginSaga),
    takeEvery(LOGIN_WITH_EMAIL_REQUEST, loginWithEmailSaga),
    takeEvery(REGISTER_WITH_EMAIL_REQUEST, registerWithEmailSaga),
    takeEvery(REGISTER_WITH_EMAIL_SUCCESS, createUserSaga),
    takeEvery(LOGOUT_REQUEST, logoutSaga),
    takeEvery(PASSWORD_FORGET_REQUEST, passwordForgetSaga)
  ]);
}

const authSagas = [
  fork(loginRootSaga),
];

export default authSagas;
