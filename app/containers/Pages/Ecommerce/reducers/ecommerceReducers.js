import { fromJS, List, Map } from 'immutable';
import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from 'enl-redux/constants/notifConstants';
import {
  FETCH_DATA_PRODUCTS,
  MERGE_DATA_PRODUCTS,
  ADD_TO_CART,
  DELETE_CART_ITEM,
  CHECKOUT,
  SHOW_DETAIL_PRODUCT,
  SEARCH_PRODUCT,
  GET_USER_PRODUCTS_SUCCESS,
  GET_PRODUCTS_SUCCESS,
  OPEN_ADD_NEW_PRODUCT,
  CLOSE_ADD_NEW_PRODUCT_FORM,
} from './ecommerceConstants';

const initialState = {
  dataProducts: List([]),
  cart: List([]),
  lastKeyRef: null,
  totalItems: 0,
  totalPrice: 0,
  productIndex: 0,
  keywordValue: '',
  notifMsg: '',
  setOpenAddNewProduct: false,
};

let itemId = [];

const initialImmutableState = fromJS(initialState);
export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case FETCH_DATA_PRODUCTS:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataProducts', items);
      });
    case MERGE_DATA_PRODUCTS:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.update('dataProducts', dataProducts => dataProducts.push(items));
      });
    case SEARCH_PRODUCT:
      return state.withMutations((mutableState) => {
        action.keyword.persist();
        const keyword = action.keyword.target.value.toLowerCase();
        mutableState.set('keywordValue', keyword);
      });
    case ADD_TO_CART:
      return state.withMutations((mutableState) => {
        const item = fromJS(action.item);
        const qty = Number(item.get('quantity'));
        const price = item.get('price');
        const index = itemId.indexOf(action.item.id);
        if (index > -1) {
          // If item already added to cart
          mutableState.update('cart', cart => cart.setIn(
            [index, 'quantity'],
            state.getIn(['cart', index, 'quantity']) + qty
          ));
        } else {
          // item not exist in cart
          itemId.push(action.item.id);
          mutableState.update('cart', cart => cart.push(item));
        }
        mutableState
          .set('totalItems', state.get('totalItems') + qty)
          .set('totalPrice', state.get('totalPrice') + (price * qty))
          .set('notifMsg', notif.addCart);
      });
    case DELETE_CART_ITEM:
      return state.withMutations((mutableState) => {
        const index = state.get('cart').indexOf(action.item);
        const qty = Number(action.item.get('quantity'));
        const price = action.item.get('price');
        itemId = itemId.filter(item => item !== action.item.get('id'));
        mutableState
          .update('cart', cart => cart.splice(index, 1))
          .set('totalItems', state.get('totalItems') - qty)
          .set('totalPrice', state.get('totalPrice') - (price * qty))
          .set('notifMsg', notif.removed);
      });
    case CHECKOUT:
      itemId = [];
      return state.withMutations((mutableState) => {
        mutableState
          .set('cart', List([]))
          .set('totalItems', 0)
          .set('totalPrice', 0)
          .set('notifMsg', notif.checkout);
      });
    case SHOW_DETAIL_PRODUCT:
      return state.withMutations((mutableState) => {
        const index = state.get('dataProducts').indexOf(action.item);
        mutableState.set('productIndex', index);
      });
    case OPEN_ADD_NEW_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState
          .set('setOpenAddNewProduct', true);
      });
    case CLOSE_ADD_NEW_PRODUCT_FORM:
      return state.withMutations((mutableState) => {
        mutableState
          .set('setOpenAddNewProduct', false);
      });
    case CLOSE_NOTIF:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', '');
      });
    case GET_USER_PRODUCTS_SUCCESS:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState
          .set('dataProducts', items.get('products'))
          .set('lastKeyRef', items.get('lastKeyRef'));
      });
    case GET_PRODUCTS_SUCCESS:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState
          .set('dataProducts', items.get('products'))
          .set('lastKeyRef', items.get('lastKeyRef'));
      });
    default:
      return state;
  }
}
