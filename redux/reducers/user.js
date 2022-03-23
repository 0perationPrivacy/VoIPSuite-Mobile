import { userConstants } from '../constants';
const initialState = {
    loggingIn: false,
    user: {}
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}

export function registration(state = {}, action) {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
            return { isLoading: true };
        case userConstants.REGISTER_SUCCESS:
            return { isLoading: false };
        case userConstants.REGISTER_FAILURE:
            return { isLoading: false };
        default:
            return state
    }
}