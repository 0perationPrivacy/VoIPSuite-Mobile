import {
  createNavigationContainerRef,
  DrawerActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

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
  console.log(route);
  return navigationRef.reset({
    index: 0,
    routes: [{name: route}],
  });
}

export function openDrawer() {
  navigationRef.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
  navigationRef.dispatch(DrawerActions.closeDrawer());
}
