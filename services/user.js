
import { API_PREFIX, getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { store } from '../redux/store';
import { userActions } from '../redux/actions';
import { navigateAndReset } from '../helpers/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userService = {
    login,
    logout,
    register,
    changeUsername,
    changePassword,
    deleteAccount
};

async function login(data) {
    let { server_url, ...rest } = data;
    server_url = server_url ? server_url + API_PREFIX : getServerUrl();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
    };

    try {
        const response = await fetch(`${server_url}/auth/login`, requestOptions);
        const user = handleResponse(response, false);
        return user;
    } catch (error) {
        return await Promise.reject([error]);
    }
}

function logout() {
    store.dispatch(userActions.logout());
}

async function register(user) {
    let { server_url, ...rest } = user;
    server_url = server_url ? server_url + API_PREFIX : getServerUrl();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
    };
    try {
        const response = await fetch(`${server_url}/auth/register`, requestOptions);
        return handleResponse(response, false);
    } catch (error) {
        return await Promise.reject([error]);
    }
}

// Resolved per request rather than once at module load, so a self-hosted
// server_url picked at login is actually honoured by these calls.
function authedPost(path, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body)
    };

    return fetch(`${getServerUrl()}${path}`, requestOptions).then(handleResponse);
}

async function changeUsername(user) {
    return authedPost('/auth/username/update', user);
}

async function changePassword(user) {
    return authedPost('/auth/password/update', user);
}

// Confirms the password, then erases every contact, message, email setting and
// profile for this account, releasing provisioned numbers at the provider.
async function deleteAccount(data) {
    return authedPost('/auth/password/check', data);
}


function handleResponse(response, isRedirect = true) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401 && isRedirect) {
                store.dispatch(userActions.logout())
                logout();
            }

            let valdidationErrors = {};
            if ('errors' in data) {
                valdidationErrors = data.errors?.errors
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject([error, valdidationErrors]);
        }

        return data;
    });
}