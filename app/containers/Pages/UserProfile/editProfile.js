import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';

import reducer from './userProfileReducer';
import saga from './userProfileSagas';

import {
    makeSelectAuthUser,
    makeSelectAuthLoggedIn,
    makeSelectUserProfile
} from './userProfileSelectors';
import {
    getUserProfile,
    updateUserProfile
} from './userProfileActions';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
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
    },
});

class EditProfile extends React.Component {
    state = {
        tabValue: 0,

        avatar: null,
        name: '',
        birth: new Date(),
        location: '',
        userInfo: '',

        imageFile: {},
        isFileLoading: false
    };

    handleDateChange = (date) => {
        this.setState({ birth: date });
    }

    handleChangeTab = (event, value) => {
        this.setState({ tabValue: value });
    };

    handleClickSave = () => {
        const updates = {
            avatar: this.state.imageFile.avatar.file,
            fullname: this.state.name,
            birthDate: this.state.birth.toString(),
            location: this.state.location,
            description: this.state.userInfo
        };
        this.props.updateUserProfileHandler(this.props.user.uid, updates);
        // console.log('handleClickSave');
    };

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.getUserProfilehandler(this.props.user.uid);
            // console.log('componentDidMount');
            // console.log(this.props.user);
        };

        if (this.props.userProfile) {
            this.setState({
                name: this.props.userProfile.fullname,
                birth: new Date(this.props.userProfile.birthDate),
                location: this.props.userProfile.location,
                userInfo: this.props.userProfile.description,

            });
        };
    };

    componentDidUpdate(prevProps) {
        if (this.props.user && !prevProps.user) {
            this.props.getUserProfilehandler(this.props.user.uid);
            // console.log('componentDidUpdate getUserProfilehandler');
        };

        if ((this.props.userProfile && (!prevProps.userProfile)) ||
            ((this.props.userProfile) && (this.props.userProfile.fullname !== prevProps.userProfile.fullname))) {
            this.setState({
                name: this.props.userProfile.fullname,
                birth: new Date(this.props.userProfile.birthDate),
                location: this.props.userProfile.location,
                userInfo: this.props.userProfile.description,
            });
            // console.log('componentDidUpdate setState');
        };
    };

    onFileChange = (e, prop) => {
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
                    imageFile: {
                        ...this.state.imageFile,
                        [prop]: { file: img, url: e.target.result }
                    }
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
        const { tabValue } = this.state;

        // if (this.state.imageFile.avatar)
        //     console.log(this.state.imageFile.avatar);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Tabs value={tabValue} onChange={this.handleChangeTab} style={{ flexGrow: 1 }}>
                            <Tab label="User Info" />
                            <Tab label="About" />
                        </Tabs>
                        <Button color="inherit" onClick={this.handleClickSave} component={Link} to="/app/pages/user-profile">Save</Button>
                    </Toolbar>
                </AppBar>
                {tabValue === 0 &&
                    <TabContainer>
                        <Grid item xs={12} sm={6} md={4}>
                            <div>
                                <input
                                    accept="image/jpeg"
                                    className={classes.inputUpload}
                                    id="upload-avatar"
                                    type="file"
                                    onChange={(e) => this.onFileChange(e, 'avatar')}
                                />
                                {this.state.isFileLoading ?
                                    (<CircularProgress className={classes.progress} />)
                                    : (<label htmlFor="upload-avatar">
                                        <Button variant="contained" component="span" id="upload-avatar" className={classes.button}>
                                            Upload Avatar
                                    </Button>
                                    </label>)
                                }
                            </div>
                            <TextField
                                required
                                id="name"
                                label="Name"
                                value={this.state.name}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                            <div className={classes.picker}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        label="Tanggal, Bulan, Tahun Lahir"
                                        format="DD/MM/YYYY"
                                        placeholder="01/01/2020"
                                        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        value={this.state.birth}
                                        onChange={this.handleDateChange}
                                        animateYearScrolling={false}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <TextField
                                id="location"
                                label="Lokasi"
                                value={this.state.location}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => this.setState({ location: e.target.value })}
                            />
                            <TextField
                                id="user-info"
                                label="User Info"
                                value={this.state.userInfo}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows={6}
                                fullWidth
                                onChange={(e) => this.setState({ userInfo: e.target.value })}
                            />
                        </Grid>
                    </TabContainer >
                }
                {tabValue === 1 && <TabContainer>Tentang User</TabContainer>}

            </div >
        );
    }
}

EditProfile.propTypes = {
    classes: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    userProfile: PropTypes.object,
    getUserProfilehandler: PropTypes.func,
    updateUserProfileHandler: PropTypes.func
};

EditProfile.defaultProps = {
    user: null,
    isAuthenticated: null,
    userProfile: null
};

const mapStateToProps = state => createStructuredSelector({
    isAuthenticated: makeSelectAuthLoggedIn(),
    user: makeSelectAuthUser(),
    userProfile: makeSelectUserProfile()
});

const mapDispatchToProps = dispatch => ({
    getUserProfilehandler: bindActionCreators(getUserProfile, dispatch),
    updateUserProfileHandler: bindActionCreators(updateUserProfile, dispatch),
});

const withReducer = injectReducer({ key: "userProfileReducer", reducer });
const withSaga = injectSaga({ key: "userProfileReducer", saga });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

export default compose(
    withReducer,
    withSaga,
    withConnect,
    withStyles(styles),
)(EditProfile);
