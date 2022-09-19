import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Header } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute } from '@react-navigation/native';
import styles from '../../style';
import { canGoBack, goBack } from '../../helpers/RootNavigation';
import { getColorByTheme } from '../../helpers/utils';

const CustomHeader = ({ isTitle, onBackProp, headerBody, headerRight, title }) => {
    console.log('header right ===>', typeof headerRight)
    const route = useRoute();

    const onPressBack = () => {
        onBackProp ? onBackProp() : goBack();
    }

    return (
        <Header backgroundColor={getColorByTheme('#fff', '#2e2e2e')}>
            {canGoBack() && <TouchableOpacity onPress={onPressBack}>
                <Feather name={'arrow-left'} size={24} style={styles.defaultIconColor} />
            </TouchableOpacity>}
            {headerBody ? headerBody : isTitle && <Text style={styles.headerTitle}>{title ? title : route.name}</Text>}
            {headerRight && headerRight()}
        </Header>
    )
}

CustomHeader.defaultProps = {
    isTitle: true,
    onBackProp: null,
    headerBody: null,
    headerRight: null,
    title: null
};

export default CustomHeader;