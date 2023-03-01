import React, { memo } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime } from '../../helpers/utils';
import _ from 'lodash'

const MessageItem = ({ item, index, onPress = () => { } }) => {

  const { contact, message, created_at, _id, isview } = item;

  const isNewMessage = isview > 0;

  let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : _id;

  const date = getReadableDate(created_at);
  const time = getReadableTime(created_at);

  const onPressItem = () => {
    onPress(item)
  }

  return (
    <TouchableOpacity
      style={styles.messagesListItemWrap}
      key={`swipe-item-${_id}`}
      onPress={onPressItem}>
      <View style={styles.messagesListItemAvatar}>
        <Feather name={'user'} size={18} color={getColorByTheme('#000', '#fff')} />
      </View>
      <View style={styles.messagesListItemDetailWrap}>
        <View style={styles.messagesListItemTitleWrap}>
          <Text style={styles.messagesListItemTitle}>{_contact}</Text>
          <Text style={styles.messagesListItemDescription}>{message && message.substring(0, 15)}.......</Text>
        </View>
        <View style={styles.messagesBottomView}>
          <Text style={styles.messagesListItemDate}>{date}</Text>
          <View style={styles.messageTimeContainer}>
            <Text style={styles.messagesListItemDate}>{time}</Text>
            {
              isNewMessage && <Text style={styles.messageCountBadge}>{isview}</Text>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  messagesListItemWrap: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#545458', //message divider
    paddingVertical: Metrics.ratio(10),
    paddingHorizontal: 5,
    marginBottom: 5,
    backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
    alignItems: 'center'
  },
  messagesListItemAvatar: {
    borderRadius: 40,
    width: 40,
    height: 40,
    backgroundColor: getColorByTheme('#f6f6f6', '#2e2e2e'),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: getColorByTheme('#2e2e2e', '#fff'),
    borderWidth: 1
  },
  messagesListItemAvatarText: {
    fontSize: 14,
    color: getColorByTheme('#000', '#fff'),
  },
  messagesListItemDetailWrap: {
    flexDirection: 'row',
    marginLeft: Metrics.baseMargin,
    marginBottom: Metrics.ratio(5),
    flex: 1,
  },
  messagesListItemTitleWrap: {
    justifyContent: 'space-between',
    flex: 1,
  },
  messagesListItemTitle: {
    fontSize: 14,
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontRegular,
  },
  messagesListItemDate: {
    fontSize: 10,
    alignSelf: 'center',
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontRegular,
    textAlign: 'left'
  },
  messagesBottomView: {
    justifyContent: 'space-between'
  },
  messagesListItemDescription: {
    fontSize: 14,
    color: getColorByTheme('#212529', '#fff'),
    fontFamily: Metrics.fontRegular,
  },
  messageTimeContainer: {
    flexDirection: 'row',
    alignSelf:'flex-end'
  },
  messageCountBadge: {
    borderRadius: 5,
    width: 20,
    height: 20,
    backgroundColor: '#198754',
    color: '#fff',
    marginLeft: Metrics.smallMargin,
    textAlign: 'center'
  }
});

export default memo(MessageItem);