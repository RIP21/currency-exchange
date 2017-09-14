import numeral from 'numeral';
import { CURRENCIES } from '../constants/exchange';
import find from 'lodash/find';

export const getCurrencyTextById = id => {
  return find(CURRENCIES, CURRENCY => CURRENCY.ID === id).TEXT;
};

export const formatWithLimitedFloat = value => numeral(value).format('0.00');

export const formatNumber = (value, formatFloating = false) => {
  return formatFloating ? value : formatWithLimitedFloat(value);
};

export const checkStartsWithPlusOrMinus = value => {
  const stringifiedValue = typeof value !== 'string' ? value.toString() : value;
  const firstSymbol = stringifiedValue.charAt(0);
  return firstSymbol === '+' || firstSymbol === '-';
};

export const extractValue = value => {
  const stringifiedValue = value.toString();
  if (checkStartsWithPlusOrMinus(value)) {
    return stringifiedValue.length > 1
      ? stringifiedValue.substring(1, value.length)
      : '';
  } else {
    return stringifiedValue;
  }
};

export const validateInput = value => {
  return (
    value === '' ||
    /^[0-9]+$/.test(value) ||
    /^[0-9]*[.]$/.test(value) ||
    /^[0-9]*[.][0-9]{1,2}$/.test(value)
  );
};
