import { Appearance } from 'react-native';
import _ from 'lodash';

const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var themeMode = 'light';
const isEmpty = (text) => {
    return _.isEmpty(text);
}

const getColorByTheme = (light, dark) => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? dark : light
}

const getReadableDate = (date) => {
    const currentDate = new Date(date);

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return `${months[currentMonth]} ${currentDayOfMonth}, ${currentYear} `
}

const getReadableTime = (date) => {
    date = new Date(date);

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


export { isEmpty, getColorByTheme, getReadableDate, getReadableTime }