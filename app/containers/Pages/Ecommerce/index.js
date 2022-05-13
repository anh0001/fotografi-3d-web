import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { SearchProduct, ProductGallery, Notification } from 'enl-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import reducer from './reducers/ecommerceReducers';
import saga from './reducers/ecommerceSagas';

import {
  // fetchAction,
  addAction,
  removeAction,
  checkoutAction,
  detailAction,
  searchAction,
  closeNotifAction,
  getProductsAction,
} from './reducers/ecommerceActions';


class Ecommerce extends React.Component {
  state = {
    listView: 'grid',
  }

  componentDidMount() {
    const { getProducts } = this.props;

    getProducts(null);
  }

  handleSwitchView = (event, value) => {
    this.setState({
      listView: value
    });
  }

  render() {
    const title = brand.name + ' - Ecommerce';
    const description = brand.desc;
    const { listView } = this.state;
    const {
      user,
      dataProducts,
      handleAddToCart,
      dataCart,
      removeItem,
      checkout,
      showDetailHandler,
      productIndex,
      totalItems,
      totalPrice,
      search,
      keyword,
      closeNotif,
      messageNotif
    } = this.props;
    return user ? (
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
          dataCart={dataCart}
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
        {dataProducts && dataProducts.size ? (
          <ProductGallery
            listView={listView}
            dataProduct={dataProducts}
            showDetail={showDetailHandler}
            handleAddToCart={handleAddToCart}
            productIndex={productIndex}
            keyword={keyword}
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

Ecommerce.propTypes = {
  user: PropTypes.object,
  // fetchData: PropTypes.func.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  showDetailHandler: PropTypes.func.isRequired,
  checkout: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  dataProducts: PropTypes.object.isRequired,
  dataCart: PropTypes.object.isRequired,
  productIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  getProducts: PropTypes.func.isRequired,
};

Ecommerce.defaultProps = {
  // updateNotificationHandler: null,
  user: null,
};

const authReducerKey = 'authReducer';
const reducerKey = 'ecommerceReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  force: state, // force state from reducer
  user: state.get(authReducerKey).user,
  keyword: state.getIn([reducerKey, 'keywordValue']),
  dataProducts: state.getIn([reducerKey, 'dataProducts']),
  dataCart: state.getIn([reducerKey, 'cart']),
  productIndex: state.getIn([reducerKey, 'productIndex']),
  totalItems: state.getIn([reducerKey, 'totalItems']),
  totalPrice: state.getIn([reducerKey, 'totalPrice']),
  messageNotif: state.getIn([reducerKey, 'notifMsg']),
});

const mapDispatchToProps = dispatch => ({
  // fetchData: bindActionCreators(fetchAction, dispatch),
  search: bindActionCreators(searchAction, dispatch),
  handleAddToCart: bindActionCreators(addAction, dispatch),
  removeItem: bindActionCreators(removeAction, dispatch),
  showDetailHandler: bindActionCreators(detailAction, dispatch),
  checkout: () => dispatch(checkoutAction),
  closeNotif: () => dispatch(closeNotifAction),
  getProducts: bindActionCreators(getProductsAction, dispatch),
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
)(Ecommerce);
