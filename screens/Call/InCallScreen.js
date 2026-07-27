import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {callActions} from '../../redux/actions/call';
import {VoipEngine} from '../../helpers/voip/VoipEngine';
import {useTheme} from '../../theme';

const STATE_LABEL = {
  connecting: 'Calling…',
  ringing: 'Ringing…',
  connected: null, // replaced by the live timer
  ended: 'Call ended',
  error: 'Call failed',
};

const formatDuration = seconds => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const InCallScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const dispatch = useDispatch();

  const activeCall = useSelector(state => state.call.activeCall);
  const number = activeCall?.number || route.params?.number || 'Unknown';
  const state = activeCall?.state || 'connecting';
  const encryption = activeCall?.encryption;

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sasModalVisible, setSasModalVisible] = useState(false);
  const [sasInfo, setSasInfo] = useState(null);

  useEffect(() => {
    if (state !== 'connected') {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [state]);

  const onToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    dispatch(callActions.setMutedAction(next));
  };

  const onToggleSpeaker = () => {
    const next = !isSpeaker;
    setIsSpeaker(next);
    dispatch(callActions.setSpeakerAction(next));
  };

  const onPressDtmf = digit => {
    dispatch(callActions.sendDtmfAction(digit));
  };

  const onPressHangUp = () => {
    dispatch(callActions.hangUpAction());
  };

  const openSasModal = async () => {
    const info = await VoipEngine.getEncryptionInfo();
    setSasInfo(info);
    setSasModalVisible(true);
  };

  const onConfirmSas = matches => {
    dispatch(callActions.confirmSasAction(matches));
    setSasModalVisible(false);
  };

  const renderEncryptionRow = () => {
    if (state !== 'connected' || encryption !== 'zrtp') return null;

    return (
      <TouchableOpacity style={styles.encryptionRow} onPress={openSasModal} activeOpacity={0.7}>
        <Feather name="lock" size={14} color={theme.colors.success} />
        <Text style={styles.encryptionText}>Encrypted call · tap to verify</Text>
      </TouchableOpacity>
    );
  };

  const renderSasModal = () => {
    return (
      <Modal visible={sasModalVisible} transparent animationType="fade" onRequestClose={() => setSasModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Feather name="shield" size={28} color={theme.colors.success} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Verify encryption</Text>
            <Text style={styles.modalBody}>
              Read this code to the other person. If it matches what's on their screen, your call is confirmed end-to-end
              encrypted and no one in between can listen in.
            </Text>
            <Text style={styles.sasPhrase}>{sasInfo?.sas || '—'}</Text>
            <TouchableOpacity style={styles.modalPrimaryButton} onPress={() => onConfirmSas(true)}>
              <Text style={styles.modalPrimaryButtonText}>Codes match</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={() => onConfirmSas(false)}>
              <Text style={styles.modalSecondaryButtonText}>They don't match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderKeypad = () => {
    if (!showKeypad) return null;
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    return (
      <View style={styles.keypad}>
        {digits.map(digit => (
          <TouchableOpacity key={digit} style={styles.keypadKey} onPress={() => onPressDtmf(digit)} activeOpacity={0.6}>
            <Text style={styles.keypadKeyText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{number?.replace(/\D/g, '')?.slice(-2) || '#'}</Text>
        </View>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.state}>{state === 'connected' ? formatDuration(elapsed) : STATE_LABEL[state]}</Text>
        {renderEncryptionRow()}
      </View>

      {renderKeypad()}

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={onToggleMute}>
            <Feather name={isMuted ? 'mic-off' : 'mic'} size={22} color={isMuted ? theme.colors.textOnAccent : theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, isSpeaker && styles.controlButtonActive]} onPress={onToggleSpeaker}>
            <Feather name="volume-2" size={22} color={isSpeaker ? theme.colors.textOnAccent : theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, showKeypad && styles.controlButtonActive]} onPress={() => setShowKeypad(!showKeypad)}>
            <Feather name="grid" size={22} color={showKeypad ? theme.colors.textOnAccent : theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.hangUpButton} onPress={onPressHangUp}>
          <Feather name="phone-off" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {renderSasModal()}
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
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      ...theme.typography.title1,
      color: theme.colors.textSecondary,
    },
    number: {
      ...theme.typography.title1,
      color: theme.colors.textPrimary,
    },
    state: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    encryptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.pill,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    encryptionText: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    keypad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    keypadKey: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing.sm,
    },
    keypadKeyText: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
    },
    controls: {
      alignItems: 'center',
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xxl,
    },
    controlButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.md,
    },
    controlButtonActive: {
      backgroundColor: theme.colors.accent,
    },
    hangUpButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.destructive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    modalCard: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    modalIcon: {
      marginBottom: theme.spacing.md,
    },
    modalTitle: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    modalBody: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    sasPhrase: {
      ...theme.typography.title1,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    modalPrimaryButton: {
      width: '100%',
      backgroundColor: theme.colors.success,
      borderRadius: theme.radius.pill,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    modalPrimaryButtonText: {
      ...theme.typography.headline,
      color: '#FFFFFF',
    },
    modalSecondaryButton: {
      width: '100%',
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    modalSecondaryButtonText: {
      ...theme.typography.body,
      color: theme.colors.destructive,
    },
  });

export default InCallScreen;
