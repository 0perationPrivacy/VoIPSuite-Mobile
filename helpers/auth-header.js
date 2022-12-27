import { store } from "../redux/store";
import _ from 'lodash'

export function authHeader() {
    // return authorization header with jwt token

    var state = store.getState();
    const { user } = state?.authentication;

    if (user && user.token) {
        return { 'token': user?.data?.token, 'Cache-Control': 'no-cache' };
    } else {
        return { 'Cache-Control': 'no-cache' };
    }
}

export function getUserId() {
    var state = store.getState();
    const { user } = state?.authentication;

    return user?.data?._id;
}

export function getCurrentActiveProfile() {
    var state = store.getState();
    const { profileSettings } = state.settings;

    if (profileSettings && !_.isEmpty(profileSettings)) {
        return profileSettings;
    }

    return null;
}

export function isLoggedIn() {
    var state = store.getState();
    const { loggedIn } = state?.authentication;

    return loggedIn;
}
