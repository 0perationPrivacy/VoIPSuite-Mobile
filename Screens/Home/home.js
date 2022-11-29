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

		console.log('number ====>', number);
		console.log('data ====>', data);

		if (contact) {
			setContactInfo(contact)
		}

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
			messages.forEach((mItem) => {
				const { _id, message, created_at, contact, type, number, user, media } = mItem;
				let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : number;
				let _contactUser = contact ? user : _id;

				let images = media ? JSON.parse(media) : [];

				data.unshift({ _id, text: message, createdAt: new Date(created_at), user: { _id: type === "send" ? 1 : _contactUser}, image: images && images.length > 0 ? images[0] : null })
			})

			setMessages(data);
		}
	}, [messages])

	const onSend = (messages = []) => {
		onSendMessage(messages)
	}

	const onSendMessage = (messages = []) => {
		const { _id } = user.data
		const { text } = messages[0]
		const number = contactNumber

		let data = { media: [], message: text, numbers: [number], profile: profileID, user: _id }
		dispatch(messagesActions.sendMessageDetailsAction(data, () => onSuccessSendMessage(messages), false))

	}

	const onSuccessSendMessage = (messages = []) => {
		init();
		// setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
	}

	const onPressAddContact = (number) => {
		navigate('Contact', { number })
	}

	const onPressDeleteIcon = () => {
		dispatch(messagesActions.deleteMessageAction(contactNumber, function () {
			navigateAndReset('Messages')
		}))
	}

	const onPressCall = () => {
		// dispatch(messagesActions.deleteMessageAction(contactNumber, function () {
		// 	navigateAndReset('Messages')
		// }))
	}


	const headerBody = () => {
		if (contactInfo && _.isObject(contactInfo)) {
			return (
				<View style={styles.headerBodyTextContainer}>
					<Feather name={'user'} size={24} color={getColorByTheme('#000', '#fff')} />
					<Text style={styles.headerBodyText}>{contactInfo?.first_name} {contactInfo?.last_name}</Text>
					{/* <Text style={styles.headerBodyTextSecondary}>{contactInfo?.number}</Text> */}
				</View>
			)
		}

		return (
			<View style={styles.headerContactNumberContainer}>
				<Text style={styles.headerBodyText}>{contactNumber}</Text>
				<TouchableOpacity style={[styles.composeButtonWrap, globalStyles.primaryBgColor]} onPress={() => onPressAddContact(contactNumber)}>
					<Icon name="plus" color="#fff" size={20}></Icon>
				</TouchableOpacity>
			</View>
		)
	}

	const headerLeft = () => {
		return (
			<TouchableOpacity onPress={() => goBack()}>
				<Feather name={'arrow-left'} size={25} style={globalStyles.defaultIconColor} />
			</TouchableOpacity>
		)
	}

	const headerRight = () => {
		return (
			<View style={styles.headerRightContainer}>
				<TouchableOpacity onPress={onPressCall}>
					<Feather size={22} name="phone" style={globalStyles.defaultIconColor} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerDeleteIcon} onPress={onPressDeleteIcon}>
					<Feather size={22} name="trash" color={getColorByTheme('#2e2e2e', '#fff')} />
				</TouchableOpacity>
			</View>
		)
	}


	const customHeader = () => {
		return (
			<View style={styles.customHeaderContainer}>
				<View style={styles.customHeaderLeftContainer}>
					{headerLeft()}
					{headerBody()}
				</View>
				{headerRight()}
			</View>
		)
	}

	return (
		<View style={globalStyles.flexOne}>
			{/* <Header headerBody={headerBody} headerRight={headerRight} /> */}
			{customHeader()}
			<GiftedChat
				messages={__messages}
				onSend={messages => onSend(messages)}
				user={{
					_id: 1,
				}}
				renderInputToolbar={MessageInput}
				messagesContainerStyle={globalStyles.themeBg}
				// renderSend={customSystemMessage}
				isAnimated
				renderAvatar={() => null}
			/>
		</View>
	)
}

const customSystemMessage = props => {
	return (
		<View style={styles.ChatMessageSytemMessageContainer}>
			<Icon name="lock" color="#9d9d9d" size={16} />

		</View>
	);
};

const styles = StyleSheet.create({
	composeButtonWrap: {
		width: 20,
		height: 20,
		borderRadius: 20,
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
		fontFamily: Metrics.fontMedium,
		marginLeft: Metrics.ratio(3),
		// borderWidth : 1
	},
	headerBodyTextSecondary: {
		fontSize: 14,
		textAlign: 'justify',
		color: getColorByTheme('#000', '#fff'),
		fontFamily: Metrics.fontRegular
	},
	headerContactNumberContainer: {
		flexDirection: 'row',
		marginLeft: Metrics.smallMargin,

	},
	headerContactNumberAddBtn: {
		marginLeft: Metrics.ratio(5),
	},
	customHeaderContainer: {
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: Metrics.smallMargin,
		paddingVertical: Metrics.baseMargin,
		borderBottomWidth : 1,
		borderBottomColor : '#ececec',
	},
	customHeaderLeftContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerBodyTextContainer: {
		marginLeft: Metrics.smallMargin,
		flexDirection: 'row'
	},
	headerRightContainer: {
		flexDirection: 'row',
	},
	headerDeleteIcon: {
		marginLeft: Metrics.smallMargin
	}
});

export default Home;