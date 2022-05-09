import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import globalStyles from '../../style';
import Wrapper from '../../components/Wrapper';
import { Header, } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme } from '../../helpers/utils';
import HomeHeader from '../../components/HomeHeader';

const data = Array(20)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

const Messages = () => {
    const [__messages, setMessageData] = useState(data);
    let row = [];
    let prevOpenedRow;

    useEffect(() => { }, [])

    const renderHeader = () => {
        return <HomeHeader />
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

    const renderMessagesList = () => {
        return (
            <TouchableOpacity style={styles.messagesListItemWrap}>
                <View style={styles.messagesListItemAvatar}>
                    <Text style={styles.messagesListItemAvatarText}>A</Text>
                </View>
                <View style={styles.messagesListItemDetailWrap}>
                    <View style={styles.messagesListItemTitleWrap}>
                        <Text style={styles.messagesListItemTitle}>Papa</Text>
                        <Text style={styles.messagesListItemTime}>12:30 am</Text>
                    </View>
                    <Text style={styles.messagesListItemDescription}>Call Me</Text>
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
                {renderMessagesList()}
            </Swipeable>
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
                    showsVerticalScrollIndicator={false}>
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
    messagesListItemTime: {
        fontSize: 12,
        alignSelf: 'center',
        color: getColorByTheme('#000', '#fff'),
    },
    messagesListItemDescription: {
        fontSize: 12,
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
    }
});

export default Messages;