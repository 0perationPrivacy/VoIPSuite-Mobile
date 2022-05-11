import Icon from 'react-native-vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { useNavigation } from '@react-navigation/native'
import styles from '../style'
import { navigate, openDrawer } from '../helpers/RootNavigation'
import { CustomModal } from '.'
import { useDispatch, useSelector } from 'react-redux'
import { profileActions } from '../redux/actions/profile'
import { TouchableOpacity } from 'react-native-gesture-handler'
import _ from 'lodash'

const HomeHeader = ({ onPressProfile = () => { } }) => {

	const defaultProfileObj = { 'id': null, 'profile': 'Add new profile' };

	const [profileDropDown, setProfileDropDown] = useState(null);
	const [isProfileModalVisible, setProfileModalVisibility] = useState(false);
	const [profileList, setProfileList] = useState([]);
	const [profiles, setProfiles] = useState([defaultProfileObj]);
	const [profileName, setProfileName] = useState('Choose Profile Name');

	const navigation = useNavigation();
	const dispatch = useDispatch();

	const isLoading = useSelector(state => state.profile.isLoading);
	const profile = useSelector(state => state.profile.items);

	useEffect(() => {
		getProfileList()
	}, [])

	useEffect(() => {
		if (profile && _.isArray(profile)) {
			let data = []
			profile.map((item, index) => {
				const { id, profile, number } = item;
				data.push({ id, profile, number })
			})

			data.push(defaultProfileObj);
			setProfiles(data);
			onSetProfileNameRedux({ profile: data[0]?.profile, id: data[0]?.id })
		}
	}, [profile])

	const getProfileList = () => {
		dispatch(profileActions.getProfileAction())
	}

	const showProfileDropDown = () => {
		profileDropDown && profileDropDown.show();
	}

	const onSetProfileNameRedux = (name) => {
		setProfileName(name.profile);
		dispatch(profileActions.setProfileName(name))
	}

	const onSelectProfile = (i, item) => {
		const { id } = item;

		if (id === null) {
			setProfileModalVisibility(true)
		}

		onPressProfile(id);
		setProfileName(id)
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

	const onPressSaveProfileName = (data, errorCb) => {
		dispatch(profileActions.createProfileAction(data, onSaveProfileCb, errorCb))
	}

	const onSaveProfileCb = () => {
		setProfileModalVisibility(false)
		getProfileList();
	}

	const renderButtonText = (rowData) => {
		const { profile, id } = rowData;
		if (id) {
			onSetProfileNameRedux({ profile, id });
		}
		return `${profile}`;
	};

	const renderProfileItem = (item, index) => {
		const { profile, number } = item;

		return (
			<View style={styles.profileDropDownItemContainer}>
				<Text style={styles.textItem}>{profile}</Text>
				{number && <Text style={[styles.textItem, { color: '#ff5821' }]}>{number}</Text>}
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
						<ModalDropdown
							renderRow={renderProfileItem}
							textStyle={styles.defaultTextColor}
							ref={e => setProfileDropDown(e)}
							options={profiles}
							defaultValue={profileName}
							dropdownStyle={styles.homeHeaderProfileDropDown}
							renderButtonText={(rowData) => renderButtonText(rowData)}
							onSelect={onSelectProfile}
							scrollEnabled={true}
							showsVerticalScrollIndicator={true}
						/>
						<Icon name={"arrow-down"} size={19} style={styles.defaultIconColor} />
					</TouchableOpacity>
				</View>
			</View>
			<CustomModal
				isVisible={isProfileModalVisible}
				onBackdropPress={onModalClose}
				onPressSave={onPressSaveProfileName}
				isLoading={isLoading}
			/>
		</View>
	)
}

export default HomeHeader;