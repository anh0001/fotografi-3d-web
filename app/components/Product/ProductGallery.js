import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ProductCard from '../CardPaper/ProductCard';
import ProductDetail from './ProductDetail';

class ProductGallery extends React.Component {
  state = {
    open: false,
  }

  handleDetailOpen = (product) => {
    const { showDetail } = this.props;
    this.setState({ open: true });
    showDetail(product);
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render() {
    const { open } = this.state;
    const {
      dataProduct,
      handleAddToCart,
      handleClickEditButton,
      productIndex,
      keyword,
      listView,
      noCart,
      noEditButton,
    } = this.props;

    // console.log('dataproduct: ', dataProduct);

    return (
      <div>
        <ProductDetail
          open={open}
          close={this.handleClose}
          detailContent={dataProduct}
          productIndex={productIndex}
          handleAddToCart={handleAddToCart}
          noCart={noCart}
        />
        <Grid
          container
          alignItems="flex-start"
          justify="flex-start"
          direction="row"
          spacing={3}
        >
          {
            dataProduct.map((product, index) => {
              if (product.get('productName').toLowerCase().indexOf(keyword) === -1) {
                return false;
              }
              const itemAttr = {
                id: product.get('productId'),
                name: product.get('productName'),
                thumbnail: product.get('thumbnail'),
                price: product.get('productPrice'),
                quantity: 1
              };
              return (
                <Grid item md={listView === 'list' ? 12 : 4} sm={listView === 'list' ? 12 : 6} xs={12} key={index.toString()}>
                  <ProductCard
                    list={listView === 'list'}
                    name={product.get('productName')}
                    thumbnail={product.get('thumbnail')}
                    desc={product.get('productDescription')}
                    price={product.get('productPrice')}
                    prevPrice={product.get('productPrevPrice')}
                    discount={product.get('discount')}
                    soldout={product.get('availableQty') == 0}
                    detailOpen={() => this.handleDetailOpen(product)}
                    addToCart={() => handleAddToCart(itemAttr)}
                    noCart={noCart}
                    noEditButton={noEditButton}
                    handleClickEditButton={() => handleClickEditButton(product)}
                  />
                </Grid>
              );
            })
          }
        </Grid>
      </div>
    );
  }
}

ProductGallery.propTypes = {
  dataProduct: PropTypes.object.isRequired,
  handleAddToCart: PropTypes.func,
  handleClickEditButton: PropTypes.func,
  showDetail: PropTypes.func.isRequired,
  productIndex: PropTypes.number.isRequired,
  keyword: PropTypes.string.isRequired,
  listView: PropTypes.string.isRequired,
  noCart: PropTypes.bool,
  noEditButton: PropTypes.bool,
};

ProductGallery.defaultProps = {
  noCart: false,
  noEditButton: true,
};

export default ProductGallery;
