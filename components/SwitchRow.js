import React from 'react';
import {View, Text, StyleSheet, Switch, Platform} from 'react-native';
import {useTheme} from '../theme';

const SwitchRow = ({title, description = null, value = false, onValueChange = () => {}, style = {}}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.row, style]}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: theme.colors.border, true: theme.colors.accent}}
        thumbColor={Platform.OS === 'android' ? (value ? theme.colors.surface : theme.colors.backgroundSecondary) : undefined}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
    },
    body: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    description: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

export default SwitchRow;
