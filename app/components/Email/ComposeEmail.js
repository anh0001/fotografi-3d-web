import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { injectIntl, intlShape } from 'react-intl';
import ComposeEmailForm from './ComposeEmailForm';
import messages from './messages';
import FloatingPanel from '../Panel/FloatingPanel';
import styles from './email-jss';

class ComposeEmail extends React.Component {
  render() {
    const {
      classes,
      open, closeForm, sendEmail,
      to, subject,
      validMail, inputChange,
      compose, processing,
      intl
    } = this.props;
    const branch = '';
    return (
      <div>
        <Tooltip title={intl.formatMessage(messages.compose)}>
          <Fab color="secondary" onClick={() => compose()} className={classes.addBtn}>
            <Edit />
          </Fab>
        </Tooltip>
        <FloatingPanel
          openForm={open}
          branch={branch}
          closeForm={closeForm}
          title={intl.formatMessage(messages.compose)}
          extraSize
        >
          <ComposeEmailForm
            to={to}
            subject={subject}
            validMail={validMail}
            sendEmail={sendEmail}
            closeForm={closeForm}
            inputChange={inputChange}
            processing={processing}
          />
        </FloatingPanel>
      </div>
    );
  }
}

ComposeEmail.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  validMail: PropTypes.string.isRequired,
  compose: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  sendEmail: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(ComposeEmail));
