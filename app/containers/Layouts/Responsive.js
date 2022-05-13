import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { injectIntl } from 'react-intl';
import { SourceReader, PapperBlock } from 'enl-components';
import messages from './messages';
import {
  Breakpoint,
  BreakpointGrid,
  MediaQueries,
  WithWidth
} from './demos';
import breakpointsTable from './demos/breakpoint.md';

function Responsive(props) {
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
        title={intl.formatMessage(messages.MediaQueriesTitle)}
        icon="important_devices"
        desc={intl.formatMessage(messages.MediaQueriesDesc)}
      >
        <div>
          <MediaQueries />
          <SourceReader componentName={docSrc + 'MediaQueries.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.WithWidthTitle)}
        icon="stay_current_landscape"
        desc={intl.formatMessage(messages.WithWidthDesc)}
      >
        <div>
          <WithWidth />
          <SourceReader componentName={docSrc + 'WIthWIdth.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        overflowX
        title={intl.formatMessage(messages.HiddenTitle)}
        icon="remove_red_eye"
        desc={intl.formatMessage(messages.HiddenDesc)}
      >
        <div>
          {/* eslint-disable-next-line */}
          <Markdown children={breakpointsTable} remarkPlugins={[remarkGfm]} />
          <Breakpoint />
          <SourceReader componentName={docSrc + 'Breakpoint.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.IntegrationGridTitle)}
        icon="view_column"
        desc={intl.formatMessage(messages.IntegrationGridDesc)}
      >
        <div>
          <BreakpointGrid />
          <SourceReader componentName={docSrc + 'BreakpointGrid.js'} />
        </div>
      </PapperBlock>
    </div>
  );
}

Responsive.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Responsive);
