import { callConstants } from '../constants';
const initialState = {
  isLoading: false,
  token: {},
};

export function call(state = initialState, action) {
  switch (action.type) {

    case callConstants.GET_TOKEN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case callConstants.GET_TOKEN_SUCCESS:
      return {
        isLoading: false,
        token: action.data,
      };
    case callConstants.GET_TOKEN_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state
  }
}