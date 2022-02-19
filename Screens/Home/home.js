import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Feather'
import globalStyles from '../../style';

const Home = (props) => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		setMessages([
			{
				_id: 1,
				text: 'Hello developer',
				createdAt: new Date(),
				user: {
					_id: 2,
					name: 'React Native',
					// avatar: 'https://placeimg.com/140/140/any',
				},
			},
		])
	}, [])

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

	return (
		<View style={globalStyles.flexOne}>
			<GiftedChat
				messages={messages}
				onSend={messages => onSend(messages)}
				user={{
					_id: 1,
				}}
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
		bottom : 100,
		right : 10
	}
});

export default Home;