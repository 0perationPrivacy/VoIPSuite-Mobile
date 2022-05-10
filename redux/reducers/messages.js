import { messagesConstants } from '../constants';
const initialState = {
  isLoading: false,
  items: [],
  messages: [],
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


    case messagesConstants.DELETE_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case messagesConstants.DELETE_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case messagesConstants.DELETE_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case messagesConstants.VIEW_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case messagesConstants.VIEW_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: action.messages,
      };
    case messagesConstants.VIEW_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
      
    default:
      return state
  }
}