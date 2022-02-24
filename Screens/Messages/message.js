import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import globalStyles from '../../style';
import Wrapper from '../../components/Wrapper';
import { Header, } from '../../components';
const windowWidth = Dimensions.get('window').width;
import { SwipeListView } from 'react-native-swipe-list-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = Array(20)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

const Messages = () => {
    const fileOptions = {};

    useEffect(() => { }, [])

    const renderHeader = () => {
        return <Header />
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

    return (
        <Wrapper header={renderHeader()}>
            <View style={[globalStyles.flexOne, styles.mainContainerWrap]}>
                <SafeAreaView>
                    <SwipeListView
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={(data, rowMap) => renderMessagesList()}
                        // renderHiddenItem={(data, rowMap) => (
                        //     <View style={styles.rowBack}>
                        //         <Text>Left</Text>
                        //         <Text>Right</Text>
                        //     </View>
                        // )}
                        onRowOpen={() => alert('open')}
                        // onResponderRelease={() => alert('close')}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />
                </SafeAreaView>
            </View>
        </Wrapper>
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
        marginBottom: 10
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
    }
});

export default Messages;