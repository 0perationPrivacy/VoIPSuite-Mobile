import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Wrapper from '../../components/Wrapper';
import {Header} from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {callActions} from '../../redux/actions/call';
import {VoipEngine} from '../../helpers/voip/VoipEngine';
import {useTheme} from '../../theme';

// Keypad letters follow the standard ITU E.161 layout.
const keys = [
  {value: '1', letters: ''},
  {value: '2', letters: 'ABC'},
  {value: '3', letters: 'DEF'},
  {value: '4', letters: 'GHI'},
  {value: '5', letters: 'JKL'},
  {value: '6', letters: 'MNO'},
  {value: '7', letters: 'PQRS'},
  {value: '8', letters: 'TUV'},
  {value: '9', letters: 'WXYZ'},
  {value: '*', letters: ''},
  {value: '0', letters: '+'},
  {value: '#', letters: ''},
];

const DialPad = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useDispatch();
  const [number, setNumber] = useState('');
  const profile = useSelector(state => state.profile.profileName);
  const registrationState = useSelector(state => state.call.registrationState);
  const registrationMessage = useSelector(state => state.call.registrationMessage);
  const isReady = registrationState === 'ok' && number.length > 0;

  const onPressKey = value => {
    if (number.length < 15) {
      setNumber(`${number}${value}`);
    }
  };

  // Standard phone-dialer convention (matches Android's own dialer): holding
  // 0 enters + instead. This was the only way to enter a leading + at all —
  // the keypad showed "+" as 0's sub-label but nothing was ever wired to
  // actually produce it, and Linphone's interpretUrl() needs a full E.164
  // number (with +country code) to reliably resolve a destination without
  // relying on account-level dial-plan config this app doesn't set up.
  const onLongPressKey = value => {
    if (value !== '0' || number.length >= 15) return;
    setNumber(`${number}+`);
  };

  const onPressBackspace = () => {
    setNumber(number.slice(0, -1));
  };

  const onLongPressBackspace = () => {
    setNumber('');
  };

  const onPressCall = () => {
    if (!isReady) return;
    dispatch(callActions.startCallAction(number));
  };

  const onPressDevSimulateIncoming = () => {
    VoipEngine.devSimulateIncomingCall(number || '+15551234567').catch(() => {});
  };

  const renderDisplay = () => {
    return (
      <View style={styles.display}>
        <Text style={styles.fromLabel} numberOfLines={1}>
          {profile?.profile ? `Calling from ${profile.profile}` : 'No profile selected'}
        </Text>
        <Text style={styles.number} numberOfLines={1} adjustsFontSizeToFit>
          {number || ' '}
        </Text>
      </View>
    );
  };

  const renderKeypad = () => {
    const rows = [];
    for (let i = 0; i < keys.length; i += 3) {
      rows.push(keys.slice(i, i + 3));
    }

    return (
      <View style={styles.keypad}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.key}
                onPress={() => onPressKey(item.value)}
                onLongPress={() => onLongPressKey(item.value)}
                activeOpacity={0.6}>
                <Text style={styles.keyValue}>{item.value}</Text>
                {!!item.letters && <Text style={styles.keyLetters}>{item.letters}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderActions = () => {
    return (
      <View style={styles.actions}>
        <View style={styles.actionSpacer} />
        <TouchableOpacity style={[styles.callButton, !isReady && styles.callButtonDisabled]} disabled={!isReady} onPress={onPressCall}>
          <Feather name="phone" size={26} color={theme.colors.textOnAccent} />
        </TouchableOpacity>
        <View style={styles.actionSpacer}>
          {number.length > 0 && (
            <TouchableOpacity onPress={onPressBackspace} onLongPress={onLongPressBackspace} hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Feather name="delete" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderNotice = () => {
    if (registrationState === 'ok') return null;
    if (registrationState === 'progress') {
      return <Text style={styles.notice}>Connecting to your calling account…</Text>;
    }
    // 'failed' means a real SIP REGISTER was attempted and rejected — the SIP
    // server's own reason (bad credentials, forbidden, timeout, etc.) is far
    // more actionable than the generic not-provisioned copy below, and the
    // two states shouldn't be conflated.
    if (registrationState === 'failed') {
      return (
        <Text style={styles.notice}>
          Registration failed{registrationMessage ? `: ${registrationMessage}` : ''} — check your SIP credentials in Profile Settings.
        </Text>
      );
    }
    return <Text style={styles.notice}>Calling isn't set up for this profile yet — open Profile Settings and save again to finish provisioning.</Text>;
  };

  return (
    <Wrapper header={<Header title={'Call'} />}>
      <View style={styles.container}>
        {renderDisplay()}
        {renderKeypad()}
        {renderActions()}
        {renderNotice()}
        {__DEV__ && (
          <TouchableOpacity onPress={onPressDevSimulateIncoming} style={styles.devButton}>
            <Text style={styles.devButtonText}>Dev: simulate incoming call</Text>
          </TouchableOpacity>
        )}
      </View>
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    display: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    fromLabel: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    number: {
      ...theme.typography.largeTitle,
      fontSize: 32,
      lineHeight: 40,
      color: theme.colors.textPrimary,
      letterSpacing: 1,
    },
    keypad: {
      width: '100%',
    },
    keypadRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
    },
    key: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    keyValue: {
      ...theme.typography.title1,
      fontSize: 26,
      color: theme.colors.textPrimary,
    },
    keyLetters: {
      ...theme.typography.caption,
      fontSize: 9,
      color: theme.colors.textTertiary,
      letterSpacing: 1.5,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    actionSpacer: {
      width: 72,
      alignItems: 'center',
    },
    callButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    callButtonDisabled: {
      opacity: 0.4,
    },
    notice: {
      ...theme.typography.footnote,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
    devButton: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    devButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      textDecorationLine: 'underline',
    },
  });

export default DialPad;
