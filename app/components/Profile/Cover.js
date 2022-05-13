import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Info from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './cover-jss';

const optionsOpt = [{
  name: 'Edit Profile',
  link: '/app/home/edit-profile',
},
{
  name: 'Change Cover',
  link: '/app/home/change-cover',
},
];

const ITEM_HEIGHT = 48;

class Cover extends React.Component {
  state = {
    anchorElOpt: null,
  };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = (e) => {
    this.setState({ anchorElOpt: null });
  };

  render() {
    const {
      classes,
      avatar,
      name,
      desc,
      coverImg,
    } = this.props;
    const { anchorElOpt } = this.state;
    return (
      <div className={classes.cover} style={{ backgroundImage: `url(${coverImg})` }}>
        <div className={classes.opt}>
          <IconButton className={classes.button} aria-label="Delete">
            <Info />
          </IconButton>
          <IconButton
            aria-label="More"
            aria-owns={anchorElOpt ? 'long-menu' : null}
            aria-haspopup="true"
            className={classes.button}
            onClick={this.handleClickOpt}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorElOpt}
            open={Boolean(anchorElOpt)}
            onClose={this.handleCloseOpt}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}
          >
            {optionsOpt.map(option => (
              <MenuItem key={option.name} selected={option.name === 'Edit Profile'} onClick={this.handleCloseOpt} component={Link} to={option.link}>
                {option.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className={classes.content}>
          <Avatar alt={name} src={avatar} className={classes.avatar} />
          <Typography variant="h4" className={classes.name} gutterBottom>
            {name}
            <VerifiedUser className={classes.verified} />
          </Typography>
          <Typography className={classes.subheading} gutterBottom>
            {desc}
          </Typography>
          <Button className={classes.button} size="large" variant="contained" color="secondary">
            <FormattedMessage {...messages.add_to_connection} />
          </Button>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  classes: PropTypes.object.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
};

export default withStyles(styles)(injectIntl(Cover));
