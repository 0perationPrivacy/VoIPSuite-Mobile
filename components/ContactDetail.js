import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {navigate} from '../helpers/RootNavigation';
import {useTheme} from '../theme';

const ContactDetail = ({onPressBack = () => {}, contact = {}, onPressMessage = () => {}}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const onPressEditContact = () => {
    navigate('Contact', {item: contact});
  };

  const {first_name, last_name, number} = contact || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name={'arrow-left'} size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressEditContact} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name={'edit'} size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.avatar}>
          <Feather size={44} name={'user'} color={theme.colors.textSecondary} />
        </View>
        <Text style={styles.contactName}>
          {first_name} {last_name}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <View style={styles.numberRow}>
          <Feather size={16} name={'phone'} color={theme.colors.textSecondary} style={styles.numberIcon} />
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <TouchableOpacity onPress={onPressMessage} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name={'message-circle'} size={22} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mainContent: {
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      marginBottom: theme.spacing.md,
    },
    contactName: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.separator,
      marginVertical: theme.spacing.lg,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    numberRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    numberIcon: {
      marginRight: theme.spacing.sm,
    },
    numberText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textPrimary,
    },
  });

export default ContactDetail;
