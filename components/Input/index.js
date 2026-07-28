import React, {useEffect, useRef, useState} from 'react';
import {TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useController} from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../../theme';

const CustomInput = ({
  customStyle = {},
  control,
  name,
  onChangeInput,
  onInputLeave,
  defaultValue,
  isError,
  errors,
  customIconWrap = {},
  secureTextEntry = false,
  customSecureIconWrap = {},
  icon = null,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isSecure, setIsSecure] = useState(false);
  const inputRef = useRef(null);
  const hasError = Boolean(isError || errors?.[name]);

  useFocusEffect(
    React.useCallback(() => {
      let localRef = null;
      if (inputRef.current) localRef = inputRef.current;

      return () => {
        localRef?.blur();
      };
    }, []),
  );

  useEffect(() => {
    if (secureTextEntry) {
      setIsSecure(secureTextEntry);
    }
  }, [secureTextEntry]);

  const {field} = useController({
    control,
    defaultValue,
    name,
  });

  const onChangeInputText = text => {
    const {onChange} = field;
    onChange(text);

    if (onChangeInput) {
      onChangeInput(name, text);
    }
  };

  const _onInputLeave = event => {
    if (onInputLeave) {
      onInputLeave(name, event.nativeEvent.text);
    }
  };

  return (
    <View style={[styles.mainWrap, hasError && styles.mainWrapError, customStyle]}>
      {icon && (
        <View style={[styles.iconWrap, customIconWrap]}>
          <Icon name={icon} size={17} color={hasError ? theme.colors.destructive : theme.colors.textTertiary} />
        </View>
      )}
      <TextInput
        {...rest}
        ref={inputRef}
        style={styles.input}
        underlineColorAndroid={'transparent'}
        onChangeText={onChangeInputText}
        onEndEditing={_onInputLeave}
        placeholderTextColor={theme.colors.textTertiary}
        defaultValue={defaultValue}
        secureTextEntry={isSecure}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={[styles.iconWrap, customSecureIconWrap]}
          onPress={() => setIsSecure(!isSecure)}>
          <Icon
            name={isSecure ? 'eye' : 'eye-slash'}
            size={17}
            color={theme.colors.textTertiary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    mainWrapError: {
      borderColor: theme.colors.destructive,
    },
    iconWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      fontFamily: theme.typography.body.fontFamily,
      color: theme.colors.textPrimary,
    },
  });

export default CustomInput;
