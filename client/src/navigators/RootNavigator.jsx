import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import { sessionToken, admin } from "../atoms/User";
import { useRecoilValue } from "recoil";
import BottomNavigator from "./BottomNavigator";
import BottomNavigatorAdmin from "./BottomNavigatorAdmin";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const token = useRecoilValue(sessionToken);
  const isAdmin = useRecoilValue(admin);

  return (
    <Stack.Navigator initialRouteName="Login">
      {token ? (
        isAdmin ? (
          <>
            <Stack.Screen
              name="HomeAdmin"
              component={BottomNavigatorAdmin}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={BottomNavigator}
              options={{ headerShown: false }}
            />
          </>
        )
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Otp"
            component={OtpScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
