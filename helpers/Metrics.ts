/*
 * @flow
 * TODO: value * ratio difference between Android and iOS is of 2 value;
 * 16 in iOS is equals to 14 in android but this need to be verify.
 */

import { Dimensions, Platform, StyleSheet, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = (size: number) => screenWidth / guidelineBaseWidth * +size;
const scaleVertical = (size: number) => screenHeight / guidelineBaseHeight * size;

const ratio = (iosSize: number, androidSize?: number) =>
    Platform.select({
        ios: scaleVertical(iosSize),
        android: androidSize || iosSize
    });

const widthRatio = (iosSize: number, androidSize?: number) =>
    Platform.select({
        ios: scale(iosSize),
        android: androidSize || iosSize
    });

const generatedFontSize = (iosFontSize: number, androidFontSize?: number) =>
    Platform.select({
        ios: scale(iosFontSize),
        android: androidFontSize || iosFontSize
    });

const NAVBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : 0;

const widthPercentageToDP = (widthPercent: string) => {
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(width * elemWidth / 100);
};

const heightPercentageToDP = (heightPercent: string) => {
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(height * elemHeight / 100);
};

const fontRegular = 'Poppins-Regular';
const fontSemiBold = 'Poppins-SemiBold';
const fontMedium = 'Poppins-Medium';
const fontBold = 'Poppins-Bold';

export default {
    ratio,
    screenWidth,
    screenHeight,
    generatedFontSize,
    smallMargin: ratio(8),
    baseMargin: ratio(16),
    doubleBaseMargin: ratio(32),
    verificationBoxSize: ratio(20),
    statusBarHeight: STATUSBAR_HEIGHT,
    horizontalLineHeight: StyleSheet.hairlineWidth,
    navBarHeight: NAVBAR_HEIGHT + STATUSBAR_HEIGHT,
    tabBarHeight: 49, // Default tab bar height in iOS 10 (source react-navigation)
    borderRadius: ratio(1),
    defaultUIHeight: ratio(60),
    lineHeight: ratio(30),
    listSpace: ratio(10),
    dividerHeight: ratio(1),
    dividerWidth: widthRatio(2),
    thumbImageHeight: ratio(30),
    thumbImageWidth: ratio(30),
    thumbImageRadius: ratio(15),
    driverImageSize: ratio(34),
    driverImageRadius: ratio(17),
    profileImageSize: ratio(120),
    profileImageRadius: ratio(60),
    stuckLocationImageSize: ratio(64),
    stuckLocationImageRadius: ratio(32),
    ratingStarSize: ratio(30),
    buttonPadding: ratio(18),
    pressHoldButtonPadding: ratio(13),
    dialogButtonPadding: ratio(12),
    graphCellWidth: (screenWidth - ratio(32)) / 3,
    routeStrokeWidth: ratio(4),
    statsNavigationImageWidth: ratio(40),

    bottomButtonHeight: ratio(56),
    buttonUIHeight: ratio(54),

    mapVerticalPadding: ratio(160),
    mapHorizontalPadding: ratio(160),

    icon: {
        tiny: ratio(8),
        small: ratio(16),
        normal: ratio(24), // Default tab icon size (source react-navigation)
        medium: ratio(32),
        large: ratio(40),
        xLarge: ratio(50),
        xxLarge: ratio(60),
        xxxLarge: ratio(100)
    },
    image: {
        small: ratio(20),
        medium: ratio(40),
        large: ratio(60),
        coverWidth: screenWidth,
        coverHeight: screenWidth / 2
    },
    widthPercentageToDP,
    heightPercentageToDP,
    uploadImage: screenWidth / 5,

    fontRegular,
    fontSemiBold,
    fontMedium,
    fontBold
};
