import { createReducer, createAsyncAction } from 'helpers/redux';
// ========================= ACTIONS ===========================//
export const LOAD_RATES = createAsyncAction('rates/LOAD');

//========================= REDUCER ===========================//
const initialState = {
  isLoaded: false,
  rates: {},
  error: null
};

const handlers = {
  [LOAD_RATES.REQUEST]: state => {
    return state;
  },
  [LOAD_RATES.SUCCESS]: (state, { payload }) => {
    return { ...state, rates: payload.data, isLoaded: true, error: null };
  },
  [LOAD_RATES.FAILURE]: (state, { payload }) => {
    return { ...state, error: payload.error };
  }
};

export default createReducer(initialState, handlers);
