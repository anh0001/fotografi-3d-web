import {
    call, fork, put, take, takeLatest, takeEvery
} from 'redux-saga/effects';
import { firebase } from '../../../../firebase';
import history from '../../../../utils/history';
import {
    UPDATE_CONTENT_PROJECT,
    CREATE_NEW_PROJECT,
    DELETE_PROJECT,
} from './projectsConstants';
import {
    createNewProjectSuccessAction,
} from './projectsActions';

function* updateContentProjectSaga({ payload }) {
    try {
        yield call(firebase.editProject, payload.userId, payload.projectId, payload);
        // console.log('Update long description project done.');
    } catch (error) {
        console.log(error);
    }
}

function* createNewProjectSaga({ project }) {
    try {
        yield call(firebase.newProject, project.userId, project.projectId, project);
        yield put(createNewProjectSuccessAction(project));
        // console.log('createNewProjectSaga: New db record is created ', project.projectId);

    } catch (error) {
        console.log(error);
    }
}

function* deleteProjectSaga({ userId, username, projectId }) {
    try {
        // console.log('project: ', project);
        yield call(firebase.removeProject, userId, username, projectId);
        // console.log('deleteProjectSaga: db record is deleted ', projectId);

    } catch (error) {
        console.log(error);
    }
}

//= ====================================
//  WATCHERS
//-------------------------------------

export default function* projectsRootSaga() {
    yield takeEvery(UPDATE_CONTENT_PROJECT, updateContentProjectSaga);
    yield takeEvery(CREATE_NEW_PROJECT, createNewProjectSaga);
    yield takeEvery(DELETE_PROJECT, deleteProjectSaga);
}