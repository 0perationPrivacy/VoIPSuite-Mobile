import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {Header, Input, Button} from '../../components';
import Icon from 'react-native-vector-icons/Feather';
import Wrapper from '../../components/Wrapper';
import {navigate} from '../../helpers/RootNavigation';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../redux/actions';
import {useTheme} from '../../theme';

const Accounts = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState(null);

  const {control} = useForm();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.authentication.isLoading);

  const onPressChangeUsername = () => {
    navigate('changeusername');
  };

  const onPressChangePassword = () => {
    navigate('changepassword');
  };

  const onPressDeleteAccount = () => {
    setPassword('');
    setDeleteError(null);
    setDeleteVisible(true);
  };

  const onCloseDelete = () => {
    setDeleteVisible(false);
  };

  const onConfirmDelete = () => {
    if (!password) {
      setDeleteError('Enter your password to confirm.');
      return;
    }

    setDeleteError(null);
    dispatch(userActions.deleteAccountAction({password}, setDeleteError));
  };

  const Row = ({icon, label, onPress, destructive = false, isLast = false, comingSoon = false}) => (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowDivider, comingSoon && styles.rowDisabled]}
      onPress={onPress}
      disabled={comingSoon}
      activeOpacity={0.7}>
      <View style={[styles.iconBadge, destructive && styles.iconBadgeDestructive]}>
        <Icon name={icon} size={17} color={destructive ? theme.colors.destructive : theme.colors.accent} />
      </View>
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {comingSoon ? <Text style={styles.soonChip}>Soon</Text> : <Icon name="chevron-right" size={18} color={theme.colors.textTertiary} />}
    </TouchableOpacity>
  );

  const renderDeleteModal = () => {
    return (
      <Modal isVisible={isDeleteVisible} onBackdropPress={onCloseDelete}>
        <View style={styles.modalCard}>
          <View style={[styles.iconBadge, styles.iconBadgeDestructive, styles.modalIcon]}>
            <Icon name="alert-triangle" size={20} color={theme.colors.destructive} />
          </View>
          <Text style={styles.modalTitle}>Delete account</Text>
          <Text style={styles.modalBody}>
            This erases every profile, contact, and message on the server, and releases your phone numbers back to the provider. It cannot be undone.
          </Text>
          <Input
            placeholder="Confirm your password"
            control={control}
            name="delete_password"
            secureTextEntry
            icon={'lock'}
            onChangeInput={(name, text) => setPassword(text)}
            isError={!!deleteError}
            customStyle={styles.modalInput}
          />
          {!!deleteError && <Text style={styles.modalError}>{deleteError}</Text>}
          <Button
            title="Delete everything"
            onPress={onConfirmDelete}
            loading={isLoading}
            containerStyle={styles.destructiveButton}
            titleStyle={styles.destructiveButtonTitle}
          />
          <Button title="Cancel" variant="secondary" onPress={onCloseDelete} containerStyle={styles.modalCancel} />
        </View>
      </Modal>
    );
  };

  return (
    <Wrapper header={<Header title={'Account settings'} />}>
      <View style={styles.card}>
        <Row icon="user" label="Change username" onPress={onPressChangeUsername} />
        <Row icon="key" label="Change password" onPress={onPressChangePassword} />
        <Row icon="shuffle" label="Fallback settings" comingSoon />
        <Row icon="trash-2" label="Delete account" onPress={onPressDeleteAccount} destructive isLast />
      </View>
      {renderDeleteModal()}
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    rowDisabled: {
      opacity: 0.5,
    },
    iconBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    iconBadgeDestructive: {
      backgroundColor: 'rgba(229,72,77,0.14)',
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    labelDestructive: {
      color: theme.colors.destructive,
    },
    soonChip: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      overflow: 'hidden',
    },
    modalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
    },
    modalIcon: {
      marginRight: 0,
      marginBottom: theme.spacing.md,
      alignSelf: 'center',
    },
    modalTitle: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    modalBody: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalInput: {
      marginBottom: theme.spacing.sm,
    },
    modalError: {
      ...theme.typography.footnote,
      color: theme.colors.destructive,
      marginBottom: theme.spacing.sm,
    },
    destructiveButton: {
      backgroundColor: theme.colors.destructive,
      marginBottom: theme.spacing.sm,
    },
    destructiveButtonTitle: {
      color: '#FFFFFF',
    },
    modalCancel: {
      marginBottom: 0,
    },
  });

export default Accounts;
