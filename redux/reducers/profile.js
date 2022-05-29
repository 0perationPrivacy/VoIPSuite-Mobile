import { profileConstants } from '../constants';
const initialState = {
  isLoading: false,
  items: [],
  profileName: {},
};

export function profile(state = initialState, action) {
  switch (action.type) {

    case profileConstants.CREATE_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case profileConstants.CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case profileConstants.CREATE_PROFILE_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    case profileConstants.GET_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case profileConstants.GET_PROFILE_SUCCESS:
      return {
        isLoading: false,
        items: action.data,
      };
    case profileConstants.GET_PROFILE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case profileConstants.SET_PROFILE_NAME:
      return {
        ...state,
        profileName: action.profile,
      };
    default:
      return state
  }
}