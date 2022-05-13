import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import AddNewProjectForm from './AddNewProjectForm';
import FloatingPanel from '../Panel/FloatingPanel';
import styles from './add-new-project-jss';

class AddNewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  sendValues = (values) => {
    const { submit } = this.props;
    setTimeout(() => {
      submit(values);
    }, 500);
  }

  render() {
    const {
      classes,
      openForm,
      closeForm,
      openAddNewProject,
      submit,
      intl
    } = this.props;
    const { img } = this.state;
    const branch = '';
    return (
      <div>
        <Tooltip title={intl.formatMessage(messages.open_add_new_project_tooltip)}>
          <Fab color="secondary" onClick={() => openAddNewProject()} className={classes.addBtn}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <FloatingPanel title={intl.formatMessage(messages.add_new_project_form_title)} openForm={openForm} branch={branch} closeForm={closeForm}>
          <AddNewProjectForm
            onSubmit={this.sendValues}
          />
        </FloatingPanel>
      </div>
    );
  }
}

AddNewProject.propTypes = {
  classes: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  openAddNewProject: PropTypes.func.isRequired,
  openForm: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

AddNewProject.defaultProps = {
  openForm: false
};

export default withStyles(styles)(injectIntl(AddNewProject));
