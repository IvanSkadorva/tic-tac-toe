import { NavigationAction} from '@react-navigation/native';

let _resolve = null;

const navigatorPromise = new Promise(function(resolve) {
  _resolve = resolve;
});

export const setNavigator = navigator => {
  _resolve(navigator);
};

export const handleNavigationChange = (prevState, newState, action) => {
  console.log('prevState, newState, action', prevState, newState, action);
};

export const navigate = async screenName => {
  const nav = await navigatorPromise;
  nav.dispatch({
    type: NavigationActions.NAVIGATE,
    routeName: screenName,
  });
};
