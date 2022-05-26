import { combineReducers } from 'redux';
import { alert } from './alert';
import { authentication, registration } from './user';
import { profile } from './profile';
import { messages } from './messages';
import { contact } from './contact';
import { call } from './call';
import { email } from './email';
import { settings } from './settings';
import { uploads } from './uploads';

const appReducer = combineReducers({
    alert,
    authentication,
    registration,
    profile,
    messages,
    contact,
    call,
    email,
    settings,
    uploads
});


const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}

export default rootReducer
