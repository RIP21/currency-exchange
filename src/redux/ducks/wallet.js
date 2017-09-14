import Big from 'big.js';
import { createReducer } from 'helpers/redux';
import { CURRENCIES } from 'constants/global';

// ========================= ACTIONS ===========================//
export const EXCHANGE = 'wallet/EXCHANGE';
export const exchange = (
  sourceCurrency,
  sourceAmount,
  targetCurrency,
  targetAmount
) => {
  return {
    type: EXCHANGE,
    payload: { sourceCurrency, sourceAmount, targetCurrency, targetAmount }
  };
};

//========================= REDUCER ===========================//
const initialState = {
  wallets: {
    [CURRENCIES.USD.TEXT]: {
      id: CURRENCIES.USD.ID,
      currency: CURRENCIES.USD.TEXT,
      amount: new Big(200)
    },
    [CURRENCIES.EUR.TEXT]: {
      id: CURRENCIES.EUR.ID,
      currency: CURRENCIES.EUR.TEXT,
      amount: new Big(200)
    },
    [CURRENCIES.GBP.TEXT]: {
      id: CURRENCIES.GBP.ID,
      currency: CURRENCIES.GBP.TEXT,
      amount: new Big(200)
    }
  }
};

const handlers = {
  [EXCHANGE]: (
    state,
    { payload: { sourceCurrency, sourceAmount, targetCurrency, targetAmount } }
  ) => {
    const cloneWallets = { ...state.wallets };
    cloneWallets[sourceCurrency].amount = cloneWallets[
      sourceCurrency
    ].amount.minus(parseFloat(sourceAmount));
    cloneWallets[targetCurrency].amount = cloneWallets[
      targetCurrency
    ].amount.plus(parseFloat(targetAmount));

    return { ...state, wallets: cloneWallets };
  }
};

export default createReducer(initialState, handlers);
