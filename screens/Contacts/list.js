import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList, RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {contactActions} from '../../redux/actions';
import _ from 'lodash';
import Loader from '../../components/Loader';
import EmptyList from '../../components/EmptyList';
import {Header} from '../../components';
import {navigate} from '../../helpers/RootNavigation';
import {useTheme} from '../../theme';

const getInitials = (first = '', last = '', number = '') => {
  const initials = `${first?.trim()?.[0] ?? ''}${last?.trim()?.[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return number?.replace(/\D/g, '')?.slice(-2) || '#';
};

const ContactList = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [__contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.contact.isLoading);
  const contacts = useSelector(state => state.contact.items);

  // Refetch whenever the screen regains focus, not just on first mount —
  // otherwise coming back from the add/edit form shows stale data.
  useFocusEffect(
    useCallback(() => {
      getAllContacts();
    }, []),
  );

  useEffect(() => {
    if (_.isArray(contacts)) {
      setContacts(contacts);
    }
  }, [contacts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllContacts();
  }, []);

  const getAllContacts = () => {
    dispatch(contactActions.getAllContactsAction(onCompleteGetContacts));
  };

  const onCompleteGetContacts = () => {
    setRefreshing(false);
  };

  const onPressDeleteContact = id => {
    dispatch(contactActions.deleteContactAction({contact_id: id}, getAllContacts));
  };

  const onPressEditContact = item => {
    navigate('Contact', {item});
  };

  const onPressAddContacts = () => {
    navigate('Contact');
  };

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={onPressAddContacts} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.addButton}>
        <Feather name="plus" size={20} color={theme.colors.textOnAccent} />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    const {first_name, last_name, number, _id} = item;
    const name = `${first_name ?? ''} ${last_name ?? ''}`.trim();

    return (
      <TouchableOpacity style={styles.row} key={`contact-item-${index}`} onPress={() => onPressEditContact(item)} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(first_name, last_name, number)}</Text>
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.name} numberOfLines={1}>
            {name || number}
          </Text>
          {!!name && (
            <Text style={styles.number} numberOfLines={1}>
              {number}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onPressDeleteContact(_id)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="trash-2" size={18} color={theme.colors.destructive} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header headerRight={renderHeaderRight} title={'Contacts'} />
      {isLoading && !refreshing && <Loader />}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={__contacts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyList message={'No contacts yet'} icon={'user-plus'} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} colors={[theme.colors.accent]} />}
      />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      flexGrow: 1,
      paddingVertical: theme.spacing.sm,
    },
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
    },
    rowBody: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    name: {
      ...theme.typography.headline,
      color: theme.colors.textPrimary,
    },
    number: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    deleteButton: {
      padding: theme.spacing.xs,
    },
  });

export default ContactList;
