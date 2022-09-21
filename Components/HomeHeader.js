import Icon from 'react-native-vector-icons/Feather'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
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
import RBSheet from "react-native-raw-bottom-sheet";
import { Button } from 'react-native-elements'
import Metrics from '../helpers/Metrics'

const HomeHeader = ({ onPressProfile = () => { } }) => {

	const [profileDropDown, setProfileDropDown] = useState(null);
	const [isProfileModalVisible, setProfileModalVisibility] = useState(false);
	const [profileList, setProfileList] = useState([]);
	const [profiles, setProfiles] = useState([]);
	const [activeProfileNumber, setActiveProfileNumber] = useState(null);
	const [profileName, setProfileName] = useState('Choose Profile Name');

	const navigation = useNavigation();
	const dispatch = useDispatch();

	const isLoading = useSelector(state => state.profile.isLoading);
	const profile = useSelector(state => state.profile.items);

	const refRBSheet = useRef();

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

			setProfiles(data);
			onSetProfileNameRedux({ profile: data[0]?.profile, id: data[0]?.id })
			onPressProfile(data[0]?.id);
			setActiveProfileNumber(data[0]?.number)
		}
	}, [profile])


	const showProfileDropDown = () => {
		refRBSheet.current.open()
	}

	const onSetProfileNameRedux = (name) => {
		setProfileName(name.profile);
		dispatch(profileActions.setProfileName(name))
	}

	const onSelectProfile = (item) => {
		const { id, number } = item;

		onPressProfile(id);
		setProfileName(id);
		setActiveProfileNumber(number)
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

	const renderProfileItem = ({ item }) => {
		console.log('huzaifa ===>', item)
		const { profile, number } = item;

		return (
			<Text style={{ borderWidth: 1, color: '#000' }}>{profile}</Text>
		)
	}

	const renderTitleNumber = () => {
		return (
			<Text style={styles.homeHeaderAppTitle}>
				{activeProfileNumber}
			</Text>
		)
	}

	const renderBottomSheet = () => {
		const height = Dimensions.get('window').height / 2 + 100;

		return (
			<RBSheet
				ref={refRBSheet}
				closeOnDragDown={true}
				closeOnPressMask={true}
				height={height}
				customStyles={{
					draggableIcon: {
						backgroundColor: "#000",
					},
					container: {
						borderWidth: 0.5,
						borderRadius: 20,
						marginBottom: Metrics.baseMargin
					}
				}}
			>
				<View style={innerStyle.profileListContainer}>
					{renderProfileList()}
				</View>
				<Button title={'Add new profile'}></Button>
			</RBSheet>
		)
	}

	const renderProfileList = () => {
		return (
			<FlatList
				data={profiles}
				renderItem={renderProfileItem}
				keyExtractor={(item) => item.id}
			/>
		)
	}

	return (
		<View style={[styles.fullFlex, styles.homeHeaderWrapper]}>
			<View style={styles.homeHeaderLeftContainer}>
				<TouchableOpacity onPress={onPressSideMenu}>
					<Icon name={"menu"} size={25} style={styles.defaultIconColor} />
				</TouchableOpacity>
				{activeProfileNumber && renderTitleNumber()}
			</View>
			<View style={styles.fullFlex}>
				<View style={{ marginLeft: 10 }}>
					<TouchableOpacity onPress={showProfileDropDown} style={styles.fullFlex}>
						<Text style={innerStyle.profileText}>{profileName}</Text>
						<Icon name={"arrow-down"} size={19} style={styles.defaultIconColor} />
					</TouchableOpacity>
				</View>
			</View>
			{renderBottomSheet()}
			{/* <CustomModal
				isVisible={isProfileModalVisible}
				onBackdropPress={onModalClose}
				onPressSave={onPressSaveProfileName}
				isLoading={isLoading}
			/> */}
		</View>
	)
}

const innerStyle = StyleSheet.create({
	profileText: {
		fontSize: 14,
		fontFamily: Metrics.fontRegular
	},
	profileListContainer: {
		flex: 1,
		paddingHorizontal: Metrics.smallMargin,
		marginTop: Metrics.baseMargin,
	}
});


export default HomeHeader;