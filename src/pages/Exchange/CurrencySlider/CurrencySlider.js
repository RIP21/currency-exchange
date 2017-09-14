import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import SliderCard from './SliderCard';
import map from 'lodash/map';
import { CURRENCIES } from 'constants/global';

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

export default CurrencySlider;
