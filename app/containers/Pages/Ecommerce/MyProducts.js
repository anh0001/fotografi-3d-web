import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import history from 'utils/history';
import { v4 as uuidv4 } from 'uuid';
// import { withStyles } from '@material-ui/core/styles';
import { getDate, getTime } from 'enl-components/helpers/dateTimeHelper';
import { Map } from 'immutable';
import {
  SearchProduct,
  ProductGallery,
  Notification,
  AddNewProduct,
} from 'enl-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import reducer from './reducers/ecommerceReducers';
import saga from './reducers/ecommerceSagas';

import { firebase } from '../../../firebase';

import {
  fetchAction,
  removeAction,
  checkoutAction,
  detailAction,
  searchAction,
  closeNotifAction,
  createNewProductAction,
  openAddNewProductAction,
  closeAddNewProductFormAction,
} from './reducers/ecommerceActions';


class MyProducts extends React.Component {
  state = {
    listView: 'grid',
  }

  componentDidMount() {
    const {
      user,
    } = this.props;

    if (user && user.userId) {
      this.listUserProducts();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      user,
    } = this.props;

    if (user && user !== prevProps.user) {
      this.listUserProducts();
    }
  }

  handleSwitchView = (event, value) => {
    this.setState({
      listView: value
    });
  }

  handleClickEditButton = (product) => {
    const {
      user,
      showDetailHandler,
    } = this.props;

    showDetailHandler(product);
    const path = '/app/' + user.username + '/products/editproduct';
    history.push(path);
  };

  addNewProduct = (items) => {
    const {
      user,
      createNewProduct,
      closeAddNewProductFormHandler
    } = this.props;

    // Replace spaces with dashes and make all letters lower-case
    const uuidStr = uuidv4().split('-'); // only get the first word
    const productId = items.get('product_name').replace(/\s+/g, '-').toLowerCase() + '-' + uuidStr[0];

    const newProduct = Map({
      userId: user.userId,
      username: user.username,
      labUsername: '',
      icon: 'description',
      createdDate: getDate(),
      createdTime: getTime(),
      avatar: user.avatar,
      productId,
      productName: items.get('product_name'),
      productDescription: items.get('product_description'),
      productPrice: parseInt(items.get('product_price'), 10),
      productPrevPrice: parseInt(items.get('product_price'), 10),
      discount: '',
      sold: 0,
      views: 0,
      availableQty: parseInt(items.get('available_qty'), 10),
      rating: 0,
      imageFiles: items.get('imageFiles'),
    });

    createNewProduct(newProduct);
    closeAddNewProductFormHandler();
  }

  listUserProducts() {
    const {
      user,
      fetchDataHandler
    } = this.props;

    try {
      firebase.getProductsUsingUsername(user.username)
        .then(resp => {
          fetchDataHandler(resp);
        });
    } catch (error) {
      console.log('MyProducts-listUserProducts', error);
    }
  }

  render() {
    const title = brand.name + ' - Ecommerce';
    const description = brand.desc;
    const { listView } = this.state;
    const {
      user,
      dataProducts,
      removeItem,
      checkout,
      showDetailHandler,
      openAddNewProductHandler,
      setOpenAddNewProductForm,
      closeAddNewProductFormHandler,
      productIndex,
      totalItems,
      totalPrice,
      search,
      keyword,
      closeNotif,
      messageNotif
    } = this.props;

    // console.log('dataProducts: ', dataProducts);

    return (user) ? (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Notification close={() => closeNotif()} message={messageNotif} />
        <SearchProduct
          dataCart={null}
          dataProduct={dataProducts}
          removeItem={removeItem}
          checkout={checkout}
          totalItems={totalItems}
          totalPrice={totalPrice}
          search={search}
          keyword={keyword}
          listView={listView}
          handleSwitchView={this.handleSwitchView}
        />
        {dataProducts && dataProducts.size
          ? (
            <ProductGallery
              listView={listView}
              dataProduct={dataProducts}
              showDetail={showDetailHandler}
              handleAddToCart={null}
              noCart
              noEditButton={false}
              productIndex={productIndex}
              keyword={keyword}
              handleClickEditButton={this.handleClickEditButton}
            />
          )
          : null}
        {user ? (
          <AddNewProduct
            openAddNewProduct={openAddNewProductHandler}
            openForm={setOpenAddNewProductForm}
            closeForm={closeAddNewProductFormHandler}
            submit={this.addNewProduct}
          />
        ) : null}
      </div>

    ) : (
      <div>
        <CircularProgress />
      </div>
    );
  }
}

MyProducts.propTypes = {
  fetchDataHandler: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  showDetailHandler: PropTypes.func,
  checkout: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  dataProducts: PropTypes.object,
  // dataCart: PropTypes.object.isRequired,
  productIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  user: PropTypes.object,
  openAddNewProductHandler: PropTypes.func.isRequired,
  setOpenAddNewProductForm: PropTypes.bool.isRequired,
  closeAddNewProductFormHandler: PropTypes.func.isRequired,
  createNewProduct: PropTypes.func.isRequired,
  // updateNotificationHandler: PropTypes.func,
};

MyProducts.defaultProps = {
  dataProducts: null,
  showDetailHandler: null,
  // updateNotificationHandler: null,
  user: null,
};

const authReducerKey = 'authReducer';
const reducerKey = 'ecommerceReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  force: state, // force state from reducer
  keyword: state.getIn([reducerKey, 'keywordValue']),
  dataProducts: state.getIn([reducerKey, 'dataProducts']),
  dataCart: state.getIn([reducerKey, 'cart']),
  productIndex: state.getIn([reducerKey, 'productIndex']),
  totalItems: state.getIn([reducerKey, 'totalItems']),
  totalPrice: state.getIn([reducerKey, 'totalPrice']),
  messageNotif: state.getIn([reducerKey, 'notifMsg']),
  user: state.get(authReducerKey).user,
  setOpenAddNewProductForm: state.getIn([reducerKey, 'setOpenAddNewProduct']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchDataHandler: bindActionCreators(fetchAction, dispatch),
  search: bindActionCreators(searchAction, dispatch),
  removeItem: bindActionCreators(removeAction, dispatch),
  showDetailHandler: bindActionCreators(detailAction, dispatch),
  checkout: () => dispatch(checkoutAction),
  closeNotif: () => dispatch(closeNotifAction),
  openAddNewProductHandler: () => dispatch(openAddNewProductAction),
  closeAddNewProductFormHandler: () => dispatch(closeAddNewProductFormAction),
  createNewProduct: bindActionCreators(createNewProductAction, dispatch),
});

const withReducer = injectReducer({ key: reducerKey, reducer });
const withSaga = injectSaga({ key: sagaKey, saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  // withStyles(styles),
)(MyProducts);
