import { settingsConstants } from '../constants';
const initialState = {
  isLoading: false,
  profileSettings: {},
};

export function settings(state = initialState, action) {
  switch (action.type) {
    case settingsConstants.GET_PROFILE_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case settingsConstants.GET_PROFILE_SETTINGS_SUCCESS:
      return {
        isLoading: false,
        profileSettings: action.data,
      };
    case settingsConstants.GET_PROFILE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state
  }
}