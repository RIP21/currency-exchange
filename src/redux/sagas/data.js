import { all, put, fork, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOAD_RATES } from '../ducks/data';
import keyBy from 'lodash/keyBy';

const fakeRequest = data => {
  return new Promise(resolve => {
    resolve({
      data
    });
  });
};

function* fetchRates() {
  yield put({ type: LOAD_RATES.REQUEST });
  try {
    const responses = yield all([
      call(fakeRequest, {
        base: 'EUR',
        rates: {
          USD: 1.1165,
          GBP: 0.859838
        }
      }),
      call(fakeRequest, {
        base: 'USD',
        rates: {
          EUR: 0.8956,
          GBP: 0.7
        }
      }),
      call(fakeRequest, {
        base: 'GBP',
        rates: {
          EUR: 1.25,
          USD: 1.4
        }
      })
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
