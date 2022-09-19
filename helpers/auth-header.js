import { store } from "../redux/store";

export function authHeader() {
    // return authorization header with jwt token

    var state = store.getState();
    const { user } = state?.authentication;

    if (user && user.token) {
        console.log(user?.data?.token, '<====  user?.data?.token');
        console.log(user, '<====  user');
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