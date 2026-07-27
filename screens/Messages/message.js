import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import HomeHeader from '../../components/HomeHeader';
import {useTheme} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {messagesActions, settingsActions} from '../../redux/actions';
import _ from 'lodash';
import Loader from '../../components/Loader';
import {navigate} from '../../helpers/RootNavigation';
import HomeFloating from '../../components/HomeFloating';
import {getUserId} from '../../helpers/auth-header';
import socketClient from '../../helpers/socket';
import EmptyList from '../../components/EmptyList';
import MessageItem from './item';

let __activeProfile;
const Messages = ({navigation}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [__messages, setMessages] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isInit, setInit] = useState(false);

  let row = [];
  let prevOpenedRow;

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.messages.isLoading);
  const messages = useSelector(state => state.messages.items);
  const user = useSelector(state => state.authentication.user);
  const profile = useSelector(state => state.profile);

  __activeProfile = activeProfile;

  // useEffect(() => {
  //   new NotificationService(data => {
  //     console.log('let see! ====>', data);
  //   });
  // }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      if (__activeProfile) {
        getMessagesByProfileId(__activeProfile);
      }
    });
  }, []);

  useEffect(() => {
    const {profileName = null} = profile;
    if (profileName) {
      setActiveProfile(profileName?.id);
      setInit(true);
    }
  }, [profile]);

  useEffect(() => {
    if (activeProfile) {
      getMessagesByProfileId(activeProfile);
    }
  }, [activeProfile]);

  useEffect(() => {
    (async () => {
      if (activeProfile) {
        await initSocket();
      }
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [activeProfile]);

  useEffect(() => {
    if (_.isArray(messages)) {
      setMessages(messages);
    }
  }, [messages]);

  const initSocket = async () => {
    let isConnected = socketClient.isConnected();

    if (!isConnected) {
      await socketClient.init();
    }

    const userId = getUserId();
    socketClient.joinRoomByUserId(userId);
    socketClient.listenEventForMessage(function (data) {
      // getMessagesByProfileId(activeProfile)
    });
  };

  const renderHeader = () => {
    return <HomeHeader />;
  };

  const closeRow = index => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const onDeleteMessage = item => {
    dispatch(
      messagesActions.deleteMessageAction(
        item,
        getMessagesByProfileId(activeProfile),
      ),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getMessagesByProfileId(activeProfile);
  };

  const getMessagesByProfileId = profileId => {
    if (!profileId) return;

    dispatch(messagesActions.getMessagesByProfileIdAction(profileId));

    if (user && user?.token) {
      const {_id} = user.data;
      let data = {user: _id, setting: profileId};
      dispatch(settingsActions.getProfileSettings(data, onGetMessageEnd));
    }
  };

  const onGetMessageEnd = () => {
    setRefreshing(false);
  };

  const onPressMessageList = contact => {
    let data = {number: contact, profile: activeProfile};
    navigate('Home', {data});
  };

  const onPressCompose = async () => {
    // const {Heartbeat} = NativeModules;

    // Heartbeat.createNotificationChannel(
    //   MESSAGE_CHANNEL_ID,
    //   MESSAGE_CHANNEL_NAME,
    // );

    // Heartbeat.displayNotification({
    //   channelId: MESSAGE_CHANNEL_ID,
    //   notificationId: 'dddd',
    // });

    navigate('Compose');
  };

  const renderMessagesList = (item, index) => {
    return (
      <MessageItem item={item} index={index} onPress={onPressMessageList} />
    );
  };

  const renderRightActions = item => {
    return (
      <TouchableOpacity
        style={styles.messageListButtonWrap}
        onPress={() => onDeleteMessage(item)}>
        <Feather name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Swipeable
        key={`swipe-${index}`}
        renderRightActions={(progress, dragX) => renderRightActions(item)}
        onSwipeableOpen={() => closeRow(index)}
        ref={ref => (row[index] = ref)}>
        {renderMessagesList(item, index)}
      </Swipeable>
    );
  };

  const emptyList = () => {
    return <EmptyList />;
  };

  return (
    <>
      {renderHeader()}
      {isLoading && <Loader />}
      <View style={styles.mainContainerWrap}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={__messages}
          renderItem={params => renderItem(params)}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} colors={[theme.colors.accent]} />
          }></FlatList>
      </View>
      <HomeFloating onPressCompose={onPressCompose} />
    </>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainContainerWrap: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    messageListButtonWrap: {
      justifyContent: 'center',
      marginHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.destructive,
      borderRadius: 40,
      width: 40,
      height: 40,
      paddingHorizontal: theme.spacing.sm,
      alignSelf: 'center',
    },
  });

export default Messages;
