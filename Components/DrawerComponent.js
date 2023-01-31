import React from 'react';
import { View, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, useDrawerProgress, } from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import styles from '../style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate, navigateAndReset } from '../helpers/RootNavigation';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../redux/actions'
import { getColorByTheme, getOSVersion } from '../helpers/utils';
import Metrics from '../helpers/Metrics';

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

	const getVersionText = () => {
		return (
			<View style={customStyle.versionTextContainer}>
				<Text style={customStyle.versionText}>{getOSVersion()}</Text>
			</View>
		)
	}

	return (
		<DrawerContentScrollView {...props} scrollEnabled={false}>
			<View style={styles.drawerMainContainer}>
				<View style={styles.drawerContainer}>
					<View style={[styles.drawerMainItemWrap, { marginBottom: 0 }]}>
						<Feather name="settings" size={18} style={[styles.drawerInnerChildIcon, styles.drawerMainIconColor]} />
						<Text style={styles.drawerInnerHeading} >Settings</Text>
					</View>
					<View style={styles.drawerInnerChildWrap}>
						<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('emailsettings')}>
							<Feather name="mail" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
							<Text style={styles.drawerInnerChildText}>Email</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('ProfileSettings')}>
							<Feather name="user" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
							<Text style={styles.drawerInnerChildText}>Profile</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.drawerInnerChildListWrap} onPress={() => onPressNavigation('accounts')}>
							<Feather name="settings" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
							<Text style={styles.drawerInnerChildText}>Account</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.drawerInnerChildListWrap}>
							<Feather name="shield" size={15} style={[styles.drawerInnerChildIcon, styles.defaultIconColor]} />
							<Text style={styles.drawerInnerChildText}>MFA</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.drawerMainItemWrap} onPress={() => onPressNavigation('ContactList')}>
						<AntDesign name="contacts" size={18} style={[styles.drawerInnerChildIcon, styles.drawerMainIconColor]} />
						<Text style={styles.drawerInnerHeading} >Contacts</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerMainItemWrap} onPress={() => onPressNavigation('Messages')}>
						<Feather name="message-circle" size={18} style={[styles.drawerInnerChildIcon, styles.drawerMainIconColor]} />
						<Text style={styles.drawerInnerHeading} >Messages</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.drawerMainItemWrap]} onPress={onPressLogout}>
						<AntDesign name="logout" size={18} style={[styles.drawerInnerChildIcon, styles.drawerMainIconColor]} />
						<Text style={styles.drawerInnerHeading} >Logout</Text>
					</TouchableOpacity>
				</View>
				{getVersionText()}

			</View>
		</DrawerContentScrollView>
	);
}

const customStyle = StyleSheet.create({
	versionTextContainer: {
		alignItems: 'center',
		marginTop: Metrics.baseMargin
	},
	versionText: {
		color: getColorByTheme('#000', '#fff'),
		fontSize: 14,
		fontFamily: Metrics.fontMedium
	},
});