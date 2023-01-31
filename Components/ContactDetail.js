import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../helpers/Metrics';
import { navigate } from '../helpers/RootNavigation';
import { getColorByTheme } from '../helpers/utils';
import styles from '../style';

const ContactDetail = ({
  onPressBack = () => { },
  contact = {},
  onPressMessage = () => { }
}) => {

  const onPressEditContact = () => {
    navigate('Contact', { item: contact })
  }

  const renderHeader = () => {
    return (
      <View style={[innerStyle.contentSpacing, innerStyle.headerContainer]}>
        <TouchableOpacity onPress={onPressBack}>
          <Feather name={'arrow-left'} size={24} style={styles.defaultIconColor} />
        </TouchableOpacity>
        <View style={[innerStyle.contentSpacing, innerStyle.headerRightContainer]}>
          <TouchableOpacity onPress={onPressEditContact}>
            <Feather name={'edit'} size={24} style={[styles.defaultIconColor, innerStyle.headerRightIcons]} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={onPressBack}>
            <Feather name={'trash'} size={24} style={[styles.defaultIconColor, innerStyle.headerRightIcons]} />
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }

  const renderAvatar = () => {
    return (
      <View style={innerStyle.avatarContainer}>
        <Feather size={50} name={'user'} style={[innerStyle.headerRightIcons, styles.defaultIconColor]} />
      </View>
    )
  }

  const renderContactName = () => {
    const { first_name, last_name } = contact;
    return (
      <Text style={[innerStyle.contactNameText, styles.defaultTextColor]}>{`${first_name} ${last_name}`}</Text>
    )
  }

  const renderMainContent = () => {
    return (
      <View style={innerStyle.mainContentContainer}>
        {renderAvatar()}
        {renderContactName()}
      </View>
    )
  }

  const renderDivider = () => {
    return (
      <Divider style={innerStyle.dividerContainer} />
    )
  }

  const renderContactDetail = () => {
    const { number } = contact;
    return (
      <View style={innerStyle.contentSpacing}>
        <TouchableOpacity style={innerStyle.contentSpacing}>
          <Feather size={18} name={'phone'} style={[innerStyle.headerRightIcons, styles.defaultIconColor]} />
          <Text style={[innerStyle.contactNameText, styles.defaultTextColor]}>{number}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMessage}>
          <Feather name={'message-circle'} size={24} style={styles.defaultIconColor} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={innerStyle.container}>
      {renderHeader()}
      {renderMainContent()}
      {renderDivider()}
      {renderContactDetail()}
      {renderDivider()}
    </View>
  )
};

const innerStyle = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.smallMargin,
  },
  contentSpacing: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  headerContainer: {

  },
  headerRightContainer: {

  },
  headerRightIcons: {
    marginHorizontal: Metrics.ratio(5),
  },
  mainContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.baseMargin
  },
  avatarContainer: {
    borderRadius: Metrics.ratio(100),
    width: Metrics.ratio(100),
    height: Metrics.ratio(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getColorByTheme('#f6f6f6', '#2e2e2e'),
    marginBottom: Metrics.smallMargin,
    borderColor: getColorByTheme('#2e2e2e', '#fff'),
    borderWidth: 1
  },
  contactNameContainer: {

  },
  contactNameText: {
    fontFamily: Metrics.fontMedium
  },
  dividerContainer: {
    marginVertical: Metrics.baseMargin
  }
});

export default ContactDetail;
