import { contactConstants } from '../constants';
const initialState = {
  isLoading: false,
  items: [],
};

export function contact(state = initialState, action) {
  switch (action.type) {

    case contactConstants.CREATE_CONTACT_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case contactConstants.CREATE_CONTACT_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case contactConstants.CREATE_CONTACT_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    case contactConstants.GET_CONTACT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case contactConstants.GET_CONTACT_SUCCESS:
      return {
        isLoading: false,
        items: action.data,
      };
    case contactConstants.GET_CONTACT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state
  }
}