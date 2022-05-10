import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Feather'
import globalStyles from '../../style';
import MessageInput from '../../components/CustomInputToolbar';
import { getColorByTheme } from '../../helpers/utils';
import { Header } from '../../components';
import { useDispatch, useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather';
import _ from 'lodash'
import { messagesActions } from '../../redux/actions';
import { useRoute } from '@react-navigation/native';
import { goBack } from '../../helpers/RootNavigation';

const Home = (props) => {
	const [__messages, setMessages] = useState([]);
	const [contactInfo, setContactInfo] = useState({});

	const dispatch = useDispatch();
	const route = useRoute();

	const isLoading = useSelector(state => state.messages.isLoading);
	const messages = useSelector(state => state.messages.messages);

	useEffect(() => {
		// setMessages([
		// 	{
		// 		_id: 1,
		// 		text: 'Hello developer',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: 'React Native',
		// 			// avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// ])
		console.log(__messages, '__messages')
	}, [__messages])


	useEffect(() => {
		const { data } = route.params;
		if (data) {
			onPressMessageList(data);
			return;
		}

		goBack();
	}, [])

	const onPressMessageList = (data) => {
		dispatch(messagesActions.getMessageDetailsAction(data))
	}

	useEffect(() => {
		if (_.isArray(messages)) {
			let contact = messages[0]?.contact

			let data = [];
			messages.map((mItem) => {
				const { _id, message, created_at, contact, type } = mItem;
				const { first_name, last_name, user } = contact;
				data.push({ _id, text: message, createdAt: new Date(created_at), user: { _id: type === "send" ? 1 : user, name: `${first_name} ${last_name}` } })
			})

			// console

			setContactInfo(contact);
			setMessages(data);
		}
	}, [messages])

	const onSend = useCallback((messages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
	}, [])

	const renderComposeButton = () => {
		return (
			<TouchableOpacity style={[styles.composeButtonWrap, globalStyles.primaryBgColor]}>
				<Icon name="plus" color="#fff" size={25}></Icon>
			</TouchableOpacity>
		)
	}

	const headerBody = () => {
		return (
			<View>
				<Text style={styles.headerBodyText}>{contactInfo?.first_name} {contactInfo?.last_name}</Text>
				<Text style={styles.headerBodyTextSecondary}>{contactInfo?.number}</Text>
			</View>
		)
	}

	const headerRight = () => {
		return (
			<TouchableOpacity>
				<Feather size={22} name="trash" color="#ff5821" />
			</TouchableOpacity>
		)
	}

	return (
		<View style={globalStyles.flexOne}>
			<Header headerBody={headerBody} headerRight={headerRight} />
			<GiftedChat
				messages={__messages}
				onSend={messages => onSend(messages)}
				user={{
					_id: 1,
				}}
				renderInputToolbar={MessageInput}
				messagesContainerStyle={globalStyles.themeBg}
			/>
			{/* {renderComposeButton()} */}
		</View>
	)
}

const styles = StyleSheet.create({
	composeButtonWrap: {
		width: 50,
		height: 50,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 100,
		right: 10
	},
	headerContainer: {
	},
	headerBodyText: {
		fontSize: 18,
		textAlign: 'center'
	},
	headerBodyTextSecondary: {
		fontSize: 16,
		// color: '#ff5821',
		textAlign: 'center'
	}
});

export default Home;