package com.voip;

import static com.voip.HeadlessNotificationModule.LOG_TAG;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

public class NotificationJsDelivery {
    private final ReactContext mReactContext;

    public NotificationJsDelivery(ReactContext reactContext) {
        mReactContext = reactContext;
    }

    void sendEvent(String eventName, Object params) {
        Log.d(LOG_TAG, "checking");
        Log.d(LOG_TAG, String.valueOf(mReactContext));

        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    void notifyNotification() {
        WritableMap params = Arguments.createMap();
        // params.putString("dataJSON", "ddadadadadadad");

        sendEvent("notificationTapEvent", params);
    }

    String convertJSON(Bundle bundle) {
        try {
            JSONObject json = convertJSONObject(bundle);
            return json.toString();
        } catch (JSONException e) {
            return null;
        }
    }

    // a Bundle is not a map, so we have to convert it explicitly
    private JSONObject convertJSONObject(Bundle bundle) throws JSONException {
        JSONObject json = new JSONObject();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            Object value = bundle.get(key);
            if (value instanceof Bundle) {
                json.put(key, convertJSONObject((Bundle) value));
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                json.put(key, JSONObject.wrap(value));
            } else {
                json.put(key, value);
            }
        }
        return json;
    }

}
