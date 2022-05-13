import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import imgData from 'enl-api/images/imgData';
import styles from '../Profile/profile-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <Link to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

function ThumbnailWidget(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <ButtonBase
        focusRipple
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        component={LinkBtn}
        to="/app/pages/photo-gallery"
      >
        <ImageList rowHeight={160} className={classes.gridList} cols={3}>
          {imgData.map((tile, index) => {
            if (index > 6) {
              return false;
            }
            return (
              <ImageListItem key={index.toString()} cols={tile.cols || 1}>
                <img src={tile.img} className={classes.img} alt={tile.title} />
              </ImageListItem>
            );
          })}
        </ImageList>
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            className={classes.imageTitle}
          >
            Album Number One
            <span className={classes.imageMarked} />
          </Typography>
        </span>
      </ButtonBase>
    </div>
  );
}

ThumbnailWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ThumbnailWidget);
