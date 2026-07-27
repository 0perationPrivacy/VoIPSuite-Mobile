import {NativeModules, NativeEventEmitter, Platform} from 'react-native';

// Thin wrapper around the native VoipCallModule (Kotlin, wraps liblinphone —
// see android/app/src/main/java/com/voip/voip/). Looked up lazily rather than
// at import time so this file (and anything that imports it, like the dialer
// screen) doesn't crash to a red screen before the native module is registered —
// useful during incremental development, and the honest behavior for iOS,
// which has no calling engine yet.
function getNativeModule() {
  return NativeModules.VoipCallModule || null;
}

let emitter = null;
function getEmitter() {
  const native = getNativeModule();
  if (!native) return null;
  if (!emitter) {
    emitter = new NativeEventEmitter(Platform.OS === 'ios' ? undefined : native);
  }
  return emitter;
}

const NOT_AVAILABLE = 'Calling isn\'t available on this build — the native call engine isn\'t installed.';

function unavailable() {
  return Promise.reject(new Error(NOT_AVAILABLE));
}

export const VoipEngine = {
  isAvailable() {
    return !!getNativeModule();
  },

  // registrar/username/password/number come from GET /api/call/sip-credentials
  // — provider is 'telnyx' | 'twilio', passed through for the native side's
  // per-provider transport quirks (both are otherwise plain SIP REGISTER).
  // number is the actual purchased DID, used as the outbound caller ID —
  // distinct from username (just the SIP credential's auth identifier);
  // Telnyx/Twilio reject calls outright if the caller ID isn't a real owned
  // number on the account.
  register({registrar, username, password, provider, number}) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.register(registrar, username, password, provider, number || '');
  },

  unregister() {
    const native = getNativeModule();
    if (!native) return Promise.resolve();
    return native.unregister();
  },

  startCall(number) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.startCall(number);
  },

  answerCall() {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.answerCall();
  },

  rejectCall() {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.rejectCall();
  },

  hangUp() {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.hangUp();
  },

  setMuted(muted) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.setMuted(muted);
  },

  setSpeakerEnabled(enabled) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.setSpeakerEnabled(enabled);
  },

  sendDtmf(digit) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.sendDtmf(String(digit));
  },

  // The other party must read their SAS aloud and you confirm it matches —
  // same UX as Signal's call-verification code. Call only after the state
  // event reports encryption:'zrtp'; the token exists once ZRTP's key
  // exchange completes, mid-call.
  getEncryptionInfo() {
    const native = getNativeModule();
    if (!native) return Promise.resolve({encrypted: false, mechanism: null, sas: null, verified: false});
    return native.getEncryptionInfo();
  },

  confirmSasVerified(verified) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.confirmSasVerified(verified);
  },

  // Debug-only: exercises the incoming-call path (Telecom routing,
  // IncomingCallActivity, answer/reject) without real SIP traffic. The
  // native side itself refuses this outside BuildConfig.DEBUG.
  devSimulateIncomingCall(number) {
    const native = getNativeModule();
    if (!native) return unavailable();
    return native.devSimulateIncomingCall(number);
  },

  // Event shapes emitted from the native side:
  //   RegistrationStateChanged: {provider, state: 'none'|'progress'|'ok'|'failed', message}
  //   CallStateChanged: {callId, direction:'incoming'|'outgoing', state:'ringing'|'connecting'|'connected'|'ended'|'error', number, encryption:'none'|'srtp'|'zrtp', message}
  //   IncomingCall: {callId, number}
  addListener(eventName, callback) {
    const em = getEmitter();
    if (!em) return {remove: () => {}};
    return em.addListener(eventName, callback);
  },
};

export default VoipEngine;
