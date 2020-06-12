import {createAppContainer, createSwitchNavigator} from "react-navigation";

import AuthNavigator from "./AuthNavigation";
import AppNavigator from "./AppNavigation";

const RootNavigator = createSwitchNavigator(
    {
        Auth:AuthNavigator,
        App:AppNavigator
    },
    {
      initialRouteName:'Auth'
    },
);

export default createAppContainer(RootNavigator);
