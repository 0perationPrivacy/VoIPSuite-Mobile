import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import globalStyles from '../../style';
import Wrapper from '../../components/Wrapper';
import { Header, } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Feather from 'react-native-vector-icons/Feather';

const data = Array(20)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

const Messages = () => {
    const [__messages, setMessageData] = useState(data);
    let row = [];
    let prevOpenedRow;

    const fileOptions = {};

    useEffect(() => { }, [])

    const renderHeader = () => {
        return <Header />
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
        <View style={globalStyles.container} >
            {renderHeader()}
            <View style={[globalStyles.flexOne, styles.mainContainerWrap]}>
                <FlatList
                    data={__messages}
                    renderItem={(params) => renderItem(params)}
                    keyExtractor={(item) => item.key}
                    showsVerticalScrollIndicator={false}>
                </FlatList>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainerWrap: {
        paddingHorizontal: 10
    },
    messagesListItemWrap: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ececec',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    messagesListItemAvatar: {
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: '#f6f6f6',
        alignItems: 'center',
        justifyContent: 'center',
        // flex : 0.1
    },
    messagesListItemAvatarText: {
        fontSize: 22
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
        fontSize: 20
    },
    messagesListItemTime: {
        fontSize: 12,
        alignSelf: 'center'
    },
    messagesListItemDescription: {
        fontSize: 12,
        color: '#212529'
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