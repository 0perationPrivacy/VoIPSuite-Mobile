import React, { } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime } from '../../helpers/utils';
import _ from 'lodash'

const MessageItem = ({ item, index, onPress = () => { } }) => {

  const { contact, message, created_at, _id } = item;

  let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : _id;

  const date = getReadableDate(created_at);
  const time = getReadableTime(created_at);

  const onPressItem = () => {
    onPress(item)
  }

  return (
    <TouchableOpacity
      style={styles.messagesListItemWrap}
      key={`swipe-item-${index}`}
      onPress={onPressItem}>
      <View style={styles.messagesListItemAvatar}>
        {/* <Text style={styles.messagesListItemAvatarText}>A</Text> */}
        <Feather name={'user'} size={18} color={getColorByTheme('#000', '#fff')} />
      </View>
      <View style={styles.messagesListItemDetailWrap}>
        <View style={styles.messagesListItemTitleWrap}>
          <Text style={styles.messagesListItemTitle}>{_contact}</Text>
          <Text style={styles.messagesListItemDate}>{date}</Text>
        </View>
        <View style={styles.messagesBottomView}>
          <Text style={styles.messagesListItemDescription}>{message && message.substring(0, 15)}.......</Text>
          <Text style={[styles.messagesListItemDate, styles.messagesListItemTime]}>{time}</Text>
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
    // borderRadius: 10,
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
    marginLeft: '5%',
    justifyContent: 'center',
    flex: 1,
  },
  messagesListItemTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.ratio(5)
  },
  messagesListItemTitle: {
    fontSize: 14,
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontRegular
  },
  messagesListItemDate: {
    fontSize: 10,
    alignSelf: 'center',
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontRegular
  },
  messagesListItemTime: {
    // marginTop : Metrics.ratio(20)
  },
  messagesBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  messagesListItemDescription: {
    fontSize: 14,
    color: getColorByTheme('#212529', '#fff'),
    fontFamily: Metrics.fontRegular
  },
});

export default MessageItem;