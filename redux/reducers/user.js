import { userConstants } from '../constants';
const initialState = {
    isLoading: false,
    user: null,
    loggedIn: false,
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                user: action.user,
                loggedIn: true,
                isLoading: false,
            };
        case userConstants.NAME_CHANGE_SUCCESS:
            let __user = { ...state.user, data: action.user }
            return {
                user: __user,
                loggedIn: true,
                isLoading: false,
            };
        case userConstants.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        case userConstants.LOGOUT:
            return {
                user: null,
                loggedIn: false,
            };
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