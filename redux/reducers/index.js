import { combineReducers } from 'redux';
import { alert } from './alert';
import { authentication, registration } from './user';
import { profile } from './profile';
import { messages } from './messages';
import { contact } from './contact';

export default combineReducers({
    alert,
    authentication,
    registration,
    profile,
    messages,
    contact
});
