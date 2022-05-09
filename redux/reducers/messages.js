import { messagesConstants } from '../constants';
const initialState = {
  isLoading: false,
  items: [],
};

export function messages(state = initialState, action) {
  switch (action.type) {
    case messagesConstants.GET_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case messagesConstants.GET_MESSAGES_SUCCESS:
      return {
        isLoading: false,
        items: action.data,
      };
    case messagesConstants.GET_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state
  }
}