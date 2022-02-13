import Icon from 'react-native-vector-icons/Feather';
import React from 'react'
import { Text, View , TouchableOpacity} from 'react-native'
// import styles from '../../style';

const HomeHeader = () => {
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems : 'center' , paddingVertical: 10, paddingHorizontal: 10 }}>
			<View>
				<Icon name={"menu"} size={21} />
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems : 'center'  }}>
				<Icon name={"settings"} size={19} />
				<Icon name={"phone"} size={19} style={{ marginLeft : 5, marginRight : 10 }}/>
				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems : 'center' }}>
					<Text>user 99</Text>
					<Icon name={"arrow-down"} size={19} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default HomeHeader;