import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import globalStyles from '../../style';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { contactActions } from '../../redux/actions';
import _ from 'lodash'
import Loader from '../../components/Loader';
import { Header } from '../../components';
import { navigate } from '../../helpers/RootNavigation';

const ContactList = () => {
  const [__messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  let row = [];
  let prevOpenedRow;

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.contact.isLoading);
  const messages = useSelector(state => state.contact.items);

  useEffect(() => {
    getAllContacts()
  }, [])

  useEffect(() => {
    if (_.isArray(messages)) {
      setMessages(messages);
    }
  }, [messages])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllContacts()
  }, []);

  const getAllContacts = () => {
    dispatch(contactActions.getAllContactsAction(onCompleteGetContacts))
  }

  const onCompleteGetContacts = () => {
    setRefreshing(false)
  }

  const onPressDeleteContact = (id) => {
    dispatch(contactActions.deleteContactAction({ contact_id: id }, getAllContacts))
  }

  const onPressEditContact = (item) => {
    navigate('Contact', { item })
  }

  const onPressAddContacts = () => {
    navigate('Contact')
  }

  const renderHeader = () => {
    return <Header headerRight={renderHeaderRight} title={'Contacts'} />
  }

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={onPressAddContacts}>
        <Feather style={globalStyles.defaultIconColor} name="plus" size={24} />
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item, index }) => {
    const { first_name, last_name, note, number, _id } = item;
    let isLastItem = index + 1 === __messages.length;

    return (
      <TouchableOpacity
        style={[styles.messagesListItemWrap, isLastItem && styles.itemBorderBottom]}
        key={`contact-item-${index}`}
        onPress={() => onPressEditContact(item)}
      >
        <View style={styles.messagesListItemDetailWrap}>
          <View>
            <Text style={styles.contactNameText}>{first_name} {last_name}</Text>
            <Text style={styles.contactNumberText}>{number}</Text>
          </View>
          <View style={styles.contactActionContainer}>
            <TouchableOpacity style={styles.contactActionItemContainer} onPress={() => onPressEditContact(item)}>
              <Feather style={globalStyles.defaultIconColor} name="edit" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactActionItemContainer} onPress={() => onPressDeleteContact(_id)}>
              <Feather style={globalStyles.defaultIconColor} name="trash" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  const emptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>{'No Contacts Found'}</Text>
      </View>
    );
  };

  return (
    <>
      {renderHeader()}
      {isLoading || refreshing && <Loader />}
      <View style={[globalStyles.flexOne, styles.mainContainerWrap]}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={__messages}
          renderItem={(params) => renderItem(params)}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
        </FlatList>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainerWrap: {
    paddingTop: Metrics.ratio(10),
    backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
  },
  messagesListItemWrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ececec',
    paddingVertical: Metrics.ratio(10),
    paddingHorizontal: Metrics.ratio(10),
    backgroundColor: getColorByTheme('#fff', '#2e2e2e')
  },
  messagesListItemDetailWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  contactNameText: {
    fontSize: 18,
    color: getColorByTheme('#000', '#fff')
  },
  contactNumberText: {
    fontSize: 16,
    color: getColorByTheme('#000', '#fff')
  },
  contactActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactActionItemContainer: {
    marginHorizontal: Metrics.ratio(2)
  },
  emptyMessage: {
    fontSize: 18,
    fontFamily: Metrics.fontMedium
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
  }
});

export default ContactList;