import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { Helmet } from 'react-helmet';
import { firebase } from '../../../firebase';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';

import Editor from 'enl-components/DanteEditor/components/Dante';
import EditorTheme from './EditorTheme';
import projectStatus from 'enl-api/apps/projectStatus';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class ReadProject extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!

    this.state = {
      username: '',
      projectId: '',
      project: null,
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

    const username = this.props.match.params.username;
    const project_id = this.props.match.params.projectid;
    let project_username = '';
    let project_labUsername = '';
    let project_status = '';
    let project = null;

    try {
      firebase.getProjectUsingId(project_id)
        .then(resp => {
          project = resp.projects[0];
          project_username = project.username;
          project_labUsername = project.labUsername;
          project_status = project.status;

          if ((username === project_username) ||
            (project_status !== projectStatus.draft)) {

            this.setState({
              username: username,
              projectId: project_id,
              project: project,
            });

          }
          else
            return;
        });

    } catch (error) {
      console.log(error);
    }

    return;
  };

  render() {
    const title = brand.name + ' - Project';
    const description = brand.desc;
    const {
      username,
      projectId,
      project,
    } = this.state;

    if (!project) return null;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={project.title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={project.title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock icon="video_label" title={project.title} desc={' '}>
          <Editor
            content={JSON.parse(project.content)}
            read_only={true}
            body_placeholder='Tulis project disini...'
            style={{
              margin: '0 auto',
              width: '80%',
            }}
            theme={EditorTheme}
          />
        </PapperBlock>
      </div>
    );
  }
}

ReadProject.propTypes = {
  // classes: PropTypes.object.isRequired,
};

// const authReducerKey = 'authReducer';
// const reducerKey = 'projectsReducer';
// const sagaKey = reducerKey;

// const mapStateToProps = state => ({
//   // dataArticles: state.getIn([reducerKey, 'dataArticles']),
//   // projectIndex: state.getIn([reducerKey, 'articleIndex']),
//   ...state
// });

// const mapDispatchToProps = dispatch => ({
//   // updateContentArticleHandler: bindActionCreators(updateContentArticleAction, dispatch),
// });

// // const withReducer = injectReducer({ key: reducerKey, reducer });
// // const withSaga = injectSaga({ key: sagaKey, saga });

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps
// );

// export default compose(
//   // withReducer,
//   // withSaga,
//   // withConnect,
//   // withStyles(styles),
// )(ReadArticle);

export default ReadProject;
