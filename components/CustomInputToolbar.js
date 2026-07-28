import React from 'react';
import {StyleSheet} from 'react-native';
import {InputToolbar} from 'react-native-gifted-chat/src';

export default function MessageInput({backgroundColor, borderColor, ...props}) {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: borderColor,
      }}
    />
  );
}
