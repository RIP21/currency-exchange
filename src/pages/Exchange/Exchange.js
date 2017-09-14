import React from 'react';
import { Box, Flex, ButtonCircle, Divider } from 'rebass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CurrencySlider from './CurrencySlider';
import * as Helpers from 'helpers/exchange';
import { FIELDS } from 'constants/exchange';
import { CURRENCIES } from 'constants/global';
import ArrowBackIcon from 'react-icons/lib/fa/arrow-left';

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

  handleButtonDisabled = () => {
    const isEnoughMoneyOnWallet =
      this.state.from <= this.props.wallets[this.state.fromCurrency].amount;
    if (this.inputsArePopulated() && isEnoughMoneyOnWallet) {
      this.setState({ exchangeButtonDisabled: false });
    } else {
      this.setState({ exchangeButtonDisabled: true });
    }
  };

  componentDidUpdate(_, { to: prevTo, from: prevFrom }) {
    if (prevTo !== this.state.to || prevFrom !== this.state.from) {
      this.handleButtonDisabled();
    }
  }

  //We check here only from, since they are depend one on another so we can check only one
  //Also dangerous check cause of setState asynchronous nature.
  // That's why we don't have nice a things and Redux is helpful in this sorts ofr operations :D
  inputsArePopulated = () => {
    return this.state.from !== '';
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
      this.calculateFromToInputs(direction, this.state[direction], true);
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
        [FIELDS.FROM]: ''
      });
    } else {
      const { fromCurrency, toCurrency } = this.state;
      if (direction === FIELDS.TO) {
        const result = value * this.getRate(toCurrency, fromCurrency);
        this.setState({
          [FIELDS.FROM]: Helpers.formatNumber(result)
        });
      } else {
        const result = value * this.getRate(fromCurrency, toCurrency);
        this.setState({
          [FIELDS.TO]: Helpers.formatNumber(result)
        });
      }
    }
  };

  onExchangeClick = () => {
    const { to, from, toCurrency, fromCurrency } = this.state;
    this.props.onExchange(fromCurrency, from, toCurrency, to);
    this.props.onExchangeClose();
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
    const { wallets } = this.props;
    const directRate = `1 ${fromCurrency} = ${this.getRate(
      fromCurrency,
      toCurrency
    )} ${toCurrency}`;
    const reverseRate = `1 ${toCurrency} = ${this.getRate(
      toCurrency,
      fromCurrency
    )} ${fromCurrency}`;

    const sourceHaveMessage = `You have ${wallets[fromCurrency]
      .amount} ${fromCurrency}`;
    const targetHaveMessage = `You have ${wallets[toCurrency]
      .amount} ${toCurrency}`;

    return (
      <div>
        <Flex align="center" justify="space-between">
          <ButtonCircle w={100.5} onClick={this.props.onExchangeClose}>
            <ArrowBackIcon />
          </ButtonCircle>
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
            youHaveMessage={sourceHaveMessage}
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
            youHaveMessage={targetHaveMessage}
            onChange={this.onChange}
            onSlide={this.onToSlide}
          />
        </Box>
      </div>
    );
  }
}

export default Exchange;
