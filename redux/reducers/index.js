import { combineReducers } from 'redux';
import { alert } from './alert';
import { authentication, registration } from './user';
import { profile } from './profile';

export default combineReducers({
    alert,
    authentication,
    registration,
    profile
});
