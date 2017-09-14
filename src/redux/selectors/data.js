import { createSelector } from 'reselect';

export const getState = state => state.data;

export const getIsLoaded = createSelector(getState, state => state.isLoaded);

export const getError = createSelector(getState, state => state.error);

export const getRates = createSelector(getState, state => state.rates);

export const getCurrencyRate = currencyKey =>
  createSelector(getRates, state => state[currencyKey]);
