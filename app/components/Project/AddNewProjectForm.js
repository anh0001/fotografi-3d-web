import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Map } from 'immutable';
import Type from 'enl-styles/Typography.scss';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@material-ui/core/FormLabel';
import PermContactCalendar from '@material-ui/icons/PermContactCalendar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Bookmark from '@material-ui/icons/Bookmark';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Email from '@material-ui/icons/Email';
import Smartphone from '@material-ui/icons/Smartphone';
import LocationOn from '@material-ui/icons/LocationOn';
import Work from '@material-ui/icons/Work';
import Language from '@material-ui/icons/Language';
import css from 'enl-styles/Form.scss';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  TextField as TextFieldRedux,
} from 'redux-form-material-ui-adapter';
import {
  DatePickerRedux,
  SelectRedux as SelectFieldRedux,
} from 'enl-components/Forms/ReduxFormMUI';
import messages from './messages';
import styles from './add-new-project-jss';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

class AddNewProjectForm extends React.Component {
  saveRef = ref => {
    this.ref = ref;
    return this.ref;
  };

  render() {
    const {
      classes,
      reset,
      pristine,
      submitting,
      handleSubmit,
      intl
    } = this.props;
    let dropzoneRef;
    const acceptedFiles = ['image/jpeg', 'image/png', 'image/bmp'];
    const fileSizeLimit = 100000;
    const imgPreview = img => {
      if (typeof img !== 'string' && img !== '') {
        return URL.createObjectURL(imgAvatar);
      }
      return img;
    };

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <section className={css.bodyForm}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={12}>
                <Field
                  name="title"
                  component={TextFieldRedux}
                  placeholder={intl.formatMessage(messages.title)}
                  label={intl.formatMessage(messages.title)}
                  className={classes.field}
                  validate={required}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  name="startingDate"
                  component={DatePickerRedux}
                  placeholder={intl.formatMessage(messages.starting_date)}
                  label={intl.formatMessage(messages.starting_date)}
                  className={classes.field}
                  validate={required}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  name="endingDate"
                  component={DatePickerRedux}
                  placeholder={intl.formatMessage(messages.ending_date)}
                  label={intl.formatMessage(messages.ending_date)}
                  className={classes.field}
                  validate={required}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  name="currency"
                  component={SelectFieldRedux}
                  label={intl.formatMessage(messages.currency)}
                  className={classes.field}
                >
                  <MenuItem value="Rp">Indonesian Rupiah (Rp)</MenuItem>
                  <MenuItem value="USD">US Dollar (USD)</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  name="totalFunding"
                  component={TextFieldRedux}
                  type="number"
                  placeholder={intl.formatMessage(messages.total_funding)}
                  label={intl.formatMessage(messages.total_funding)}
                  className={classes.field}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="industrialPartners"
                  component={TextFieldRedux}
                  placeholder={intl.formatMessage(messages.industrial_partners)}
                  label={intl.formatMessage(messages.industrial_partners)}
                  className={classes.field}
                />
              </Grid>
            </Grid>
          </section>

          <div className={css.buttonArea}>
            <div>
              <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                <FormattedMessage {...messages.add} />
              </Button>
              <Button
                type="button"
                disabled={pristine || submitting}
                onClick={() => reset()}
              >
                <FormattedMessage {...messages.reset} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AddNewProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  intl: intlShape.isRequired
};

const AddNewProjectFormRedux = reduxForm({
  form: 'addNewProjectForm',
  enableReinitialize: true,
})(AddNewProjectForm);

const AddNewProjectFormInit = connect(
  () => ({
    initialValues: Map({
      title: '',
      startingDate: '',
      endingDate: '',
      totalFunding: 0,
      currency: 'Rp',
      industrialPartners: '',
    }),
  })
)(AddNewProjectFormRedux);

export default withStyles(styles)(injectIntl(AddNewProjectFormInit));
