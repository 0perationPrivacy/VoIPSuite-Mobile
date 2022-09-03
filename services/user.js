
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { store } from '../redux/store';
import { userActions } from '../redux/actions';

export const userService = {
    login,
    logout,
    register,
    changeUsername,
    changePassword
};

var API_URL = getServerUrl();

function login(data) {
    let { server_url, ...rest } = data;
    server_url = server_url ? server_url : API_URL;

    console.log('server_url ====>', server_url)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
    };

    return fetch(`${server_url}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function logout() {
    // localStorage.removeItem('user');
}

function register(user) {
    let { server_url, ...rest } = user;
    server_url = server_url ? server_url : API_URL;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
    };

    return fetch(`${server_url}/auth/register`, requestOptions).then(handleResponse);
}

function changeUsername(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(user)
    };

    return fetch(`${API_URL}/auth/username/update`, requestOptions).then(handleResponse);
}

function changePassword(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(user)
    };

    return fetch(`${API_URL}/auth/password/update`, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log(data, response.status);
        if (!response.ok) {
            if (response.status === 401) {
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