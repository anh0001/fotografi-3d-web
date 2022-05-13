import * as notification from 'enl-redux/constants/notifConstants';
import * as types from './ecommerceConstants';

export const fetchAction = items => ({
  type: types.FETCH_DATA_PRODUCTS,
  items,
});

export const mergeDataProductsAction = items => ({
  type: types.MERGE_DATA_PRODUCTS,
  items,
});

export const searchAction = keyword => ({
  type: types.SEARCH_PRODUCT,
  keyword,
});

export const addAction = item => ({
  type: types.ADD_TO_CART,
  item,
});

export const removeAction = item => ({
  type: types.DELETE_CART_ITEM,
  item,
});

export const checkoutAction = ({
  type: types.CHECKOUT,
});

export const detailAction = item => ({
  type: types.SHOW_DETAIL_PRODUCT,
  item
});

export const closeNotifAction = {
  type: notification.CLOSE_NOTIF
};

export const openAddNewProductAction = {
  type: types.OPEN_ADD_NEW_PRODUCT,
};

export const closeAddNewProductFormAction = {
  type: types.CLOSE_ADD_NEW_PRODUCT_FORM,
};

export const createNewProductAction = (product) => ({
  type: types.CREATE_NEW_PRODUCT,
  product,
});

export const getUserProductsAction = (userUid, lastRef) => ({
  type: types.GET_USER_PRODUCTS,
  userUid,
  lastRef,
});

export const getUserProductsSuccessAction = (items) => ({
  type: types.GET_USER_PRODUCTS_SUCCESS,
  items,
});

export const getProductsAction = (lastRef) => ({
  type: types.GET_PRODUCTS,
  lastRef,
});

export const getProductsSuccessAction = (items) => ({
  type: types.GET_PRODUCTS_SUCCESS,
  items,
});

export const editProductAction = (userUid, item) => ({
  type: types.EDIT_PRODUCT,
  userUid,
  item,
});

export const updateLongDescriptionProductAction = (userUid, item) => ({
  type: types.UPDATE_LONG_DESCRIPTION_PRODUCT,
  userUid,
  item,
});
