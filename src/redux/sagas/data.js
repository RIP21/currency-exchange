import { all, put, fork, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOAD_RATES } from '../ducks/data';
import axios from 'axios';
import keyBy from 'lodash/keyBy';

function* fetchRates() {
  yield put({ type: LOAD_RATES.REQUEST });
  try {
    const responses = yield all([
      call(axios.get, 'http://api.fixer.io/latest?base=EUR&symbols=USD,GBP'),
      call(axios.get, 'http://api.fixer.io/latest?base=USD&symbols=EUR,GBP'),
      call(axios.get, 'http://api.fixer.io/latest?base=GBP&symbols=EUR,USD')
    ]);
    const data = keyBy(responses.map(response => response.data), 'base');
    yield put({ type: LOAD_RATES.SUCCESS, payload: { data } });
  } catch (error) {
    yield put({ type: LOAD_RATES.FAILURE, payload: { error } });
  }
}

function* liveRefresh() {
  while (true) {
    yield fetchRates();
    yield delay(10000);
  }
}

export default function* rootData() {
  yield all([fork(liveRefresh)]);
}
