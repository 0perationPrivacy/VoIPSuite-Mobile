import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '../theme';

const EmptyList = ({message = 'No messages yet', icon = 'message-circle'}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Feather name={icon} size={28} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl * 2,
    },
    iconBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    message: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
    },
  });

export default memo(EmptyList);
