import React from 'react';
import { injectIntl } from 'react-intl';
import messages from './messages';
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Rating from 'react-rating'
import './style.scss'

const SingleProduct = ({ name, badge, rating, image, author, review, price, id }) => {
    return (
        <Grid className="productWrap">
            <Grid className="productImg">
                <Link to={`/product-details/${id}`}>
                    <img src={image} alt="" />
                </Link>
                <span className={
                    `badge ${
                    badge === 'trending' && 'trending' ||
                    badge === 'featured' && 'featured' ||
                    badge === 'new' && 'new'
                    }`

                }>{badge}</span>
            </Grid>
            <Grid className="productContent">
                <h3>
                    <Link to={`/product-details/${id}`}> {name} </Link>
                </h3>
                <span className="author">By <Link to='/author'>{author}</Link></span>
                <span className="rating">
                    <Rating
                        className="ratingIcon"
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        initialRating={rating}
                        readonly
                    />
                    <span className="review">({review})</span>
                </span>
                <div className="productAction">
                    <h4>{price}</h4>
                    <ul>
                        <li><Button component={Link} to={`/product-details/${id}`}>Preview</Button></li>
                        <li><Button><i className="flaticon-shopping-cart fi"></i></Button></li>
                    </ul>
                </div>
            </Grid>
        </Grid>
    );
}


export default injectIntl(SingleProduct)
