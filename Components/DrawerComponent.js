import React from 'react';
import { View, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, useDrawerProgress, } from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather'
import styles from '../style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate, navigateAndReset } from '../helpers/RootNavigation';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../redux/actions/'

export function DrawerContent(props) {
	const width = useWindowDimensions().width * 0.3;
	// const drawerProgress = useDrawerProgress();

	// const translateX = interpolate(drawerProgress, {
	// 	inputRange: [0, 1],
	// 	outputRange: [-100, 0],
	// });

	const dispatch = useDispatch();


	const onPressNavigation = (screen) => {
		navigate(screen)
	}

	const onPressWithReset = (screen) => {
		navigateAndReset(screen)
	}

	const onPressLogout = () => {
		dispatch(userActions.logout())
	}

	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.drawerContainer}>
				<TouchableOpacity style={styles.drawerMainItemWrap} onPress={() => onPressWithReset('Home')}>
					<Text style={styles.drawerInnerHeading} >Home</Text>
				</TouchableOpacity>
				<Text style={styles.drawerInnerHeading}>Settings</Text>
				<View style={styles.drawerInnerChildWrap}>
					<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('emailsettings')}>
						<Feather name="mail" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
						<Text style={styles.drawerInnerChildText}>Email Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('ProfileSettings')}>
						<Feather name="user" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
						<Text style={styles.drawerInnerChildText}>Profile Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('accounts')}>
						<Feather name="settings" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
						<Text style={styles.drawerInnerChildText}>Account Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap}>
						<Feather name="shield" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
						<Text style={styles.drawerInnerChildText}>MFA Settings</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.drawerMainItemWrap} onPress={() => onPressNavigation('Contact')}>
					<Text style={styles.drawerInnerHeading} >Contacts</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => onPressNavigation('Messages')}>
					<Text style={styles.drawerInnerHeading} >Messages</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={onPressLogout} style={{ marginTop: 20 }}>
					<Text style={styles.drawerInnerHeading} >Logout</Text>
				</TouchableOpacity>
			</View>
		</DrawerContentScrollView>
	);
}
