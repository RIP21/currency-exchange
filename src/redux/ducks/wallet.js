import { createReducer } from 'helpers/redux';
import { CURRENCIES } from 'constants/global';
// ========================= ACTIONS ===========================//
export const EXCHANGE = 'wallet/EXCHANGE';
export const exchange = (fromCurrency, fromAmount, toCurrency, toAmount) => {
  return {
    type: EXCHANGE,
    payload: { fromCurrency, fromAmount, toCurrency, toAmount }
  };
};

//========================= REDUCER ===========================//
const initialState = {
  wallets: {
    [CURRENCIES.USD.TEXT]: {
      id: CURRENCIES.USD.ID,
      currency: CURRENCIES.USD.TEXT,
      amount: 100
    },
    [CURRENCIES.EUR.TEXT]: {
      id: CURRENCIES.EUR.ID,
      currency: CURRENCIES.EUR.TEXT,
      amount: 150
    },
    [CURRENCIES.GBP.TEXT]: {
      id: CURRENCIES.GBP.ID,
      currency: CURRENCIES.GBP.TEXT,
      amount: 200
    }
  }
};

const handlers = {
  [EXCHANGE]: (
    state,
    { payload: { fromCurrency, fromAmount, toCurrency, toAmount } }
  ) => {
    const cloneWallets = { ...state.wallets };
    cloneWallets[fromCurrency].amount =
      cloneWallets[fromCurrency].amount - parseFloat(fromAmount);
    cloneWallets[toCurrency].amount =
      cloneWallets[toCurrency].amount + parseFloat(toAmount);

    return { ...state, wallets: cloneWallets };
  }
};

export default createReducer(initialState, handlers);
