import { getAllSessions, getSingleSession } from '../services/sessions';
import transformSessions from '../data/sessions';
import { find, map, flatten, compose } from 'lodash/fp';
export const REQUEST_SESSION = 'FETCH_SESSION';

function fetchSession() {
    return {
        type: REQUEST_SESSION
    };
};

export const RECEIVE_SESSION = 'RECEIVE_SESSION';

function receiveSession(session) {
    return {
        type: RECEIVE_SESSION,
        session
    };
};

function retrieveSession(dispatch, sessions, id) {
    const flattened = compose(flatten, map('sessions'))(sessions);
    const session = find({id})(flattened);
    const url = session.details;
    return getSingleSession(url).end((err, res) => {
        dispatch(receiveSession(res.body));
    });
}

export function getSession(id) {
    return function(dispatch, getState) {
        const sessions = getState().sessions.sessions;
        if (sessions.length === 0) {
            return getAllSessions().end((err, res) => {
                const transformedSessions = transformSessions(res.body);
                return retrieveSession(dispatch, transformedSessions, id);
            });
        } else {
            return retrieveSession(dispatch, sessions, id);
        }
    };
}

export function removeSession() {
    return function(dispatch) {
        dispatch(receiveSession(null));
    };
}