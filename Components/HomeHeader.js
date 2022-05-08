import Icon from 'react-native-vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { useNavigation } from '@react-navigation/native'
import styles from '../style'
import { navigate, openDrawer } from '../helpers/RootNavigation'
import Metrics from '../helpers/Metrics'
import { CustomModal } from '.'
import { useDispatch, useSelector } from 'react-redux'
import { profileActions } from '../redux/actions/profile'

const HomeHeader = () => {
	const [profileDropDown, setProfileDropDown] = useState(null);
	const [isProfileModalVisible, setProfileModalVisibility] = useState(true);
	const [profiles, setPofiles] = useState(
		[
			{ 'name': 'profile 1' },
			{ 'name': 'profile 1' },
			{ 'name': 'profile 1' }
		]
	);

	const navigation = useNavigation();
	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.authentication.isLoading);

	useEffect(() => {
		console.log(isProfileModalVisible)
	}, [isProfileModalVisible])

	const showProfileDropDown = () => {
		profileDropDown && profileDropDown.show();
	}

	const onSelectProfile = (i, v) => {
		console.log(i, v)
	}

	const onPressSideMenu = () => {
		openDrawer()
	}

	const onPressCompose = (param) => {
		navigate(param)
	}

	const onModalClose = () => {
		setProfileModalVisibility(false)
	}

	const onModalOpen = () => {
		setProfileModalVisibility(true)
	}

	const onPressSaveProfileName = (data) => {
		console.log('agya')
		dispatch(profileActions.createProfileAction(data))
	}

	const renderProfileItem = ({ name }, index) => {
		if (profiles.length === index + 1) {
			return (
				<TouchableOpacity style={styles.profileDropDownItemContainer} onPress={onModalOpen}>
					<Text style={styles.textItem}>{'Add New Profile'}</Text>
				</TouchableOpacity>
			)
		}

		return (
			<View style={styles.profileDropDownItemContainer}>
				<Text style={styles.textItem}>{name}</Text>
			</View>
		)
	}

	return (
		<View style={[styles.fullFlex, styles.homeHeaderWrapper]}>
			<TouchableOpacity onPress={onPressSideMenu}>
				<Icon name={"menu"} size={21} style={styles.defaultIconColor} />
			</TouchableOpacity>
			<View style={styles.fullFlex}>
				<TouchableOpacity onPress={() => onPressCompose('Compose')}>
					<Icon name={"plus-circle"} size={19} style={[styles.homeHeaderPhone, styles.defaultIconColor]} />
				</TouchableOpacity>
				<Icon name={"settings"} size={19} style={[styles.homeHeaderPhone, styles.defaultIconColor]} />
				<TouchableOpacity onPress={() => onPressCompose('Dialer')} >
					<Icon name={"phone"} size={19} style={[styles.homeHeaderPhone, styles.defaultIconColor]} />
				</TouchableOpacity>
				<View style={{ marginLeft: 10 }}>
					<TouchableOpacity onPress={showProfileDropDown} style={styles.fullFlex}>
						<ModalDropdown renderRow={renderProfileItem} textStyle={styles.defaultTextColor} ref={e => setProfileDropDown(e)} options={profiles} defaultValue={'User 99'} dropdownStyle={styles.homeHeaderProfileDropDown} onSelect={onSelectProfile} />
						<Icon name={"arrow-down"} size={19} style={styles.defaultIconColor} />
					</TouchableOpacity>
				</View>
			</View>
			<CustomModal
				isVisible={isProfileModalVisible}
				onBackdropPress={onModalClose}
				onPressSave={onPressSaveProfileName} />
		</View>
	)
}

export default HomeHeader;