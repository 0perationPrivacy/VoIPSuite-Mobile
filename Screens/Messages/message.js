import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import globalStyles from '../../style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime } from '../../helpers/utils';
import HomeHeader from '../../components/HomeHeader';
import { useDispatch, useSelector } from 'react-redux'
import { messagesActions, settingsActions } from '../../redux/actions';
import _ from 'lodash'
import Loader from '../../components/Loader';
import { navigate } from '../../helpers/RootNavigation';
import HomeFloating from '../../components/HomeFloating';
import { getUserId } from '../../helpers/auth-header';
import socketClient from '../../helpers/socket';
import EmptyList from '../../components/EmptyList';
import MessageItem from './item';

const Messages = ({ navigation }) => {
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

    useEffect(() => {
        getMessagesByProfileId()
        navigation.addListener('focus', () => {
            // getMessagesByProfileId();
        });
    }, [])

    useEffect(() => {
        if (activeProfile) {
            // initSocket()
        }
    }, [activeProfile])

    useEffect(() => {
        if (_.isArray(messages)) {
            setMessages(messages);
        }
    }, [messages]);

    const initSocket = async () => {
        const io = socketClient.socket;
        let userId = getUserId();

        io.emit("join_profile_channel", '621e9f2685a90200160c3160');

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
        return (
            <MessageItem
                item={item}
                index={index}
                onPress={onPressMessageList}
            />
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
            <EmptyList />
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