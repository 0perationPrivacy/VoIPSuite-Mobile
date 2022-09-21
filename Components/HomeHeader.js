import Icon from 'react-native-vector-icons/Feather'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { useNavigation } from '@react-navigation/native'
import styles from '../style'
import dropdownStyle from '../components/Select/style'
import { navigate, openDrawer } from '../helpers/RootNavigation'
import { CustomModal } from '.'
import { useDispatch, useSelector } from 'react-redux'
import { profileActions } from '../redux/actions/profile'
import { TouchableOpacity } from 'react-native-gesture-handler'
import _ from 'lodash'
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Button } from 'react-native-elements'

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

	const bottomSheetRef = useRef(null);
	const snapPoints = useMemo(() => ['25%', '50%'], []);


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
			onPressProfile(data[0]?.id);
		}
	}, [profile])

	const handlePresentModalPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const handleSheetChanges = useCallback((index) => {
		console.log('handleSheetChanges', index);
	}, []);


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
			handlePresentModalPress();
			return true;
		}

		onPressProfile(id);
		setProfileName(id)
	}

	const getProfileList = () => {
		dispatch(profileActions.getProfileAction())
	}

	const onPressSideMenu = () => {
		openDrawer()
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
				<Text style={dropdownStyle.textItem}>{profile}</Text>
				{number && <Text style={[dropdownStyle.textItem, { color: '#ff5821' }]}>{number}</Text>}
			</View>
		)
	}

	return (
		<View style={[styles.fullFlex, styles.homeHeaderWrapper]}>
			<View style={styles.homeHeaderLeftContainer}>
				<TouchableOpacity onPress={onPressSideMenu}>
					<Icon name={"menu"} size={25} style={styles.defaultIconColor} />
				</TouchableOpacity>
				<Text style={styles.homeHeaderAppTitle}>
					Voip Suite
				</Text>
			</View>
			<View style={styles.fullFlex}>
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
			{/* <CustomModal
				isVisible={isProfileModalVisible}
				onBackdropPress={onModalClose}
				onPressSave={onPressSaveProfileName}
				isLoading={isLoading}
			/> */}
			<BottomSheetModalProvider>
			<Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
				<BottomSheetModal
					ref={bottomSheetRef}
					index={1}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
				>
					<View style={styles.contentContainer}>
						<Text>Awesome 🎉</Text>
					</View>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		</View>
	)
}

export default HomeHeader;