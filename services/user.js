
import { API_URL } from '../helpers/config';
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

function login(data) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${API_URL}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function logout() {
    // localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${API_URL}/auth/register`, requestOptions).then(handleResponse);
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