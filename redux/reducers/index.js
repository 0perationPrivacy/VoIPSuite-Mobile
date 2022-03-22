import { combineReducers } from 'redux';
import { alert } from './alert';
import { authentication, registration } from './user';

export default combineReducers({
    alert,
    authentication,
    registration
});
