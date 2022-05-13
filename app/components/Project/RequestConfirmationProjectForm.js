import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Type from 'enl-styles/Typography.scss';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
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
  // Switch as SwitchRedux,
  // Slider as SliderRedux,
  TextField as TextFieldRedux,
} from 'redux-form-material-ui-adapter';
import messages from './messages';
import styles from './add-new-project-jss';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

class RequestConfirmationProjectForm extends React.Component {
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
            <div>
              <Field
                name="labUsername"
                component={TextFieldRedux}
                placeholder={'Username of Lab'}
                label={'Username of Lab'}
                className={classes.field}
              />
            </div>
          </section>

          <div className={css.buttonArea}>
            <div>
              <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                <FormattedMessage {...messages.request} />
              </Button>
              <Button
                type="button"
                disabled={pristine || submitting}
                onClick={() => reset()}
              >
                <FormattedMessage {...messages.cancel} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

RequestConfirmationProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  intl: intlShape.isRequired
};

const reducerKey = 'projectsReducer';

const RequestConfirmationProjectFormRedux = reduxForm({
  form: 'requestConfirmationProjectForm',
  enableReinitialize: true,
})(RequestConfirmationProjectForm);

const RequestConfirmationProjectFormInit = connect(
  state => ({
    initialValues: state.getIn([reducerKey, 'requestConfirmationProjectFormValues']),
    ...state
  })
)(RequestConfirmationProjectFormRedux);

export default withStyles(styles)(injectIntl(RequestConfirmationProjectFormInit));
