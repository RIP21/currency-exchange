import React from 'react';
import { Box, Flex, ButtonCircle, Divider } from 'rebass';
import numeral from 'numeral';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CurrencySlider from './CurrencySlider';
import { CURRENCIES } from './constants';

const FROM = 'from';
const TO = 'to';

const formatWithLimitedFloat = value => numeral(value).format('0.00');

const formatNumber = (value, symbol, userInput = false) => {
  return `${symbol}${userInput ? value : formatWithLimitedFloat(value)}`;
};

const checkStartsWithPlusOrMinus = value => {
  const stringifiedValue = value.toString();
  const firstSymbol = stringifiedValue.charAt(0);
  return firstSymbol === '+' || firstSymbol === '-';
};

const removeSymbol = value => {
  const stringifiedValue = value.toString();
  if (checkStartsWithPlusOrMinus(value)) {
    return stringifiedValue.length > 1
      ? stringifiedValue.substring(1, value.length)
      : '';
  } else {
    return stringifiedValue;
  }
};

const validateInput = value => {
  return value === '' || /[0-9]/.test(value) || /^[0-9]*[.][0-9]+$/.test(value);
};

class Exchange extends React.Component {
  state = {
    fromCurrency: CURRENCIES.USD,
    toCurrency: CURRENCIES.EUR,
    from: '',
    to: ''
  };

  //
  // onSlide = (direction) => (_, nextIndex) => {
  //   const field = direction === TO ? 'toCurrency' : 'fromCurrency';
  //   this.setState( {[field]: getCurrencyById(nextIndex)} )
  // }

  onChange = ({ target: { name: type, value } }) => {
    const sanitizedValue = removeSymbol(value);
    if (validateInput(sanitizedValue)) {
      const symbol = type === FROM ? '-' : '+';
      const shouldFormat = sanitizedValue !== '';
      this.setState({
        [type]: shouldFormat ? formatNumber(sanitizedValue, symbol, true) : ''
      });
      this.calculateFromTo(type, sanitizedValue);
    }
  };

  extractRate = (
    fromCurrency = this.state.fromCurrency,
    toCurrency = this.state.toCurrency
  ) => {
    if (fromCurrency !== toCurrency) {
      return this.props.rates[fromCurrency].rates[toCurrency];
    } else {
      return 1;
    }
  };

  calculateFromTo = (type, value) => {
    if (value === '') {
      this.setState({ to: '', from: '' });
    } else {
      const { fromCurrency, toCurrency } = this.state;
      if (type === TO) {
        const result = value * this.extractRate(toCurrency, fromCurrency);
        this.setState({ from: formatNumber(result, '-') });
      } else {
        const result = value * this.extractRate();
        this.setState({ to: formatNumber(result, '+') });
      }
    }
  };

  render() {
    const { fromCurrency, toCurrency, from, to } = this.state;
    const priceForOne = `1 ${fromCurrency} = ${this.extractRate()} ${toCurrency}`;
    const reverseRate = `1 ${toCurrency} = ${this.extractRate(
      toCurrency,
      fromCurrency
    )} ${fromCurrency}`;
    return (
      <div>
        <Flex justify="space-between">
          <div>{priceForOne}</div>
          <ButtonCircle>Exchange</ButtonCircle>
        </Flex>
        <Box>
          <CurrencySlider
            currency={fromCurrency}
            name={FROM}
            value={from}
            onChange={this.onChange}
          />
        </Box>
        <Divider color="#0077cc" w={1} />
        <Box>
          <CurrencySlider
            currency={toCurrency}
            name={TO}
            reverseRate={reverseRate}
            value={to}
            onChange={this.onChange}
          />
        </Box>
      </div>
    );
  }
}

export default Exchange;
