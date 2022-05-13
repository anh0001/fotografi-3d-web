import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import { injectIntl } from 'react-intl';
import { SidebarLayout, SidebarLayoutRight, FullHeader } from './demos';
import messages from './messages';

function AppLayout(props) {
  const title = brand.name + ' - Layout';
  const description = brand.desc;
  const docSrc = 'containers/Layouts/demos/';
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
        title={intl.formatMessage(messages.appLayoutSidebarTitle)}
        icon="computer"
        desc={intl.formatMessage(messages.appLayoutSidebarDesc)}
      >
        <div>
          <SidebarLayout />
          <SourceReader componentName={docSrc + 'SidebarLayout.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.rightSidebarTitle)}
        icon="computer"
        desc={intl.formatMessage(messages.rightSidebarDesc)}
      >
        <div>
          <SidebarLayoutRight />
          <SourceReader componentName={docSrc + 'SidebarLayoutRight.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.fullHeaderTitle)}
        icon="computer"
        desc={intl.formatMessage(messages.fullHeaderDesc)}
      >
        <div>
          <FullHeader />
          <SourceReader componentName={docSrc + 'FullHeader.js'} />
        </div>
      </PapperBlock>
    </div>
  );
}

AppLayout.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(AppLayout);
