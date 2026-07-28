import {callConstants} from '../constants';

const initialState = {
  isLoading: false,
  credentials: null,
  registrationState: 'none',
  registrationMessage: null,
  history: [],
  activeCall: null,
  encryption: {sas: null, verified: false},
};

export function call(state = initialState, action) {
  switch (action.type) {
    case callConstants.GET_CREDENTIALS_REQUEST:
      return {...state, isLoading: true};
    case callConstants.GET_CREDENTIALS_SUCCESS:
      return {...state, isLoading: false, credentials: action.data};
    case callConstants.GET_CREDENTIALS_FAILURE:
      return {...state, isLoading: false, credentials: null};

    case callConstants.GET_HISTORY_REQUEST:
      return {...state, isLoading: true};
    case callConstants.GET_HISTORY_SUCCESS:
      return {...state, isLoading: false, history: action.data};
    case callConstants.GET_HISTORY_FAILURE:
      return {...state, isLoading: false};

    case callConstants.REGISTRATION_STATE_CHANGED:
      return {...state, registrationState: action.data.state, registrationMessage: action.data.message};

    case callConstants.CALL_STATE_CHANGED:
      return {
        ...state,
        activeCall: action.data,
        encryption:
          action.data.state === 'ended' || action.data.state === 'error'
            ? {sas: null, verified: false}
            : state.encryption,
      };

    case callConstants.CALL_ENDED:
      return {...state, activeCall: null, encryption: {sas: null, verified: false}};

    default:
      return state;
  }
}
