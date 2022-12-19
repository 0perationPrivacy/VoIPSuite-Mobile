import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList, RefreshControl, NativeModules } from 'react-native';
import globalStyles from '../../style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime, getSocketInstance } from '../../helpers/utils';
import HomeHeader from '../../components/HomeHeader';
import { useDispatch, useSelector } from 'react-redux'
import { messagesActions, settingsActions } from '../../redux/actions';
import _ from 'lodash'
import Loader from '../../components/Loader';
import { navigate } from '../../helpers/RootNavigation';
import HomeFloating from '../../components/HomeFloating';
import { getUserId } from '../../helpers/auth-header';
import notifee from '@notifee/react-native';
import socketClient from '../../helpers/socket';

const Messages = ({ navigation }) => {

    // const { NotificationModule } = NativeModules;

    const [__messages, setMessages] = useState([
        // {
        //     _id: 1,
        //     contact: {
        //         first_name: 'Muhammahd',
        //         last_name: 'Huzaifa'
        //     },
        //     created_at: new Date(),
        //     message: 'hola'
        // },
        // {
        //     _id: 2,
        //     contact: {
        //         first_name: 'Muhammahd',
        //         last_name: 'Huzaifa'
        //     },
        //     created_at: new Date(),
        //     message: 'hola'
        // },
        // {
        //     _id: 3,
        //     contact: {
        //         first_name: 'Muhammahd',
        //         last_name: 'Huzaifa'
        //     },
        //     created_at: new Date(),
        //     message: 'hola'
        // }
    ]);

    const [activeProfile, setActiveProfile] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    let row = [];
    let prevOpenedRow;

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.messages.isLoading);
    const messages = useSelector(state => state.messages.items);
    const user = useSelector(state => state.authentication.user);

    const initNotifee = useCallback(async () => {
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: 'Welcome to VoIP Suite',
            body: 'Main body content of the notification',
            android: {
                channelId,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }, [])

    useEffect(() => {
        getMessagesByProfileId()
        navigation.addListener('focus', () => {
            getMessagesByProfileId();
        });
        // console.log('NotificationModule ===>', NotificationModule);
        // setNotification();
    }, [])

    useEffect(() => {
        // setTimeout(() => {
        //     initNotifee();
        // }, 2000);
    }, [initNotifee])

    useEffect(() => {
        if (activeProfile) {
            initSocket()
        }
    }, [activeProfile])

    const setNotification = () => {
        NotificationModule.createNotificationChannel();
        NotificationModule.displayNotification();
    };

    useEffect(() => {
        if (_.isArray(messages)) {
            setMessages(messages);
        }
    }, [messages]);

    const initSocket = async () => {
        const io = socketClient.socket;
        let userId = getUserId();

        io.emit("join_profile_channel", userId);

        io.on("user_message", function (data) {
            console.log('datdadadadadadada ===>', data);
            // console.log(activeProfile);
            getMessagesByProfileId(activeProfile)
        });
    }

    const renderHeader = () => {
        return <HomeHeader onPressProfile={getMessagesByProfileId} />
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

    const onRefresh = () => {
        setRefreshing(true);
        getMessagesByProfileId(activeProfile)
    };

    const getMessagesByProfileId = (profileId) => {
        console.log(profileId);
        if (profileId === undefined) return;

        setActiveProfile(profileId);
        dispatch(messagesActions.getMessagesByProfileIdAction(profileId));

        if (user && user?.token) {
            const { _id } = user.data
            let data = { user: _id, setting: profileId }
            dispatch(settingsActions.getProfileSettings(data, onGetMessageEnd));
        }
    }

    const onGetMessageEnd = () => {
        setRefreshing(false);
    }

    const onPressMessageList = (contact) => {
        let data = { number: contact, profile: { id: activeProfile } }
        navigate('Home', { data })
    }

    const onPressCompose = () => {
        navigate('Compose')
    }

    const renderMessagesList = (item, index) => {
        const { contact, message, created_at, _id } = item;

        let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : _id;

        const date = getReadableDate(created_at);
        const time = getReadableTime(created_at);

        return (
            <TouchableOpacity
                style={styles.messagesListItemWrap}
                key={`swipe-item-${index}`}
                onPress={() => onPressMessageList(item)}>
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

    const renderRightActions = (item) => {
        return (
            <TouchableOpacity style={styles.messageListButtonWrap} onPress={() => onDeleteMessage(item)}>
                <Feather name="trash" size={20} color="#fff" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }) => {
        return (
            <Swipeable
                key={`swipe-${index}`}
                renderRightActions={(progress, dragX) => renderRightActions(item)}
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
            >
                {renderMessagesList(item, index)}
            </Swipeable>
        );
    };

    const emptyList = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>{'No messages found.'}</Text>
            </View>
        );
    };

    return (
        <>
            {renderHeader()}
            {isLoading && <Loader />}
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
            <HomeFloating onPressCompose={onPressCompose} />
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
    messageListButtonWrap: {
        justifyContent: 'center',
        marginHorizontal: 15,
        backgroundColor: 'red',
        borderRadius: 40,
        width: 40,
        height: 40,
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    emptyMessage: {
        fontSize: 18,
        color: getColorByTheme('#000', '#fff'),
        fontFamily: Metrics.fontMedium
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Messages;