import { put, call } from 'redux-saga/effects';

import * as actions from '../actions';
import normalize from '../normalize/directories';
import axios from '../../axios';

export function * fetchDirectories() {
    try {
        yield put(actions.fetchDirectoriesStart());
        const response = yield call([axios, 'get'], '/directories');
        const normalizedResponse = yield call(normalize, response.data);
        const byIds = {
            allIds: normalizedResponse.result,
            byId: normalizedResponse.entities.directories,
        };
        yield put(actions.fetchDirectoriesSuccess(byIds));
    } catch (error) {
        yield put(actions.fetchDirectoriesFail(error));
    }
}

export function * createDirectory(directory) {
    try {
        yield put(actions.createDirectoryStart());
        const response = yield call([axios, 'post'], '/directories', directory);
        yield put(actions.createDirectorySuccess(response.data));
    } catch (error) {
        yield put(actions.createDirectoryFail(error));
    }
}
