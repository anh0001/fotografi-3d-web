import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import reducer from './reducers/ecommerceReducers';
import saga from './reducers/ecommerceSagas';

import {
    addNewProductAction,
} from './reducers/ecommerceActions';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Toolbar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    inputUpload: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
    }
});

class AddProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabValue: 0,

            name: '',
            description: '',
            editorDescription: null,
            price: 0,
            imageFiles: [],
            discount: '',

            isFileLoading: false,
        };
    }

    handleChangeTab = (event, value) => {
        this.setState({ tabValue: value });
    };

    handleClickAdd = () => {
        const item = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            imageFiles: [...this.state.imageFiles],
            rating: 0,
            prevPrice: 0,
            discount: this.state.discount,
            soldout: false,
        };

        setTimeout(() => {
            this.props.addNewProductHandler(this.props.user.uid, item);
            // console.log('handleClickSave');
        }, 1000); // simulate server latency
    };

    componentDidMount() {
        // if (this.props.isAuthenticated) {
        //     this.props.getUserProfilehandler(this.props.user.uid);
        //     // console.log('componentDidMount');
        //     // console.log(this.props.user);
        // };
    };

    componentDidUpdate(prevProps) {
        // if (this.props.user && !prevProps.user) {
        //     // this.props.getUserProfilehandler(this.props.user.uid);
        //     console.log('componentDidUpdate getUserProfilehandler');
        // };
    };

    handleUploadChange = (e) => {
        const val = e.target.value;
        const img = e.target.files[0];
        const size = img.size / 1024 / 1024;
        const regex = /(\.jpg|\.jpeg|\.png)$/i;

        this.setState({ isFileLoading: true });
        if (!regex.exec(val)) {
            alert('File type must be JPEG or PNG', 'error');
            this.setState({ isFileLoading: false });
        } else if (size > 0.5) {
            alert('File size exceeded 500kb, consider optimizing your image', 'error');
            this.setState({ isFileLoading: false });
        } else {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                this.setState({
                    imageFiles: [
                        ...this.state.imageFiles,
                        { file: img, url: e.target.result }
                    ]
                });
                this.setState({ isFileLoading: false });
            });
            reader.readAsDataURL(img);
        }
    };

    render() {
        const {
            classes,
        } = this.props;
        const {
            tabValue,
            imageFiles,
            name,
        } = this.state;

        // if (this.props.user)
        // console.log(EditorTheme);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Tabs value={tabValue} onChange={this.handleChangeTab} style={{ flexGrow: 1 }}>
                            <Tab label="Info" />
                            <Tab label="Images" />
                            <Tab label="Pricing" />
                        </Tabs>
                        {imageFiles.length && name.length ?
                            <Button color="inherit" onClick={this.handleClickAdd} component={Link} to="/app/products/myproducts">Add</Button>
                            : null
                        }
                    </Toolbar>
                </AppBar>
                {tabValue === 0 && <TabContainer>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            required
                            id="product-name"
                            label="Nama Produk"
                            value={this.state.name}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                        <TextField
                            id="product-description"
                            label="Deskripsi Singkat Produk"
                            value={this.state.userInfo}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={20}
                            fullWidth
                            onChange={(e) => this.setState({ description: e.target.value })}
                        />
                    </Grid>
                </TabContainer >}

                {tabValue === 1 && <TabContainer>
                    <div>
                        <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                            <Grid item xs={6} sm={3} md={2}>
                                <input
                                    accept="image/jpeg"
                                    className={classes.inputUpload}
                                    id="upload-avatar"
                                    type="file"
                                    onChange={(e) => this.handleUploadChange(e, 'images')}
                                />
                                {this.state.isFileLoading ?
                                    (<CircularProgress className={classes.progress} />)
                                    : (<label htmlFor="upload-avatar">
                                        <Button variant="contained" color="primary" component="span" id="upload-avatar" className={classes.button}>
                                            Upload
                                        </Button>
                                    </label>)
                                }
                            </Grid>
                            {(this.state.imageFiles) && (
                                this.state.imageFiles.map((media, index) => (
                                    <Grid key={index} item xs={6} sm={3} md={2}>
                                        <img className="max-w-none w-auto h-full" src={media.url} alt="product" />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </div>
                </TabContainer>}

                {tabValue === 2 && <TabContainer>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                id="product-price"
                                label="Harga"
                                value={this.state.price}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                type='number'
                                onChange={(e) => this.setState({ price: Number(e.target.value) })}
                            />
                        </Grid>
                    </Grid>
                </TabContainer>}

            </div >
        );
    }
}

AddProduct.propTypes = {
    classes: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    addNewProductHandler: PropTypes.func,
};

AddProduct.defaultProps = {
    user: null,
    isAuthenticated: null
};

const authReducerKey = 'authReducer';
const reducerKey = 'ecommerceReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
    isAuthenticated: state.get(authReducerKey).loggedIn,
    user: state.get(authReducerKey).user,
    ...state
});

const mapDispatchToProps = dispatch => ({
    addNewProductHandler: bindActionCreators(addNewProductAction, dispatch),
});

const withReducer = injectReducer({ key: reducerKey, reducer });
const withSaga = injectSaga({ key: sagaKey, saga });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

export default compose(
    withReducer,
    withSaga,
    withConnect,
    withStyles(styles),
)(AddProduct);
