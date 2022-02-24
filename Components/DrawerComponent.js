import React from 'react';
import { View, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, useDrawerProgress, } from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather'

import styles from '../style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate } from '../helpers/RootNavigation';

export function DrawerContent(props) {
	const width = useWindowDimensions().width * 0.3;
	// const drawerProgress = useDrawerProgress();

	// const translateX = interpolate(drawerProgress, {
	// 	inputRange: [0, 1],
	// 	outputRange: [-100, 0],
	// });

	const onPressNavigation = (screen) => {
		navigate(screen)
	}

	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.drawerContainer}>
				<Text style={styles.drawerInnerHeading}>Settings</Text>
				<View style={styles.drawerInnerChildWrap}>
					<TouchableOpacity style={styles.drawerInnerChildListWrap}>
						<Feather name="mail" size={15} style={styles.drawerInnerChildIcon} />
						<Text style={styles.drawerInnerChildText}>Email Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap}>
						<Feather name="user" size={15} style={styles.drawerInnerChildIcon} />
						<Text style={styles.drawerInnerChildText}>Profile Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap}>
						<Feather name="settings" size={15} style={styles.drawerInnerChildIcon} />
						<Text style={styles.drawerInnerChildText}>Account Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.drawerInnerChildListWrap}>
						<Feather name="shield" size={15} style={styles.drawerInnerChildIcon} />
						<Text style={styles.drawerInnerChildText}>MFA Settings</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => onPressNavigation('Contact')}>
				<Text style={styles.drawerInnerHeading} >Contacts</Text>
				</TouchableOpacity>
			</View>
		</DrawerContentScrollView>
	);
}
