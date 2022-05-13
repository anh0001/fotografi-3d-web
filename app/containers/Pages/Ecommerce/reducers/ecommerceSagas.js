import {
  call, put, takeLatest, takeEvery
} from 'redux-saga/effects';
import { firebase } from '../../../../firebase';
import {
  CREATE_NEW_PRODUCT,
  DELETE_PRODUCT,
  GET_USER_PRODUCTS,
  GET_PRODUCTS,
  EDIT_PRODUCT,
  UPDATE_LONG_DESCRIPTION_PRODUCT,
} from './ecommerceConstants';
import {
  mergeDataProductsAction,
  getUserProductsSuccessAction,
  getProductsSuccessAction,
} from './ecommerceActions';

function* createNewProductSaga({ product }) {
  try {
    const newProduct = product.toJS();

    const urls = yield call(firebase.storeImages,
      'allproducts/' + newProduct.username + '/' + newProduct.productId + '/descImages',
      newProduct.imageFiles);
    const newItem = {
      ...newProduct,
      imageFiles: urls,
      thumbnail: urls[0],
    };
    yield call(firebase.newProduct, newProduct.userId, newProduct.productId, newItem);
    yield put(mergeDataProductsAction(newItem));
    console.log('Add new product done.');
  } catch (error) {
    console.log(error);
  }
}

function* editProductSaga({ userUid, item }) {
  try {
    const { productId } = item;
    // console.log('productid: ', productId);
    const urls = yield call(firebase.storeImages, 'allproducts/' + userUid + '/' + productId, item.imageFiles);
    // console.log('urls: ', urls);
    const newItem = {
      ...item,
      imageFiles: urls,
      thumbnail: urls[0],
    };
    yield call(firebase.editProduct, userUid, productId, newItem);
    console.log('Edit product done.');
  } catch (error) {
    console.log(error);
  }
}

function* getUserProductsSaga({ userUid, lastRef }) {
  try {
    // console.log('userid: ', userUid);
    // console.log('lastRef: ', lastRef);
    const result = yield call(firebase.getUserProducts, userUid, lastRef);
    // console.log('result: ', result);

    yield put(getUserProductsSuccessAction({
      products: result.products,
      lastKeyRef: result.lastKey ? result.lastKey : null,
      total: result.total ? result.total : 0
    }));
  } catch (error) {
    console.log(error);
  }
}

function* getProductsSaga({ lastRef }) {
  try {
    // console.log('lastRef: ', lastRef);
    const result = yield call(firebase.getProducts, lastRef);
    // console.log('result: ', result);

    yield put(getProductsSuccessAction({
      products: result.products,
      lastKeyRef: result.lastKey ? result.lastKey : null,
      total: result.total ? result.total : 0
    }));
  } catch (error) {
    console.log(error);
  }
}

function* updateLongDescriptionProductSaga({ userUid, item }) {
  try {
    yield call(firebase.editProduct, userUid, item.productId, item);
    // console.log('Update long description product done.');
  } catch (error) {
    console.log(error);
  }
}

function* deleteProductSaga({ userId, username, productId }) {
  try {
    yield call(firebase.removeProduct, userId, username, productId);
  } catch (error) {
    console.log(error);
  }
}

//= ====================================
//  WATCHERS
//-------------------------------------

export default function* ecommerceRootSaga() {
  yield takeEvery(CREATE_NEW_PRODUCT, createNewProductSaga);
  yield takeEvery(DELETE_PRODUCT, deleteProductSaga);
  yield takeLatest(GET_USER_PRODUCTS, getUserProductsSaga);
  yield takeLatest(GET_PRODUCTS, getProductsSaga);
  yield takeEvery(EDIT_PRODUCT, editProductSaga);
  yield takeEvery(UPDATE_LONG_DESCRIPTION_PRODUCT, updateLongDescriptionProductSaga);
}
