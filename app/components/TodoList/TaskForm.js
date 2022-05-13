import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import styles from './todo-jss';

class TaskForm extends Component {
  constructor() {
    super(...arguments); // eslint-disable-line

    this.state = { title: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clearInput() {
    this.setState({ title: '' });
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleKeyUp(event) {
    if (event.keyCode === 27) this.clearInput();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const { handleSubmit } = this.props;
    const titleString = title.trim();
    if (titleString.length) handleSubmit(titleString);
    this.clearInput();
  }

  render() {
    const { classes, intl } = this.props;
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <FormControl fullWidth className={classes.addTask}>
          <Input
            autoComplete="off"
            maxLength="64"
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            placeholder={intl.formatMessage(messages.placeholder)}
            type="text"
            value={title}
            endAdornment={(
              <InputAdornment className={classes.hint} position="end">
                <Chip label={intl.formatMessage(messages.hint)} className={classes.chip} />
              </InputAdornment>
            )}
          />
          <p>
            Once you submit, its mean you have agreed with our
            &nbsp;
            <a href="/terms-conditions" target="_blank">
              terms &amp; conditions
            </a>
          </p>
        </FormControl>
      </form>
    );
  }
}

TaskForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(TaskForm));
