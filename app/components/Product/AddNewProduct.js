import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { injectIntl, intlShape } from 'react-intl';
import { Map } from 'immutable';
import messages from './messages';
import AddNewProductForm from './AddNewProductForm';
import styles from './product-jss';

class AddNewProduct extends React.Component {
  constructor(props) {
    super(props);
    this.imageFiles = [];
  }

  sendValues = (values) => {
    const { submit } = this.props;
    const images = this.imageFiles;
    
    values = values.merge({ imageFiles: images });
    setTimeout(() => {
      submit(values);
    }, 500);
  }

  saveImageFiles = (images) => {
    this.imageFiles = [...images];
  };

  render() {
    const {
      classes,
      openForm,
      closeForm,
      openAddNewProduct,
      intl
    } = this.props;

    return (
      <div>
        <Tooltip title={intl.formatMessage(messages.open_add_new_product_tooltip)}>
          <Fab color="secondary" onClick={() => openAddNewProduct()} className={classes.addBtn}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <AddNewProductForm
          open={openForm}
          handleClose={closeForm}
          onSubmit={this.sendValues}
          saveImageFiles={this.saveImageFiles}
        />
      </div>
    );
  }
}

AddNewProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  openAddNewProduct: PropTypes.func.isRequired,
  openForm: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

AddNewProduct.defaultProps = {
  openForm: false
};

export default withStyles(styles)(injectIntl(AddNewProduct));
