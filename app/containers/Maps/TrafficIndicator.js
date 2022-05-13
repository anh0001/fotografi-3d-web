import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import { Traffic } from './demos';
import Info from './Info';

class TrafficIndicator extends React.Component {
  render() {
    const title = brand.name + ' - Map';
    const description = brand.desc;
    const docSrc = 'containers/Maps/demos/';
    const { intl } = this.props;
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
          overflowX
          icon="traffic"
          title={intl.formatMessage(messages.trafficIndicatorTitle)}
          desc={intl.formatMessage(messages.trafficIndicatorDesc)}
        >
          <Info />
          <Traffic />
          <SourceReader componentName={docSrc + 'Traffic.js'} />
        </PapperBlock>
      </div>
    );
  }
}

TrafficIndicator.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(TrafficIndicator);
