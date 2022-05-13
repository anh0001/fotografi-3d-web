import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from './todo-jss';

class TaskItem extends Component {
  constructor() {
    super(...arguments); // eslint-disable-line

    this.state = { editing: false, anchorEl: null, };

    this.edit = this.edit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.remove = this.remove.bind(this);
    this.save = this.save.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  edit() {
    this.setState({
      editing: true,
      anchorEl: null
    });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.save(event);
    } else if (event.keyCode === 27) {
      this.stopEditing();
    }
  }

  remove() {
    const { removeTask, task } = this.props;
    removeTask(task);
    this.setState({ anchorEl: null });
  }

  save(event) {
    const { editing } = this.state;
    const { updateTask } = this.props;
    if (editing) {
      const { task } = this.props;
      const title = event.target.value.trim();

      if (title.length && title !== task.title) {
        updateTask(task, { title });
      }

      this.stopEditing();
    }
  }

  stopEditing() {
    this.setState({ editing: false });
  }

  toggleStatus() {
    const { task, updateTask } = this.props;
    updateTask(task, { completed: !task.completed });
  }

  renderTitleInput(task) {
    return (
      <input
        autoFocus // eslint-disable-line
        autoComplete="off"
        defaultValue={task.title}
        maxLength="64"
        onKeyUp={this.handleKeyUp}
        type="text"
      />
    );
  }

  render() {
    const { editing, anchorEl } = this.state;
    const { task, classes } = this.props;
    const open = Boolean(anchorEl);
    const renderTitle = taskParam => (
      <div className={classNames(classes.taskTitle, task.completed && classes.completed)}>
        {taskParam.title}
      </div>
    );
    const containerClasses = classNames('task-item', {
      'task-item--completed': task.completed,
      'task-item--editing': editing
    });

    return (
      <Fragment>
        <ListItem
          role={undefined}
          dense
          className={
            classNames(
              containerClasses,
              classes.listItem,
            )
          }
        >
          <IconButton
            className={
              classNames(
                classes.button,
                task.completed && classes.completed,
                editing && classes.hide
              )
            }
            size="small"
            onClick={this.toggleStatus}
          >
            <CheckIcon />
          </IconButton>

          <Typography noWrap component="div" className={classes.text}>
            {editing ? this.renderTitleInput(task) : renderTitle(task)}
          </Typography>

          <ListItemSecondaryAction>
            <Hidden xsDown>
              <IconButton
                className={
                  classNames(
                    classes.button,
                    editing && classes.hide
                  )
                }
                size="small"
                onClick={this.edit}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className={
                  classNames(
                    classes.button,
                    editing && classes.hide
                  )
                }
                size="small"
                onClick={this.remove}
              >
                <DeleteIcon />
              </IconButton>
            </Hidden>
            <Hidden smUp>
              <IconButton
                aria-label="More"
                aria-owns={open ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
                className={editing ? classes.hide : ''}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.edit}>
                  Edit
                </MenuItem>
                <MenuItem onClick={this.remove}>
                  Remove
                </MenuItem>
              </Menu>
            </Hidden>
            <IconButton
              className={
                classNames(
                  classes.button,
                  !editing && classes.hide
                )
              }
              size="small"
              onClick={this.stopEditing}
            >
              <CancelIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </Fragment>
    );
  }
}

TaskItem.propTypes = {
  classes: PropTypes.object.isRequired,
  removeTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired
};


export default withStyles(styles)(TaskItem);
