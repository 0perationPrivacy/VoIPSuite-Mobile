import {uploadConstants} from '../constants';
const initialState = {
  isLoading: false,
};

export function uploads(state = initialState, action) {
  switch (action.type) {
    case uploadConstants.CREATE_UPLOAD_REQUEST:
      return {
        ...initialState,
        isLoading: true,
      };
    case uploadConstants.CREATE_UPLOAD_SUCCESS:
    case uploadConstants.CREATE_UPLOAD_FAILURE:
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}
