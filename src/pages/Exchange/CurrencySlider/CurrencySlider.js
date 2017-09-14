import React from 'react';
import PT from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import SliderCard from './SliderCard';
import map from 'lodash/map';
import { CURRENCIES } from 'constants/global';
import { FIELDS } from 'constants/exchange';

const Slider = styled(require('react-slick').default)`margin-bottom: 40px;`;

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true
};

class CurrencySlider extends React.Component {
  render() {
    const {
      onChange,
      forOneMessage,
      currency,
      value,
      name,
      youHaveMessage,
      onSlide
    } = this.props;
    return (
      <Slider
        afterChange={onSlide}
        initialSlide={CURRENCIES[currency].ID}
        {...settings}
      >
        {map(CURRENCIES, CURRENCY => (
          <div key={CURRENCY.ID}>
            <SliderCard
              currency={CURRENCY.TEXT}
              forOneMessage={forOneMessage}
              name={name}
              value={value}
              youHaveMessage={youHaveMessage}
              onChange={onChange}
            />
          </div>
        ))}
      </Slider>
    );
  }
}

CurrencySlider.propTypes = {
  currency: PT.oneOf(map(CURRENCIES, 'TEXT')).isRequired,
  forOneMessage: PT.string.isRequired,
  name: PT.oneOf([FIELDS.TARGET, FIELDS.SOURCE]),
  value: PT.string.isRequired,
  youHaveMessage: PT.string.isRequired,
  onChange: PT.func.isRequired,
  onSlide: PT.func.isRequired
};

export default CurrencySlider;
