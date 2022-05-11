import { emailConstants } from '../constants';
const initialState = {
  isLoading: false,
};

export function email(state = initialState, action) {
  switch (action.type) {

    case emailConstants.CREATE_EMAIL_REQUEST:
      return {
        isLoading: true
      };
    case emailConstants.CREATE_EMAIL_SUCCESS:
      return {
        isLoading: false
      };
    case emailConstants.CREATE_EMAIL_FAILURE:
      return {
        isLoading: false
      };
    default:
      return state
  }
}