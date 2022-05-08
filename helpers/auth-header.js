export function authHeader() {
    // return authorization header with jwt token
    // let user = JSON.parse(localStorage.getItem('user'));
    let user = null;

    if (user && user.token) {
        return { 'token': user.token };
    } else {
        return {};
    }
}