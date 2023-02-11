import {contactConstants} from '../constants';
const initialState = {
  isLoading: false,
  items: [],
};

export function contact(state = initialState, action) {
  switch (action.type) {
    
    case contactConstants.CREATE_CONTACT_REQUEST:
    case contactConstants.GET_CONTACT_REQUEST:
    case contactConstants.DELETE_CONTACT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case contactConstants.CREATE_CONTACT_SUCCESS:
    case contactConstants.CREATE_CONTACT_FAILURE:
    case contactConstants.GET_CONTACT_FAILURE:
    case contactConstants.DELETE_CONTACT_SUCCESS:
    case contactConstants.DELETE_CONTACT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case contactConstants.GET_CONTACT_SUCCESS:
      return {
        isLoading: false,
        items: action.data,
      };

    default:
      return state;
  }
}
