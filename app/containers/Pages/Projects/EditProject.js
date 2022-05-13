import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { firebase } from '../../../firebase';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import messages from './messages';
import Resizer from 'react-image-file-resizer';

import reducer from './reducers/projectsReducer';
import saga from './reducers/projectsSagas';

import {
  updateContentProjectAction,
} from './reducers/projectsActions';

import Editor from 'enl-components/DanteEditor/components/Dante';
import EditorTheme from './EditorTheme';
import { ImageBlockConfig } from 'enl-components/DanteEditor/components/blocks/image.js'
import { EmbedBlockConfig } from 'enl-components/DanteEditor/components/blocks/embed.js'
import { VideoBlockConfig } from 'enl-components/DanteEditor/components/blocks/video.js'
import { PlaceholderBlockConfig } from 'enl-components/DanteEditor/components/blocks/placeholder.js'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.content = null;

    this.state = {
      projectId: '',
    };
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const {
      dataProjects,
      projectIndex,
    } = this.props;

    if (dataProjects) {
      this.content = JSON.parse(dataProjects.getIn([projectIndex, 'content']));
      this.setState({
        projectId: dataProjects.getIn([projectIndex, 'projectId']),
      });
    };

  };

  // Periodically this function is called for saving the description to the server
  handleContentEditorSave = (props, content) => {
    const {
      userId,
    } = this.props;
    this.content = content;

    this.props.updateContentProjectHandler({
      userId: userId,
      projectId: this.state.projectId,
      content: JSON.stringify(content),
    });

    return;
  };

  // handleClickSaveButton = async () => {
  //   try {
  //     const user = await this.props.user;

  //     if (user) {
  //       const item = {
  //         userId: user.uid,
  //         icon: 'description',
  //         date: getDate(),
  //         time: getTime(),
  //         avatar: user.photoURL,
  //         articleId: this.state.articleId,
  //         content: JSON.stringify(this.content),
  //       };

  //       await firebase.editArticle(item.userId, item.articleId, item);

  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  resizeImageFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      600, // maxWidth
      600, // maxHeight
      'JPEG',
      80, // quality (0-100)
      0,   // rotation
      uri => {
        resolve(uri);
      },
      'blob' // outputType
    );
  });

  // handle image upload to the server storage
  handleContentEditorImageUpload = async (img_file, props) => {
    const {
      username,
    } = this.props;

    if (!username) return null;

    try {
      props.props.blockProps.addLock();

      const resizedImageBlob = await this.resizeImageFile(img_file);

      const imgUrl = await firebase.storeImage(img_file.name, 'allprojects/' + username + '/' + this.state.projectId + '/' + 'descImages', resizedImageBlob);

      props.uploadCompleted(imgUrl);

      return;

    } catch (error) {
      console.log('handleContentEditorImageUpload: ', error);
      return null;
    }
  };

  render() {
    const title = brand.name + ' - Project';
    const description = brand.desc;
    const {
      classes,
      dataProjects,
      projectIndex,
    } = this.props;
    const currProject = dataProjects.get(projectIndex);

    // console.log('title123: ', currProject.get('title'));

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={currProject.get('title')} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={currProject.get('title')} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock icon="video_label" title={currProject.get('title')} desc={' '}>
          {/* <Button className={classes.button} variant="contained" color="primary" onClick={this.handleClickSaveButton} >
            Save
            <Icon className={classes.rightIcon}>save</Icon>
          </Button> */}
          <Editor
            content={JSON.parse(dataProjects.getIn([projectIndex, 'content']))}
            body_placeholder='Tulis project disini...'
            style={{
              margin: '0 auto',
              width: '80%',
            }}
            theme={EditorTheme}
            data_storage={{
              save_handler: this.handleContentEditorSave,
              interval: 3000,
            }}
            widgets={[
              ImageBlockConfig({
                options: {
                  upload_handler: this.handleContentEditorImageUpload,
                },
              }),
              EmbedBlockConfig(),
              VideoBlockConfig(),
              PlaceholderBlockConfig(),
            ]}
          />
        </PapperBlock>
      </div>
    );
  }
}

EditProject.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  dataProjects: PropTypes.object.isRequired,
  projectIndex: PropTypes.number.isRequired,
  updateContentProjectHandler: PropTypes.func,
};

const authReducerKey = 'authReducer';
const reducerKey = 'projectsReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  isAuthenticated: state.get(authReducerKey).loggedIn,
  user: state.get(authReducerKey).user,
  userId: state.get(authReducerKey).userId,
  username: state.get(authReducerKey).username,
  dataProjects: state.getIn([reducerKey, 'dataProjects']),
  projectIndex: state.getIn([reducerKey, 'projectIndex']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateContentProjectHandler: bindActionCreators(updateContentProjectAction, dispatch),
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
)(EditProject);
