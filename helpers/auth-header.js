import { store } from "../redux/store";

const state = store.getState();
export function authHeader() {
    // return authorization header with jwt token

    const { user } = state?.authentication;

    console.log(user, '<====  user object in token')

    if (user && user.token) {
        return { 'token': user?.data?.token };
    } else {
        return {};
    }
}

export function getUserId() {
    const { user } = state?.authentication;

    return user?.data?._id;
}