import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { Helmet } from 'react-helmet';
import { firebase } from '../../../firebase';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';

import Editor from 'enl-components/DanteEditor/components/Dante';
import EditorTheme from './EditorTheme';
import articleStatus from 'enl-api/apps/articleStatus';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class ReadArticle extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!

    this.state = {
      username: '',
      articleId: '',
      article: null,
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

    const username = this.props.match.params.username;
    const article_id = this.props.match.params.articleid;
    let article_username = '';
    let article_labUsername = '';
    let article_status = '';
    let article = null;

    try {
      firebase.getArticleUsingId(article_id)
        .then(resp => {
          article = resp.articles[0];
          article_username = article.username;
          article_labUsername = article.labUsername;
          article_status = article.status;
  
          if ((username === article_labUsername && article_status === articleStatus.waiting_confirmation) ||
            (username === article_username) ||
            (article_status === articleStatus.published)) {

            this.setState({
              username: username,
              articleId: article_id,
              article: article,
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
    const title = brand.name + ' - Article';
    const description = brand.desc;
    const {
      username,
      articleId,
      article,
    } = this.state;

    if (!article) return null;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={article.title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock icon="video_label" title={article.title} desc={' '}>
          <Editor
            content={JSON.parse(article.content)}
            read_only={true}
            body_placeholder='Tulis article disini...'
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

ReadArticle.propTypes = {
  // classes: PropTypes.object.isRequired,
};

// const authReducerKey = 'authReducer';
// const reducerKey = 'articlesReducer';
// const sagaKey = reducerKey;

// const mapStateToProps = state => ({
//   // dataArticles: state.getIn([reducerKey, 'dataArticles']),
//   // articleIndex: state.getIn([reducerKey, 'articleIndex']),
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

export default ReadArticle;
