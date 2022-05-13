import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Comments from './Comments';
import styles from './jss/timeline-jss';
import articleStatus from 'enl-api/apps/articleStatus';

import Editor from 'enl-components/DanteEditor/components/Dante';
import EditorTheme from './EditorTheme';

const optionsOpt = [
  'Option 1',
  'Option 2',
  'Option 3',
];

const ITEM_HEIGHT = 48;

class Timeline extends React.Component {
  state = {
    anchorElOpt: null,
    openComment: false,
    selectedArticleData: null,
  };

  handleClickOpt = (event, curContent) => {
    this.setState({
      anchorElOpt: event.currentTarget,
      selectedArticleData: curContent,
    });
  };

  handleClickLearnMore = (event, curContent) => {
    this.setState({
      anchorElOpt: event.currentTarget,
      selectedArticleData: curContent,
    });
  };

  handleCloseOpt = (event, item, curContent) => {
    this.setState({ anchorElOpt: null });
    this.props.ClickOptionsHandler(item, curContent);
  };

  handleOpenComment = (data) => {
    const { fetchComment } = this.props;
    fetchComment(data);
    this.setState({ openComment: true });
  };

  handleCloseComment = () => {
    this.setState({ openComment: false });
  };

  render() {
    const {
      classes,
      dataTimeline,
      onlike,
      commentIndex,
      submitComment,
      userType,
    } = this.props;
    const listOptions = this.props.optionsOpt || optionsOpt;
    const { anchorElOpt, openComment, selectedArticleData } = this.state;

    const getItem = dataArray => dataArray.map(data => {
      const content = JSON.parse(data.get('content'));
      const renderedData = {
        blocks: content.blocks.slice(0, 2),  // show only two blocks
        entityMap: content.entityMap,
      };
      return (
        <li key={data.get('articleId')}>
          <div className={classes.iconBullet}>
            <Tooltip id={'tooltip-icon-' + data.get('articleId')} title={data.get('date') + ' ' + data.get('time')}>
              <Icon className={classes.icon}>
                {data.get('icon')}
              </Icon>
            </Tooltip>
          </div>
          <Card className={classes.cardSocmed}>
            <CardHeader
              avatar={
                <Avatar alt="avatar" src={data.get('avatar')} className={classes.avatar} />
              }
              action={(
                <IconButton
                  aria-label="More"
                  aria-owns={anchorElOpt ? 'long-menu' : null}
                  aria-haspopup="true"
                  className={classes.button}
                  onClick={(event) => this.handleClickOpt(event, data)}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              title={data.get('title')}
              subheader={data.get('status')}
            />
            <CardContent>
              <Editor
                content={renderedData}
                style={{
                  margin: '0 auto',
                  width: '80%',
                }}
                theme={EditorTheme}
                read_only={true}
              />
            </CardContent>
            <CardActions className={classes.actions}>
              {/* <IconButton aria-label="Like this" onClick={() => onlike(data)}>
              <FavoriteIcon className={data.get('liked') ? classes.liked : ''} />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <div className={classes.rightIcon}>
              <Typography variant="caption" component="span">
                {data.get('comments') !== undefined ? data.get('comments').size : 0}
              </Typography>
              <IconButton aria-label="Comment" onClick={() => this.handleOpenComment(data)}>
                <CommentIcon />
              </IconButton>
            </div> */}
              {(data.get('status') === articleStatus.waiting_confirmation) && (userType !== 'Personal') ?
                <Button size="small" onClick={(event) => this.props.clickConfirmHandler(event, data)}>Confirm</Button>
                : null}
              {(data.get('status') !== articleStatus.published) && (userType === 'Personal') ?
                <Button size="small" onClick={(event) => this.props.clickRequestConfirmationHandler(event, data)}>Request Confirmation</Button>
                : null}
              <Button size="small" onClick={(event) => this.props.clickLearnMoreHandler(event, data)}>Learn More</Button>
            </CardActions>
          </Card>
        </li>
      )
    });
    return (
      <Fragment>
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
          {listOptions.map(option => (
            <MenuItem key={option} onClick={(event) => this.handleCloseOpt(event, option, selectedArticleData)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
        {/* <Comments
          open={openComment}
          handleClose={this.handleCloseComment}
          submitComment={submitComment}
          dataComment={dataTimeline.getIn([commentIndex, 'comments'])}
        /> */}
        <ul className={classes.timeline}>
          {getItem(dataTimeline)}
        </ul>
      </Fragment>
    );
  }
}

Timeline.propTypes = {
  classes: PropTypes.object.isRequired,
  dataTimeline: PropTypes.object.isRequired,
  optionsOpt: PropTypes.array,
  ClickOptionsHandler: PropTypes.func.isRequired,
  clickLearnMoreHandler: PropTypes.func.isRequired,
  clickConfirmHandler: PropTypes.func,
  clickRequestConfirmationHandler: PropTypes.func,
  onlike: PropTypes.func,
  fetchComment: PropTypes.func,
  submitComment: PropTypes.func,
  commentIndex: PropTypes.number,
  userType: PropTypes.string,
};

Timeline.defaultProps = {
  onlike: () => (false),
  fetchComment: () => { },
  submitComment: () => { },
  commentIndex: 0,
  userType: 'Personal',
};

export default withStyles(styles)(Timeline);
