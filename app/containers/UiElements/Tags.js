import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import { injectIntl } from 'react-intl';
import messages from './messages';
import { BasicTags, ArrayTags } from './demos';

function Tags(props) {
  const title = brand.name + ' - UI Elements';
  const description = brand.desc;
  const docSrc = 'containers/UiElements/demos/Tags/';
  const { intl } = props;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        title={intl.formatMessage(messages.tagsBasicTitle)}
        icon="local_offer"
        desc={intl.formatMessage(messages.tagsBasicDesc)}
      >
        <div>
          <BasicTags />
          <SourceReader componentName={docSrc + 'BasicTags.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.tagsArrayTitle)}
        icon="local_offer"
        desc={intl.formatMessage(messages.tagsArrayDesc)}
      >
        <div>
          <ArrayTags />
          <SourceReader componentName={docSrc + 'ArrayTags.js'} />
        </div>
      </PapperBlock>
    </div>
  );
}

Tags.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Tags);
