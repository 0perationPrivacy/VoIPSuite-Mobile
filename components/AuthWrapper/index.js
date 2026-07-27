import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../theme';

const AuthWrapper = ({children}) => {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.spacing.xxxl,
          backgroundColor: theme.colors.background,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{flex: 1}}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthWrapper;
