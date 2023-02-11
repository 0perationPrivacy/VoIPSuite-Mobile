import {emailConstants} from '../constants';
const initialState = {
  isLoading: false,
  settings: {},
};

export function email(state = initialState, action) {
  switch (action.type) {
    case emailConstants.CREATE_EMAIL_REQUEST:
      return {
        ...initialState,
        isLoading: true,
      };
    case emailConstants.CREATE_EMAIL_SUCCESS:
    case emailConstants.CREATE_EMAIL_FAILURE:
    case emailConstants.SAVE_EMAIL_SETTINGS_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
      };

    case emailConstants.GET_EMAIL_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        settings: action.settings,
      };

    default:
      return state;
  }
}
