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

import reducer from './reducers/articlesReducer';
import saga from './reducers/articlesSagas';

import {
  updateContentArticleAction,
} from './reducers/articlesActions';

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

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.content = null;

    // this.handleClick = this.handleClick.bind(this);
  }

  // Periodically this function is called for saving the description to the server
  handleContentEditorSave = (props, content) => {
    const {
      newArticleData,
    } = this.props;
    this.content = content;

    // Use redux saga for asynchronous operation, not to delay user interface
    this.props.updateContentArticleHandler({
      userId: newArticleData.get('userId'),
      articleId: newArticleData.get('articleId'),
      content: JSON.stringify(this.content),
    });

    return;
  };

  // handleClickSaveButton = async () => {
  //   try {
  //     const user = await this.props.user;
  //     const {
  //       userId,
  //       username,
  //       newArticleData,
  //     } = this.props;

  //     if (!this.isDbRecordCreated) {
  //       if (user) {
  //         //Replace spaces with dashes and make all letters lower-case
  //         const newArticleId = newArticleData.get('title').replace(/\s+/g, '-').toLowerCase() + '-' + uuidv4();
  //         this.setState({ articleId: newArticleId });

  //         const item = {
  //           userId: userId,
  //           username: username,
  //           icon: 'description',
  //           date: getDate(),
  //           time: getTime(),
  //           avatar: user.photoURL,
  //           articleId: newArticleId,
  //           title: newArticleData.get('title'),
  //           content: JSON.stringify(this.content),
  //         };

  //         if (!this.isDbRecordCreated) {
  //           await firebase.newArticle(item.userId, item.articleId, item);
  //           this.isDbRecordCreated = true;
  //           console.log('New db record is created: ', item.articleId);
  //         }
  //       }

  //     } else {  // Database already created, just update it
  //       await firebase.editArticle(userId, this.state.articleId, JSON.stringify(this.content));
  //       console.log('Db record is updated: ', item.articleId);
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
    if (!this.props.user) return null;

    const {
      newArticleData,
    } = this.props;

    try {
      props.props.blockProps.addLock();

      const resizedImageBlob = await this.resizeImageFile(img_file);

      const imgUrl = await firebase.storeImage(img_file.name, 'allposts/' + newArticleData.get('username') + '/' + newArticleData.get('articleId') + '/' + 'descImages', resizedImageBlob);

      props.uploadCompleted(imgUrl);

      return;

    } catch (error) {
      console.log('handleContentEditorImageUpload: ', error);
      return null;
    }
  };

  render() {
    const title = brand.name + ' - Article';
    const description = brand.desc;
    const {
      classes,
      newArticleData,
    } = this.props;

    // console.log('newArticleData = ', newArticleData.toJS());

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={newArticleData.get('title')} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={newArticleData.get('title')} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock icon="video_label" title={newArticleData.get('title')} desc={' '}>
          {/* <Button className={classes.button} variant="contained" color="primary" onClick={this.handleClickSaveButton} >
            Save
            <Icon className={classes.rightIcon}>save</Icon>
          </Button> */}

          {/* <Editor
            // content={this.state.content ? this.state.content : null}
            // style={{
            //   margin: '0 auto',
            //   width: '80%',
            // }}
            // theme={EditorTheme}
            continuousBlocks={['header-one']}
          /> */}
          <Editor
            content={this.content ? this.content : null}
            body_placeholder='Tulis artikel disini...'
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

NewArticle.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  newArticleData: PropTypes.object,
  updateContentArticleHandler: PropTypes.func,
};

const authReducerKey = 'authReducer';
const reducerKey = 'articlesReducer';
const sagaKey = reducerKey;

const mapStateToProps = state => ({
  isAuthenticated: state.get(authReducerKey).loggedIn,
  user: state.get(authReducerKey).user,
  userId: state.get(authReducerKey).userId,
  username: state.get(authReducerKey).username,
  newArticleData: state.getIn([reducerKey, 'newArticleData']),

  // dataProduct: state.getIn([reducerKey, 'productList']),
  // productIndex: state.getIn([reducerKey, 'productIndex']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateContentArticleHandler: bindActionCreators(updateContentArticleAction, dispatch),
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
)(NewArticle);
