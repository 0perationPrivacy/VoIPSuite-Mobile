import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import globalStyles from '../../style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme, getReadableDate, getReadableTime } from '../../helpers/utils';
import HomeHeader from '../../components/HomeHeader';
import { useDispatch, useSelector } from 'react-redux'
import { messagesActions } from '../../redux/actions';
import _ from 'lodash'

// const data = Array(20)
//     .fill("")
//     .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

const Messages = () => {
    const [__messages, setMessages] = useState([]);

    let row = [];
    let prevOpenedRow;

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.messages.isLoading);
    const messages = useSelector(state => state.messages.items);

    useEffect(() => {
        getMessagesByProfileId()
    }, [])

    useEffect(() => {
        if (_.isArray(messages)) {
            setMessages(messages);
        }
    }, [messages])

    const renderHeader = () => {
        return <HomeHeader onPressProfile={getMessagesByProfileId} />
    }

    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    };

    const onDeleteMessage = () => {
        alert('deleted')
    }

    const getMessagesByProfileId = (profileId) => {
        dispatch(messagesActions.getMessagesByProfileIdAction(profileId));
    }

    const renderMessagesList = (item, index) => {
        const { contact, message, created_at } = item;
        const { first_name, last_name } = contact;

        const date = getReadableDate(created_at);
        const time = getReadableTime(created_at);

        return (
            <TouchableOpacity style={styles.messagesListItemWrap} key={index}>
                <View style={styles.messagesListItemAvatar}>
                    <Text style={styles.messagesListItemAvatarText}>A</Text>
                </View>
                <View style={styles.messagesListItemDetailWrap}>
                    <View style={styles.messagesListItemTitleWrap}>
                        <Text style={styles.messagesListItemTitle}>{first_name} {last_name}</Text>
                        <Text style={styles.messagesListItemDate}>{date}</Text>
                    </View>
                    <View style={styles.messagesBottomView}>
                        <Text style={styles.messagesListItemDescription}>{message.substring(0, 15)}.......</Text>
                        <Text style={[styles.messagesListItemDate, styles.messagesListItemTime]}>{time}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderRightActions = () => {
        return (
            <TouchableOpacity style={styles.messageListButtonWrap} onPress={onDeleteMessage}>
                <Feather name="trash" size={20} color="#fff" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }) => {
        return (
            <Swipeable
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX)}
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}>
                {renderMessagesList(item, index)}
            </Swipeable>
        );
    };

    const emptyList = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>{'Message Not Found.'}</Text>
            </View>
        );
    };

    return (
        <>
            {renderHeader()}
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
    messagesListItemAvatar: {
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: getColorByTheme('#f6f6f6', '#2e2e2e'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: getColorByTheme('#2e2e2e', '#fff'),
        // flex : 0.1
    },
    messagesListItemAvatarText: {
        fontSize: 22,
        color: getColorByTheme('#000', '#fff'),
    },
    messagesListItemDetailWrap: {
        marginLeft: '5%',
        justifyContent: 'center',
        flex: 1,
    },
    messagesListItemTitleWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    messagesListItemTitle: {
        fontSize: 20,
        color: getColorByTheme('#000', '#fff'),
    },
    messagesListItemDate: {
        fontSize: 12,
        alignSelf: 'center',
        color: getColorByTheme('#000', '#fff'),
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
        fontSize: 18
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Messages;