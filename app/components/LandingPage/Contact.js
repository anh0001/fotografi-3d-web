import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import messages from './messages';
import Title from './Title';
import styles from './landingStyle-jss';

class Contact extends React.Component {
  state = {
    name: '',
    email: '',
    msg: ''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes, intl } = this.props;
    const { name, email, msg } = this.state;
    return (
      <div className={classes.contact}>
        <div className={classes.container}>
          <div className={classes.contactBubble}>
            <Title title={intl.formatMessage(messages.titleContact)} desc="Cras convallis lacus orci, tristique tincidunt magna consequat in." align="left" nomargin />
            <Grid container spacing={3}>
              <Grid item lg={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    id="standard-name"
                    label={intl.formatMessage(messages.nameContact)}
                    className={classes.textField}
                    value={name}
                    required
                    onChange={this.handleChange('name')}
                    margin="normal"
                    classes={{
                      root: classes.contactFieldRoot,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    id="standard-email"
                    label={intl.formatMessage(messages.emailContact)}
                    className={classes.textField}
                    value={email}
                    required
                    onChange={this.handleChange('email')}
                    margin="normal"
                    classes={{
                      root: classes.contactFieldRoot,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    id="standard-multiline-flexible"
                    label={intl.formatMessage(messages.messagesContact)}
                    multiline
                    rows="5"
                    value={msg}
                    onChange={this.handleChange('msg')}
                    className={classes.textField}
                    margin="normal"
                    classes={{
                      root: classes.contactFieldRoot,
                    }}
                  />
                </FormControl>
                <div className={classes.btnArea}>
                  <Button variant="contained" size="large" className={classes.button} color="secondary">
                    <FormattedMessage {...messages.sendContact} />
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(Contact));
