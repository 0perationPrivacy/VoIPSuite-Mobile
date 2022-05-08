import { profileConstants } from '../constants';
const initialState = {
  isLoading: false,
};

export function profile(state = initialState, action) {
  switch (action.type) {
    case profileConstants.CREATE_PROFILE_REQUEST:
      return { isLoading: true };
    case profileConstants.CREATE_PROFILE_SUCCESS:
      return { isLoading: false };
    case profileConstants.CREATE_PROFILE_FAILURE:
      return { isLoading: false };
    default:
      return state
  }
}