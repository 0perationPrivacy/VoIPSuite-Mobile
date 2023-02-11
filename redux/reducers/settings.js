import {settingsConstants} from '../constants';
const initialState = {
  isLoading: false,
  profileSettings: {},
  numbers: [],
};

export function settings(state = initialState, action) {
  switch (action.type) {
    case settingsConstants.GET_PROFILE_SETTINGS_REQUEST:
    case settingsConstants.GET_PROFILE_NUMBERS_REQUEST:
    case settingsConstants.CHECK_PROFILE_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case settingsConstants.GET_PROFILE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profileSettings: action.data,
      };
    case settingsConstants.GET_PROFILE_SETTINGS_FAILURE:
    case settingsConstants.CHECK_PROFILE_SETTINGS_SUCCESS:
    case settingsConstants.CHECK_PROFILE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case settingsConstants.GET_PROFILE_NUMBERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        numbers: action.numbers,
      };
    case settingsConstants.GET_PROFILE_NUMBERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        numbers: [],
      };
    default:
      return state;
  }
}
