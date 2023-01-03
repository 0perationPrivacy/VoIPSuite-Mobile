
import { getServerUrl } from '../helpers/config';
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
    changePassword
};

var API_URL = getServerUrl();

async function login(data) {
    let { server_url, ...rest } = data;
    server_url = server_url ? server_url : API_URL;

    console.log(server_url);

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
    AsyncStorage.clear();
    navigateAndReset('Login')
}

async function register(user) {
    let { server_url, ...rest } = user;
    server_url = server_url ? server_url : API_URL;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
    };

    const response = await fetch(`${server_url}/auth/register`, requestOptions);
    return handleResponse(response, false);
}

async function changeUsername(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(user)
    };

    const response = await fetch(`${API_URL}/auth/username/update`, requestOptions);
    return handleResponse(response);
}

async function changePassword(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(user)
    };

    const response = await fetch(`${API_URL}/auth/password/update`, requestOptions);
    return handleResponse(response);
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