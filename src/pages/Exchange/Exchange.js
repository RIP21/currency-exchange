import React from 'react';
import PT from 'prop-types';
import { Box, Flex, ButtonCircle, Divider } from 'rebass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CurrencySlider from './CurrencySlider';
import * as Helpers from 'helpers/exchange';
import { FIELDS } from 'constants/exchange';
import { CURRENCIES } from 'constants/global';
import ArrowBackIcon from 'react-icons/lib/fa/arrow-left';
import Big from 'big.js';

class Exchange extends React.Component {
  initialState = {
    [FIELDS.SOURCE_CURRENCY]: CURRENCIES.USD.TEXT,
    [FIELDS.TARGET_CURRENCY]: CURRENCIES.EUR.TEXT,
    [FIELDS.SOURCE]: '',
    [FIELDS.TARGET]: '',
    [FIELDS.LAST_EDITED]: FIELDS.TARGET,
    exchangeButtonDisabled: true
  };

  state = {
    ...this.initialState
  };

  handleButtonDisabled = () => {
    const isEnoughMoneyOnWallet =
      this.state.source <=
      parseFloat(
        this.props.wallets[this.state[FIELDS.SOURCE_CURRENCY]].amount.toFixed(2)
      );
    if (this.inputsArePopulated() && isEnoughMoneyOnWallet) {
      this.setState({ exchangeButtonDisabled: false });
    } else {
      this.setState({ exchangeButtonDisabled: true });
    }
  };

  componentDidUpdate(_, { target: prevTarget, source: prevSource }) {
    if (prevTarget !== this.state.target || prevSource !== this.state.source) {
      this.handleButtonDisabled();
    }
  }

  //We check here only 'source', since they are depend one on another so we can check only one
  //Also dangerous check cause of setState asynchronous nature.
  //That's why we don't have nice a things :D  Redux is helpful in this sorts of things since he is synchronous
  inputsArePopulated = () => {
    return (
      this.state.source !== '' &&
      this.state.source !== '0' &&
      this.state.source !== '0.00'
    );
  };

  recalculateIfRateChanged = ({ rates: prevRates }) => {
    const { sourceCurrency, targetCurrency } = this.state;
    const ratesChanged =
      this.getRate(sourceCurrency, targetCurrency) !==
      this.getRate(sourceCurrency, targetCurrency, prevRates);
    if (ratesChanged && this.inputsArePopulated()) {
      this.recalculateInputsOnRatesChange();
    }
  };

  componentWillReceiveProps(prevProps) {
    this.recalculateIfRateChanged(prevProps);
  }

  onSlide = direction => nextIndex => {
    const field =
      direction === FIELDS.TARGET
        ? FIELDS.TARGET_CURRENCY
        : FIELDS.SOURCE_CURRENCY;
    this.setState({ [field]: Helpers.getCurrencyTextById(nextIndex) });
    if (this.inputsArePopulated()) {
      const { lastEdited } = this.state;
      this.calculateFromToInputs(lastEdited, this.state[lastEdited]);
    }
  };

  onToSlide = this.onSlide(FIELDS.TARGET);
  onFromSlide = this.onSlide(FIELDS.SOURCE);

  onChange = ({ target: { name: direction, value: inputString } }) => {
    const value = Helpers.extractValue(inputString);
    if (Helpers.validateInput(value)) {
      this.setState({
        [direction]: value !== '' ? Helpers.formatNumber(value, true) : '',
        lastEdited: direction
      });
      this.calculateFromToInputs(direction, value);
    }
  };

  getRate = (sourceCurrency, targetCurrency, rates = this.props.rates) => {
    const notSameCurrency = sourceCurrency !== targetCurrency;
    if (notSameCurrency) {
      return rates[sourceCurrency].rates[targetCurrency];
    } else {
      return 1;
    }
  };

  recalculateInputsOnRatesChange = () => {
    const { sourceCurrency, targetCurrency, source } = this.state;
    const newTarget = new Big(source)
      .times(this.getRate(sourceCurrency, targetCurrency))
      .toFixed(2);
    this.setState({
      [FIELDS.SOURCE]: Helpers.formatNumber(source),
      [FIELDS.TARGET]: Helpers.formatNumber(newTarget)
    });
  };

  calculateFromToInputs = (direction, value) => {
    if (value === '') {
      this.setState({
        [FIELDS.TARGET]: '',
        [FIELDS.SOURCE]: ''
      });
    } else {
      const { sourceCurrency, targetCurrency } = this.state;
      if (direction === FIELDS.TARGET) {
        const result = new Big(value)
          .times(this.getRate(targetCurrency, sourceCurrency))
          .toFixed(2);
        this.setState({
          [FIELDS.SOURCE]: Helpers.formatNumber(result)
        });
      } else {
        const result = new Big(value)
          .times(this.getRate(sourceCurrency, targetCurrency))
          .toFixed(2);
        this.setState({
          [FIELDS.TARGET]: Helpers.formatNumber(result)
        });
      }
    }
  };

  onExchangeClick = () => {
    const { target, source, targetCurrency, sourceCurrency } = this.state;
    this.props.onExchange(sourceCurrency, source, targetCurrency, target);
    this.props.onExchangeClose();
    this.setState(this.initialState);
  };

  render() {
    const {
      sourceCurrency,
      targetCurrency,
      source,
      target,
      exchangeButtonDisabled
    } = this.state;
    const { wallets } = this.props;
    const directRate = `1 ${sourceCurrency} = ${this.getRate(
      sourceCurrency,
      targetCurrency
    )} ${targetCurrency}`;
    const reverseRate = `1 ${targetCurrency} = ${this.getRate(
      targetCurrency,
      sourceCurrency
    )} ${sourceCurrency}`;

    const sourceHaveMessage = `You have ${wallets[sourceCurrency]
      .amount} ${sourceCurrency}`;
    const targetHaveMessage = `You have ${wallets[targetCurrency]
      .amount} ${targetCurrency}`;

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
            currency={sourceCurrency}
            forOneMessage={directRate}
            name={FIELDS.SOURCE}
            value={source}
            youHaveMessage={sourceHaveMessage}
            onChange={this.onChange}
            onSlide={this.onFromSlide}
          />
        </Box>
        <Divider color="#0077cc" w={1} />
        <Box>
          <CurrencySlider
            currency={targetCurrency}
            forOneMessage={reverseRate}
            name={FIELDS.TARGET}
            value={target}
            youHaveMessage={targetHaveMessage}
            onChange={this.onChange}
            onSlide={this.onToSlide}
          />
        </Box>
      </div>
    );
  }
}

Exchange.propTypes = {
  error: PT.object,
  isLoaded: PT.bool.isRequired,
  rates: PT.object.isRequired,
  wallets: PT.object.isRequired,
  onExchange: PT.func.isRequired
};

export default Exchange;
