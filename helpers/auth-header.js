import { store } from "../redux/store";

const state = store.getState();
export function authHeader() {
    // return authorization header with jwt token
  
    const { user } = state?.authentication;

    if (user && user.token) {
        return { 'token': user.token };
    } else {
        return {};
    }
}

export function getUserId() {
    const { user } = state?.authentication;

    return user?.data?._id;
}