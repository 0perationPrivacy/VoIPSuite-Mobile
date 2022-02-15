import Icon from 'react-native-vector-icons/Feather'
import React, { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown';

import styles from '../style';

const HomeHeader = () => {
	const [profileDropDown, setProfileDropDown] = useState(null);

	const showProfileDropDown = () => {
		profileDropDown && profileDropDown.show();
	}

	const onSelectProfile = (i, v) => {
		console.log(i, v)
	}

	return (
		<View style={[styles.fullFlex, styles.homeHeaderWrapper]}>
			<View>
				<Icon name={"menu"} size={21} />
			</View>
			<View style={styles.fullFlex}>
				<Icon name={"settings"} size={19} />
				<Icon name={"phone"} size={19} style={styles.homeHeaderPhone} />
				<View>
					<TouchableOpacity onPress={showProfileDropDown} style={styles.fullFlex}>
						<ModalDropdown ref={e => setProfileDropDown(e)} options={['user 99', 'user 100']} defaultValue={'User 99'} dropdownStyle={styles.homeHeaderProfileDropDown} onSelect={onSelectProfile} />
						<Icon name={"arrow-down"} size={19} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default HomeHeader;