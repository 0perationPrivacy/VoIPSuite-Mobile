import { Appearance } from 'react-native';
import _ from 'lodash';


var themeMode = 'light';
const isEmpty = (text) => {
    return _.isEmpty(text);
}

const getColorByTheme = (light, dark) => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? dark : light
}

export { isEmpty, getColorByTheme }