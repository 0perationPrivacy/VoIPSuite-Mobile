import {callConstants} from '../constants';
import {callService} from '../../services';
import {alertActions} from './alert';
import {VoipEngine} from '../../helpers/voip/VoipEngine';
import {navigate, goBack, canGoBack} from '../../helpers/RootNavigation';

export const callActions = {
  connectCallEngineAction,
  getCallHistoryAction,
  startCallAction,
  answerCallAction,
  rejectCallAction,
  hangUpAction,
  setMutedAction,
  setSpeakerAction,
  sendDtmfAction,
  confirmSasAction,
  initCallListenersAction,
};

let listenersInitialized = false;

// Wires native call-engine events to Redux. Idempotent and safe to call
// repeatedly (e.g. on every Splash mount) — real listener registration only
// happens once per app process.
function initCallListenersAction() {
  return dispatch => {
    if (listenersInitialized) return;
    listenersInitialized = true;

    VoipEngine.addListener('RegistrationStateChanged', data => {
      dispatch({type: callConstants.REGISTRATION_STATE_CHANGED, data});
    });

    VoipEngine.addListener('CallStateChanged', data => {
      dispatch({type: callConstants.CALL_STATE_CHANGED, data});

      if (data.direction === 'incoming' && data.state === 'ringing') {
        navigate('IncomingCall', {number: data.number});
      } else if (data.state === 'ended' || data.state === 'error') {
        dispatch({type: callConstants.CALL_ENDED});
        if (canGoBack()) {
          goBack();
        }
      }
    });
  };
}

// Fetches this profile's SIP credentials, then hands them to the native
// engine to register — call once at login and again on every profile switch
// (see screens/Splash and components/HomeHeader).
function connectCallEngineAction(settingId) {
  return dispatch => {
    dispatch(request());

    callService
      .getSipCredentials(settingId)
      .then(
        response => {
          dispatch(success(response?.data));

          if (VoipEngine.isAvailable()) {
            VoipEngine.register(response.data).catch(err => {
              dispatch(alertActions.error(err.message));
            });
          }
        },
        ([error]) => {
          dispatch(failure());
          // Not provisioned yet is an expected, quiet state (mirrors how the
          // dialer already shows "calling isn't enabled yet") — don't toast it.
        }
      );
  };

  function request() {
    return {type: callConstants.GET_CREDENTIALS_REQUEST};
  }
  function success(data) {
    return {type: callConstants.GET_CREDENTIALS_SUCCESS, data};
  }
  function failure() {
    return {type: callConstants.GET_CREDENTIALS_FAILURE};
  }
}

function getCallHistoryAction(settingId) {
  return dispatch => {
    dispatch(request());

    callService.getCallHistory(settingId).then(
      response => {
        dispatch(success(response?.data || []));
      },
      ([error]) => {
        dispatch(failure());
        dispatch(alertActions.error(error?.toString?.() ?? 'Could not load call history'));
      }
    );
  };

  function request() {
    return {type: callConstants.GET_HISTORY_REQUEST};
  }
  function success(data) {
    return {type: callConstants.GET_HISTORY_SUCCESS, data};
  }
  function failure() {
    return {type: callConstants.GET_HISTORY_FAILURE};
  }
}

function startCallAction(number) {
  return dispatch => {
    VoipEngine.startCall(number)
      .then(() => {
        navigate('InCall', {number});
      })
      .catch(err => {
        dispatch(alertActions.error(err.message));
      });
  };
}

function answerCallAction() {
  return () => {
    VoipEngine.answerCall();
    navigate('InCall');
  };
}

function rejectCallAction() {
  return () => {
    VoipEngine.rejectCall();
  };
}

function hangUpAction() {
  return () => {
    VoipEngine.hangUp();
  };
}

function setMutedAction(muted) {
  return () => {
    VoipEngine.setMuted(muted);
  };
}

function setSpeakerAction(enabled) {
  return () => {
    VoipEngine.setSpeakerEnabled(enabled);
  };
}

function sendDtmfAction(digit) {
  return () => {
    VoipEngine.sendDtmf(digit);
  };
}

function confirmSasAction(verified) {
  return () => {
    VoipEngine.confirmSasVerified(verified);
  };
}
