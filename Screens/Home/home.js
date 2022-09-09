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
import { goBack, navigate, navigateAndReset } from '../../helpers/RootNavigation';
import Metrics from '../../helpers/Metrics';

const Home = (props) => {
	const [__messages, setMessages] = useState([]);
	const [contactInfo, setContactInfo] = useState(null);
	const [contactNumber, setContactNumber] = useState(null);
	const [profileID, setProfileId] = useState(null);

	const dispatch = useDispatch();
	const route = useRoute();

	const isLoading = useSelector(state => state.messages.isLoading);
	const messages = useSelector(state => state.messages.messages);
	const profileSettings = useSelector(state => state.settings.profileSettings);
	const user = useSelector(state => state.authentication.user);

	useEffect(() => {
		init();
	}, [])

	const init = () => {
		const { data } = route.params;
		const { number } = data;
		const { contact, _id } = number

		if (contact) {
			setContactInfo(contact)
		}

		console.log(contact)
		setContactNumber(_id)

		if (data) {
			onPressMessageList(data);
			return;
		}

		goBack();
	}

	useEffect(() => {
		if (profileSettings && !_.isEmpty(profileSettings)) {
			setProfileId(profileSettings);
		}
	}, [profileSettings])

	const onPressMessageList = (data) => {
		dispatch(messagesActions.getMessageDetailsAction(data))
	}

	useEffect(() => {
		if (_.isArray(messages)) {

			let data = [];
			messages.map((mItem) => {
				const { _id, message, created_at, contact, type, number, user, media } = mItem;
				let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : number;
				let _contactUser = contact ? user : _id;

				// console.log(_contact, _contactUser)

				let images = media ? JSON.parse(media) : [];

				data.unshift({ _id, text: message, createdAt: new Date(created_at), user: { _id: type === "send" ? 1 : _contactUser, name: _contact }, image: images && images.length > 0 ? images[0] : null })
			})

			console.log(data, 'hola', 'contact');

			setMessages(data);
		}
	}, [messages])

	const onSend = (messages = []) => {
		onSendMessage(messages)
	}

	const onSendMessage = (messages = []) => {
		// console.log('contactInfo data ===>', contactInfo)
		const { _id } = user.data
		const { number } = contactInfo
		const { text } = messages[0]

		let data = { media: [], message: text, numbers: [number], profile: profileID, user: _id }
		dispatch(messagesActions.sendMessageDetailsAction(data, () => onSuccessSendMessage(messages), false))
	}

	const onSuccessSendMessage = (messages = []) => {
		// init();
		setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
	}

	const onPressAddContact = (number) => {
		navigate('Contact', { number })
	}

	const onPressDeleteIcon = () => {
		dispatch(messagesActions.deleteMessageAction(contactNumber, function () {
			navigateAndReset('Messages')
		}))
	}

	const headerBody = () => {
		if (contactInfo && _.isObject(contactInfo)) {
			return (
				<View>
					<Text style={styles.headerBodyText}>{contactInfo?.first_name} {contactInfo?.last_name}</Text>
					<Text style={styles.headerBodyTextSecondary}>{contactInfo?.number}</Text>
				</View>
			)
		}
		return (
			<View style={styles.headerContactNumberContainer}>
				<Text style={styles.headerBodyText}>{contactNumber}</Text>
				<TouchableOpacity style={[styles.composeButtonWrap, globalStyles.primaryBgColor]} onPress={() => onPressAddContact(contactNumber)}>
					<Icon name="plus" color="#fff" size={25}></Icon>
				</TouchableOpacity>
			</View>
		)
	}

	const headerRight = () => {
		return (
			<TouchableOpacity onPress={onPressDeleteIcon}>
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
				isAnimated
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	composeButtonWrap: {
		width: 30,
		height: 30,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		// position: 'absolute',
		// bottom: 100,
		left: 10
	},
	headerContainer: {
	},
	headerBodyText: {
		fontSize: 18,
		textAlign: 'center',
		color: getColorByTheme('#000', '#fff'),
	},
	headerBodyTextSecondary: {
		fontSize: 16,
		// color: '#ff5821',
		textAlign: 'center',
		color: getColorByTheme('#000', '#fff'),
	},
	headerContactNumberContainer: {
		flexDirection: 'row'
	},
	headerContactNumberAddBtn: {
		marginLeft: Metrics.ratio(5),
	}
});

export default Home;