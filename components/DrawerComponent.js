import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {navigate, navigateAndReset} from '../helpers/RootNavigation';
import {useDispatch} from 'react-redux';
import {userActions} from '../redux/actions';
import {getOSVersion} from '../helpers/utils';
import {useTheme} from '../theme';

export function DrawerContent(props) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const onPressNavigation = screen => {
    navigate(screen);
  };

  const onPressLogout = () => {
    dispatch(userActions.logout());
  };

  const Row = ({icon: IconComponent, iconName, label, onPress, destructive = false, indented = false}) => (
    <TouchableOpacity style={[styles.row, indented && styles.rowIndented]} onPress={onPress}>
      <IconComponent name={iconName} size={indented ? 20 : 23} color={destructive ? theme.colors.destructive : theme.colors.textSecondary} style={styles.rowIcon} />
      <Text style={[styles.rowText, destructive && styles.rowTextDestructive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} scrollEnabled={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.sectionHeading}>Settings</Text>
        <Row icon={Feather} iconName="mail" label="Email" onPress={() => onPressNavigation('emailsettings')} indented />
        <Row icon={Feather} iconName="user" label="Profile" onPress={() => onPressNavigation('ProfileSettings')} indented />
        <Row icon={Feather} iconName="settings" label="Account" onPress={() => onPressNavigation('accounts')} indented />
        <Row icon={Feather} iconName="shield" label="MFA" onPress={() => {}} indented />

        <View style={styles.divider} />

        <Row icon={AntDesign} iconName="contacts" label="Contacts" onPress={() => onPressNavigation('ContactList')} />
        <Row icon={Feather} iconName="message-circle" label="Messages" onPress={() => onPressNavigation('Messages')} />
        <Row icon={Feather} iconName="phone" label="Call" onPress={() => onPressNavigation('Dialer')} />

        <View style={styles.divider} />

        <Row icon={AntDesign} iconName="logout" label="Logout" onPress={onPressLogout} destructive />
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{getOSVersion()}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const createStyles = theme =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    sectionHeading: {
      ...theme.typography.footnote,
      fontFamily: theme.typography.bodyMedium.fontFamily,
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    rowIndented: {
      paddingVertical: theme.spacing.lg,
      paddingLeft: theme.spacing.sm,
    },
    rowIcon: {
      width: 28,
    },
    rowText: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      marginLeft: theme.spacing.md,
    },
    rowTextDestructive: {
      color: theme.colors.destructive,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.separator,
      marginVertical: theme.spacing.md,
    },
    versionContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    versionText: {
      ...theme.typography.footnote,
      color: theme.colors.textTertiary,
    },
  });
