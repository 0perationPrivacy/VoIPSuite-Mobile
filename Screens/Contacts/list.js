import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import globalStyles from '../../style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { contactActions, messagesActions } from '../../redux/actions';
import _ from 'lodash'
import Loader from '../../components/Loader';
import { Header } from '../../components';

const ContactList = () => {
  const [__messages, setMessages] = useState([]);

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

  const getAllContacts = () => {
    dispatch(contactActions.getAllContactsAction())
  }

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const onDeleteMessage = (item) => {
    dispatch(messagesActions.deleteMessageAction(item, getMessagesByProfileId()))
  }

  const renderHeader = () => {
    return <Header headerRight={renderHeaderRight()} title={'Contacts'} />
  }

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity>
        <Feather name="plus" size={24} />
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item, index }) => {
    const { first_name, last_name, note, number } = item;

    return (
      <TouchableOpacity
        style={styles.messagesListItemWrap}
        key={`swipe-item-${index}`}>
        <View style={styles.messagesListItemDetailWrap}>
          <View>
            <Text style={styles.contactNameText}>{first_name} {last_name}</Text>
            <Text>{number}</Text>
          </View>
          <View style={styles.contactActionContainer}>
            <TouchableOpacity style={styles.contactActionItemContainer}>
              <Feather name="edit" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactActionItemContainer}>
              <Feather name="trash" size={18} />
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
      {isLoading && <Loader />}
      <View style={[globalStyles.flexOne, styles.mainContainerWrap]}>
        <FlatList
          data={__messages}
          renderItem={(params) => renderItem(params)}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyList}
        >
        </FlatList>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainerWrap: {
    paddingHorizontal: 10,
    paddingTop: Metrics.ratio(10),
    backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
  },
  messagesListItemWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ececec',
    paddingVertical: Metrics.ratio(10),
    paddingHorizontal: 5,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: getColorByTheme('#fff', '#2e2e2e')
  },
  messagesListItemDetailWrap: {
    flexDirection: 'row',
    // marginLeft: '5%',
    justifyContent: 'space-between',
    flex: 1,
  },
  contactNameText: {
    fontSize: 18
  },
  contactActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactActionItemContainer: {
    marginHorizontal : Metrics.ratio(2)
  },
  emptyMessage: {
    fontSize: 18
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ContactList;