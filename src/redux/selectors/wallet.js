import { createSelector } from 'reselect';

export const getState = state => state.wallet;

export const getWallets = createSelector(getState, state => state.wallets);
