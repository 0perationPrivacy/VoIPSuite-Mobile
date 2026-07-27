import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {getReadableDate, getReadableTime} from '../../helpers/utils';
import {useTheme} from '../../theme';

const MessageItem = ({item, index, onPress = () => {}}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {contact, message, created_at, _id, isview} = item;

  const isNewMessage = isview > 0;

  let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : _id;

  const date = getReadableDate(created_at);
  const time = getReadableTime(created_at);

  const onPressItem = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity style={styles.row} key={`swipe-item-${_id}`} onPress={onPressItem} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Feather name={'user'} size={20} color={theme.colors.textSecondary} />
      </View>
      <View style={styles.detail}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {_contact}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.preview} numberOfLines={1} ellipsizeMode="tail">
            {message}
          </Text>
          {isNewMessage ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{isview}</Text>
            </View>
          ) : (
            <Text style={styles.date}>{date}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detail: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs / 2,
    },
    name: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textPrimary,
      flexShrink: 1,
    },
    preview: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    date: {
      ...theme.typography.footnote,
      color: theme.colors.textTertiary,
    },
    time: {
      ...theme.typography.footnote,
      color: theme.colors.textTertiary,
    },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      ...theme.typography.caption,
      fontFamily: theme.typography.bodyMedium.fontFamily,
      color: theme.colors.textOnAccent,
    },
  });

export default memo(MessageItem);
