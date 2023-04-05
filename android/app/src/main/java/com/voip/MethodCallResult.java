package com.voip;

import androidx.annotation.Nullable;

public interface MethodCallResult<T> {
    void onComplete(@Nullable Exception error, T result);
}
