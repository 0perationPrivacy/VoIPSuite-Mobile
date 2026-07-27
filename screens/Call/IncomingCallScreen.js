import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {callActions} from '../../redux/actions/call';
import {useTheme} from '../../theme';

// Shown when the app is already foregrounded and an incoming call arrives —
// the lock-screen/backgrounded case is handled natively by
// android/.../voip/IncomingCallActivity.kt instead, since RN may not even be
// running yet at that point.
const IncomingCallScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const dispatch = useDispatch();

  const activeCall = useSelector(state => state.call.activeCall);
  const number = activeCall?.number || route.params?.number || 'Unknown';

  const onAccept = () => {
    dispatch(callActions.answerCallAction());
  };

  const onReject = () => {
    dispatch(callActions.rejectCallAction());
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.label}>Incoming call</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{number?.replace(/\D/g, '')?.slice(-2) || '#'}</Text>
        </View>
        <Text style={styles.number}>{number}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.actionColumn}>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={onReject}>
            <Feather name="phone-off" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Decline</Text>
        </View>
        <View style={styles.actionColumn}>
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept}>
            <Feather name="phone" size={28} color={theme.colors.textOnAccent} />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Accept</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.xl,
    },
    top: {
      alignItems: 'center',
      marginTop: theme.spacing.xxxl,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 112,
      height: 112,
      borderRadius: 56,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      ...theme.typography.largeTitle,
      color: theme.colors.textSecondary,
    },
    number: {
      ...theme.typography.title1,
      color: theme.colors.textPrimary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    actionColumn: {
      alignItems: 'center',
    },
    actionButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    rejectButton: {
      backgroundColor: theme.colors.destructive,
    },
    acceptButton: {
      backgroundColor: theme.colors.success,
    },
    actionLabel: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
    },
  });

export default IncomingCallScreen;
