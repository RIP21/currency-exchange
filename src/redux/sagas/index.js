import { fork, all } from 'redux-saga/effects';

import data from './data';

export default function* root() {
  yield all([fork(data)]);
}
