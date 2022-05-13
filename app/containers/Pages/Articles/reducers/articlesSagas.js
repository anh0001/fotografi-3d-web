import {
    call, fork, put, take, takeLatest, takeEvery
} from 'redux-saga/effects';
import { firebase } from '../../../../firebase';
import history from '../../../../utils/history';
import {
    UPDATE_CONTENT_ARTICLE,
    CREATE_NEW_ARTICLE,
    DELETE_ARTICLE,
} from './articlesConstants';
import {
    createNewArticleSuccessAction,
} from './articlesActions';

function* updateContentArticleSaga({ payload }) {
    try {
        yield call(firebase.editArticle, payload.userId, payload.articleId, payload);
        // console.log('Update long description product done.');
    } catch (error) {
        console.log(error);
    }
}

function* createNewArticleSaga({ article }) {
    try {
        yield call(firebase.newArticle, article.userId, article.articleId, article);
        yield put(createNewArticleSuccessAction(article));
        // console.log('createNewArticleSaga: New db record is created ', article.articleId);

    } catch (error) {
        console.log(error);
    }
}

function* deleteArticleSaga({ userId, username, articleId }) {
    try {
        // console.log('article: ', article);
        yield call(firebase.removeArticle, userId, username, articleId);
        // console.log('deleteArticleSaga: db record is deleted ', articleId);

    } catch (error) {
        console.log(error);
    }
}

//= ====================================
//  WATCHERS
//-------------------------------------

export default function* ecommerceRootSaga() {
    yield takeEvery(UPDATE_CONTENT_ARTICLE, updateContentArticleSaga);
    yield takeEvery(CREATE_NEW_ARTICLE, createNewArticleSaga);
    yield takeEvery(DELETE_ARTICLE, deleteArticleSaga);
}