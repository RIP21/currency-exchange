import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import SliderCard from './SliderCard';
import map from 'lodash/map';
import { CURRENCIES, CURRENCIES_INDEX } from '../constants';

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
    const { onChange, reverseRate, currency, value, name } = this.props;
    return (
      <Slider
        {...settings}
        initialSlide={CURRENCIES_INDEX[CURRENCIES[currency]]}
      >
        {map(CURRENCIES, currency => (
          <div key={currency}>
            <SliderCard
              currency={currency}
              name={name}
              reverseRate={reverseRate}
              value={value}
              onChange={onChange}
            />
          </div>
        ))}
      </Slider>
    );
  }
}

export default CurrencySlider;
