import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Type from 'enl-styles/Typography.scss';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './cardStyle-jss';

class ProductCard extends React.Component {
  render() {
    const {
      classes,
      discount,
      soldout,
      thumbnail,
      name,
      desc,
      price,
      prevPrice,
      list,
      detailOpen,
      addToCart,
      handleClickEditButton,
      noCart,
      noEditButton,
      width,
      intl
    } = this.props;
    return (
      <Card className={classNames(classes.cardProduct, isWidthUp('sm', width) && list ? classes.cardList : '')}>
        <div className={classes.status}>
          {discount !== '' && (
            <Chip label={'Discount ' + discount} className={classes.chipDiscount} />
          )}
          {soldout && (
            <Chip label="Sold Out" className={classes.chipSold} />
          )}
        </div>
        <CardMedia
          className={classes.mediaProduct}
          image={thumbnail}
          title={name}
        />
        <CardContent className={classes.floatingButtonWrap}>
          {!soldout && !noCart && (
            <Tooltip title={intl.formatMessage(messages.add_cart)} placement="top">
              <Fab onClick={addToCart} size="small" color="secondary" aria-label="add" className={classes.buttonAdd}>
                <AddShoppingCart />
              </Fab>
            </Tooltip>
          )}
          {!noEditButton && (
            <Tooltip title={"Edit"} placement="top">
              <Fab onClick={handleClickEditButton} size="small" color="secondary" aria-label="edit" className={classes.buttonAdd}>
                <EditIcon />
              </Fab>
            </Tooltip>
          )}
          <Typography noWrap gutterBottom variant="h5" className={classes.title} component="h2">
            {name}
          </Typography>
          <Typography component="p" className={classes.desc}>
            {desc}
          </Typography>
        </CardContent>
        <CardActions className={classes.price}>
          <Typography variant="h5">
            <span>
              Rp. 
              {price.toLocaleString()}
            </span>
          </Typography>
          {prevPrice > 0 && prevPrice != price && (
            <Typography variant="caption" component="h5">
              <span className={Type.lineThrought}>
                Rp. 
                {prevPrice.toLocaleString()}
              </span>
            </Typography>
          )}
          <div className={classes.rightAction}>
            <Button size="small" variant="outlined" color="secondary" onClick={detailOpen}>
              <FormattedMessage {...messages.see_detail} />
            </Button>
            {!soldout && (
              <Tooltip title="Add to cart" placement="top">
                <IconButton color="secondary" onClick={addToCart} className={classes.buttonAddList}>
                  <AddShoppingCart />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>
      </Card>
    );
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  discount: PropTypes.string,
  width: PropTypes.string.isRequired,
  soldout: PropTypes.bool,
  thumbnail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  prevPrice: PropTypes.number,
  list: PropTypes.bool,
  detailOpen: PropTypes.func,
  addToCart: PropTypes.func,
  handleClickEditButton: PropTypes.func,
  noCart: PropTypes.bool,
  noEditButton: PropTypes.bool,
  intl: intlShape.isRequired
};

ProductCard.defaultProps = {
  discount: '',
  soldout: false,
  prevPrice: 0,
  list: false,
  noCart: false,
  noEditButton: true,
  detailOpen: () => (false),
  addToCart: () => (false),
  handleClickEditButton: () => (false),
};

const ProductCardResponsive = withWidth()(ProductCard);
export default withStyles(styles)(injectIntl(ProductCardResponsive));