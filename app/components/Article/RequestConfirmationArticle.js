import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import RequestConfirmationArticleForm from './RequestConfirmationArticleForm';
import FloatingPanel from '../Panel/FloatingPanel';
import styles from './add-new-article-jss';

class RequestConfirmationArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  sendFormValues = (formValues) => {
    const { submit } = this.props;
    setTimeout(() => {
      submit(formValues);
    }, 500);
  }

  render() {
    const {
      classes,
      setOpenForm,
      closeFormHandler,
      intl
    } = this.props;
    const { img } = this.state;
    const branch = '';
    return (
      <div>
        <FloatingPanel
          title={'Request Confirmation'}
          openForm={setOpenForm}
          branch={branch}
          closeForm={closeFormHandler}
          setFullScreen={true}
        >
          <RequestConfirmationArticleForm
            onSubmit={this.sendFormValues}
          />
        </FloatingPanel>
      </div>
    );
  }
}

RequestConfirmationArticle.propTypes = {
  classes: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  setOpenForm: PropTypes.bool.isRequired,
  closeFormHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

RequestConfirmationArticle.defaultProps = {
  setOpenForm: false
};

export default withStyles(styles)(injectIntl(RequestConfirmationArticle));
