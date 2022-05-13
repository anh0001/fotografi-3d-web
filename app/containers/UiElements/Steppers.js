import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import { injectIntl } from 'react-intl';
import messages from './messages';
import {
  HorizontalLinear,
  HorizontalNonLinear,
  StepperError,
  VerticalStepper,
  MobileSteppers,
  StepperCarousel
} from './demos';

function Steppers(props) {
  const title = brand.name + ' - UI Elements';
  const description = brand.desc;
  const docSrc = 'containers/UiElements/demos/Steppers/';
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
        title={intl.formatMessage(messages.stepHorizontalTitle)}
        icon="more_horiz"
        desc={intl.formatMessage(messages.stepHorizontalDesc)}
      >
        <div>
          <HorizontalLinear />
          <SourceReader componentName={docSrc + 'HorizontalLinear.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.stepHorizontalNonTitle)}
        con="more_horiz"
        desc={intl.formatMessage(messages.stepHorizontalNonDesc)}
      >
        <div>
          <HorizontalNonLinear />
          <SourceReader componentName={docSrc + 'HorizontalNonLinear.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.stepErrorTitle)}
        icon="more_horiz"
        desc={intl.formatMessage(messages.stepErrorDesc)}
      >
        <div>
          <StepperError />
          <SourceReader componentName={docSrc + 'StepperError.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.stepVerticalTitle)}
        icon="more_vert"
        desc={intl.formatMessage(messages.stepVerticalDesc)}
      >
        <div>
          <VerticalStepper />
          <SourceReader componentName={docSrc + 'VerticalStepper.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.stepMobileTitle)}
        icon="phone_android"
        desc={intl.formatMessage(messages.stepMobileDesc)}
      >
        <div>
          <MobileSteppers />
          <SourceReader componentName={docSrc + 'MobileSteppers.js'} />
        </div>
      </PapperBlock>
      <PapperBlock
        title={intl.formatMessage(messages.stepCarouselTitle)}
        icon="view_carousel"
        desc={intl.formatMessage(messages.stepCarouselDesc)}
      >
        <div>
          <StepperCarousel />
          <SourceReader componentName={docSrc + 'StepperCarousel.js'} />
        </div>
      </PapperBlock>
    </div>
  );
}

Steppers.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Steppers);
