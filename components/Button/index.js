import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {useTheme} from '../../theme';

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  containerStyle = {},
  buttonStyle = {},
  titleStyle = {},
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const isDisabled = disabled || loading;

  const variantStyle = variant === 'secondary' ? styles.secondary : styles.primary;
  const variantTitleStyle = variant === 'secondary' ? styles.secondaryTitle : styles.primaryTitle;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        variantStyle,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        containerStyle,
        buttonStyle,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? theme.colors.accent : theme.colors.textOnAccent} />
      ) : (
        <Text style={[styles.title, variantTitleStyle, titleStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    base: {
      width: '100%',
      minHeight: theme.spacing.xxxl + theme.spacing.md,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    primary: {
      backgroundColor: theme.colors.accent,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
    title: {
      fontFamily: theme.typography.headline.fontFamily,
      fontSize: theme.typography.headline.fontSize,
    },
    primaryTitle: {
      color: theme.colors.textOnAccent,
    },
    secondaryTitle: {
      color: theme.colors.textPrimary,
    },
  });

export default CustomButton;
