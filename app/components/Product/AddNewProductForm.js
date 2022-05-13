import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'immutable';
import {
  Store as StoreIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Tabs,
  Tab,
  Grid,
  Slide,
  CircularProgress,
  Toolbar,
  Typography,
} from '@material-ui/core';
import css from 'enl-styles/Form.scss';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  TextField as TextFieldRedux,
} from 'redux-form-material-ui-adapter';
import messages from './messages';
import styles from './product-jss';

// validation functions
const required = value => (value == null ? 'Required' : undefined);

const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class AddNewProductForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
      imageFiles: [],
      isFileLoading: false,
    };
  }

  handleChangeTab = (event, value) => {
    this.setState({ tabValue: value });
  };

  saveRef = ref => {
    this.ref = ref;
    return this.ref;
  };

  handleUploadChange = (e) => {
    const {
      imageFiles,
    } = this.state;

    const val = e.target.value;
    const img = e.target.files[0];
    const size = img.size / 1024 / 1024;
    const regex = /(\.jpg|\.jpeg|\.png)$/i;
    const uuidStr = uuidv4();

    this.setState({ isFileLoading: true });
    if (!regex.exec(val)) {
      alert('File type must be JPEG or PNG', 'error');
      this.setState({ isFileLoading: false });
    } else if (size > 0.5) {
      alert('File size exceeded 500kb, consider optimizing your image', 'error');
      this.setState({ isFileLoading: false });
    } else {
      const reader = new FileReader();
      reader.addEventListener('load', (res) => {
        const itemFile = {
          file: img,
          url: res.target.result,
          id: uuidStr,
        };
        this.setState({
          imageFiles: [
            ...imageFiles,
            itemFile
          ]
        });
        this.setState({ isFileLoading: false });
      });
      reader.readAsDataURL(img);
    }
  };

  handleResetForm = () => {
    const { reset } = this.props;
    this.setState({ imageFiles: [] });
    reset();
  };

  onSubmit = () => {
    const { handleSubmit, saveImageFiles } = this.props;
    const { imageFiles } = this.state;

    saveImageFiles(imageFiles);
    handleSubmit();
  };

  render() {
    const {
      classes,
      pristine,
      submitting,
      fullScreen,
      open,
      handleClose,
    } = this.props;

    const {
      tabValue,
      isFileLoading,
      imageFiles,
    } = this.state;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">
            <StoreIcon />
            <FormattedMessage {...messages.add_new_product_form_title} />
            <IconButton onClick={handleClose} className={classes.buttonClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AppBar position="static">
              <Toolbar>
                <Tabs value={tabValue} onChange={this.handleChangeTab} style={{ flexGrow: 1 }}>
                  <Tab label="Info" />
                  <Tab label="Images" />
                  <Tab label="Pricing" />
                </Tabs>
              </Toolbar>
            </AppBar>
            {tabValue === 0 && (
              <TabContainer>
                <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                  <Grid item xs={12}>
                    <Field
                      name="product_name"
                      component={TextFieldRedux}
                      placeholder="Nama Produk"
                      label="Nama"
                      className={classes.field}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      validate={required}
                      required
                    />
                    <Field
                      name="product_description"
                      component={TextFieldRedux}
                      placeholder="Deskripsi Singkat Produk"
                      label="Deskripsi"
                      className={classes.field}
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={20}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </TabContainer>
            )}

            {tabValue === 1 && (
              <TabContainer>
                <div>
                  <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                    <Grid item xs={6}>
                      <input
                        accept="image/jpeg"
                        className={classes.inputUpload}
                        id="upload-images"
                        type="file"
                        onChange={(e) => this.handleUploadChange(e, 'images')}
                      />
                      {isFileLoading
                        ? (<CircularProgress className={classes.progress} />)
                        : (
                          <label htmlFor="upload-images">
                            <Button variant="contained" color="primary" component="span" id="upload-images-button" className={classes.button}>
                              Upload
                            </Button>
                          </label>
                        )
                      }
                    </Grid>
                    {(imageFiles) && (
                      imageFiles.map((media) => (
                        <Grid key={media.id} item xs={6}>
                          <img className="max-w-none w-auto h-full" src={media.url} alt="product" />
                        </Grid>
                      ))
                    )}
                  </Grid>
                </div>
              </TabContainer>
            )}

            {tabValue === 2 && (
              <TabContainer>
                <Grid container spacing={10} direction="row" justify="flex-start" alignItems="flex-start">
                  <Grid item xs={12}>
                    <Field
                      name="available_qty"
                      component={TextFieldRedux}
                      placeholder="Available Qty"
                      label="Available Qty"
                      className={classes.field}
                      margin="normal"
                      variant="outlined"
                      type="number"
                      validate={required}
                      required
                      fullWidth
                    />
                    <Field
                      name="product_price"
                      component={TextFieldRedux}
                      placeholder="Price"
                      label="Price"
                      className={classes.field}
                      margin="normal"
                      variant="outlined"
                      type="number"
                      validate={required}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </TabContainer>
            )}
          </DialogContent>
          <DialogActions className={classes.commentAction}>
            <div className={css.buttonArea}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={submitting}
                onClick={() => this.onSubmit()}
              >
                <FormattedMessage {...messages.add} />
              </Button>
              <Button
                type="button"
                disabled={pristine || submitting}
                onClick={() => this.handleResetForm()}
              >
                <FormattedMessage {...messages.reset} />
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AddNewProductForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  saveImageFiles: PropTypes.func.isRequired,
};

AddNewProductForm.defaultProps = {
  fullScreen: false,
};

const AddNewProductFormRedux = reduxForm({
  form: 'addNewProductForm',
  enableReinitialize: true,
})(AddNewProductForm);

const AddNewProductFormInit = connect(
  () => ({
    initialValues: Map({
      product_name: '',
      product_description: '',
      product_price: 0,
      available_qty: 0,
    }),
  })
)(AddNewProductFormRedux);

export default withStyles(styles)(injectIntl(AddNewProductFormInit));
