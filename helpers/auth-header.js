import { store } from "../redux/store";


export function authHeader() {
    // return authorization header with jwt token
    const state = store.getState();
    const { user } = state?.authentication;

    if (user && user.token) {
        return { 'token': user.token };
    } else {
        return {};
    }
}