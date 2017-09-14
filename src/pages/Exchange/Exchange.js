import React from 'react';
import { Box, Flex, ButtonCircle, Divider } from 'rebass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CurrencySlider from './CurrencySlider';
import * as Helpers from 'helpers/exchange';
import { CURRENCIES, FIELDS } from 'constants/exchange';

class Exchange extends React.Component {
  initialState = {
    [FIELDS.FROM_CURR]: CURRENCIES.USD.TEXT,
    [FIELDS.TO_CURR]: CURRENCIES.EUR.TEXT,
    [FIELDS.FROM]: '',
    [FIELDS.TO]: '',
    exchangeButtonDisabled: true
  };

  state = {
    ...this.initialState
  };

  //We check here only from, since they are depend one on another so we can check only one
  inputsArePopulated = () => {
    return Helpers.extractValue(this.state.from) !== '';
  };

  recalculateIfRateChanged = ({ rates: prevRates }) => {
    const { fromCurrency, toCurrency } = this.state;
    const ratesChanged =
      this.getRate(fromCurrency, toCurrency) !==
      this.getRate(fromCurrency, toCurrency, prevRates);
    if (ratesChanged && this.inputsArePopulated()) {
      this.recalculateInputsOnRatesChange();
    }
  };

  componentWillReceiveProps(prevProps) {
    this.recalculateIfRateChanged(prevProps);
  }

  onSlide = direction => nextIndex => {
    const field = direction === FIELDS.TO ? FIELDS.TO_CURR : FIELDS.FROM_CURR;
    this.setState({ [field]: Helpers.getCurrencyTextById(nextIndex) });
    if (this.inputsArePopulated()) {
      this.calculateFromToInputs(
        direction,
        Helpers.extractValue(this.state[direction]),
        true
      );
    }
  };

  onToSlide = this.onSlide(FIELDS.TO);
  onFromSlide = this.onSlide(FIELDS.FROM);

  onChange = ({ target: { name: direction, value: inputString } }) => {
    const value = Helpers.extractValue(inputString);
    if (Helpers.validateInput(value)) {
      this.setState({
        [direction]: value !== '' ? Helpers.formatNumber(value, true) : ''
      });
      this.calculateFromToInputs(direction, value);
    }
  };

  getRate = (fromCurrency, toCurrency, rates = this.props.rates) => {
    const notSameCurrency = fromCurrency !== toCurrency;
    if (notSameCurrency) {
      return rates[fromCurrency].rates[toCurrency];
    } else {
      return 1;
    }
  };

  recalculateInputsOnRatesChange = () => {
    const { fromCurrency, toCurrency, from } = this.state;
    const fromValue = Helpers.extractValue(from);
    const newTo = fromValue * this.getRate(fromCurrency, toCurrency);
    this.setState({
      [FIELDS.FROM]: Helpers.formatNumber(Helpers.extractValue(from)),
      [FIELDS.TO]: Helpers.formatNumber(newTo)
    });
  };

  calculateFromToInputs = (direction, value) => {
    if (value === '') {
      this.setState({
        [FIELDS.TO]: '',
        [FIELDS.FROM]: '',
        exchangeButtonDisabled: true
      });
    } else {
      const { fromCurrency, toCurrency } = this.state;
      if (direction === FIELDS.TO) {
        const result = value * this.getRate(toCurrency, fromCurrency);
        this.setState({
          [FIELDS.FROM]: Helpers.formatNumber(result),
          exchangeButtonDisabled: false
        });
      } else {
        const result = value * this.getRate(fromCurrency, toCurrency);
        this.setState({
          [FIELDS.TO]: Helpers.formatNumber(result),
          exchangeButtonDisabled: false
        });
      }
    }
  };

  onExchangeClick = () => {
    const { to, from, toCurrency, fromCurrency } = this.state;
    alert(
      `You successfully exchange ${Helpers.extractValue(
        from
      )} ${fromCurrency} to ${Helpers.extractValue(to)} ${toCurrency}`
    );
    this.setState(this.initialState);
  };

  render() {
    const {
      fromCurrency,
      toCurrency,
      from,
      to,
      exchangeButtonDisabled
    } = this.state;
    const directRate = `1 ${fromCurrency} = ${this.getRate(
      fromCurrency,
      toCurrency
    )} ${toCurrency}`;
    const reverseRate = `1 ${toCurrency} = ${this.getRate(
      toCurrency,
      fromCurrency
    )} ${fromCurrency}`;

    return (
      <div>
        <Flex align="center" justify="flex-end">
          <ButtonCircle
            disabled={exchangeButtonDisabled}
            onClick={this.onExchangeClick}
          >
            Exchange
          </ButtonCircle>
        </Flex>
        <Box>
          <CurrencySlider
            currency={fromCurrency}
            forOneMessage={directRate}
            name={FIELDS.FROM}
            value={from}
            onChange={this.onChange}
            onSlide={this.onFromSlide}
          />
        </Box>
        <Divider color="#0077cc" w={1} />
        <Box>
          <CurrencySlider
            currency={toCurrency}
            forOneMessage={reverseRate}
            name={FIELDS.TO}
            value={to}
            onChange={this.onChange}
            onSlide={this.onToSlide}
          />
        </Box>
      </div>
    );
  }
}

export default Exchange;
