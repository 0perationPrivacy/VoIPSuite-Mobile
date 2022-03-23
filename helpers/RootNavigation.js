import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export function goBack() {
    if (canGoBack()) {
        navigationRef.goBack();
    }
}

export function canGoBack() {
    return navigationRef.canGoBack();
}

export function navigateAndReset(route) {
    return navigationRef.reset({
        index : 0,
        routes : [
            { name : route }
        ]
    })
}

