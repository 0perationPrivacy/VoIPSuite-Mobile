import { Appearance } from 'react-native';
import _ from 'lodash';
import { getVersion } from 'react-native-device-info';

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

const getOSVersion = () => {
    return `App Version: ${getVersion()}`;
}

const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        //   '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

const generateRandomString = (length = 5) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export {
    isEmpty,
    getColorByTheme,
    getReadableDate,
    getReadableTime,
    getOSVersion,
    validURL,
    generateRandomString
}