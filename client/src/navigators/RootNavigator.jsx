import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import { sessionToken, admin, user, number } from "../atoms/User";
import { useRecoilState } from "recoil";
import BottomNavigator from "./BottomNavigator";
import BottomNavigatorAdmin from "./BottomNavigatorAdmin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import CustomSplashScreen from "../components/CustomSplashScreen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

console.log(API_URL?.substring(0, 0));
SplashScreen.preventAutoHideAsync()
const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}

const RootNavigator = () => {
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const [user_info, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);
  const [loading, setLoading] = useState(true);

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem("user_info");
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    deleteData();
    setToken(null);
    setIsAdmin(false);
    setPhone(null);
    setUser(null);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_info");
      if (jsonValue !== null) {
        const userr = JSON.parse(jsonValue);
        const response = await fetch(`${API_URL}/api/auth/checkToken`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userr.token,
            phone: "+91 " + userr.phone,
            isAdmin: userr.isAdmin,
          }),
        });
        const json = await response.json();
        if (response.status === 400) {
          alert(`${json.message}`);
          logout();
          return;
        }
        if (!userr.isAdmin) {
          const noti_token = await registerForPushNotificationsAsync();
          console.log(noti_token);
          if (noti_token) {
            json.user.noti_token = noti_token;
            const nRes = await fetch(
              `${API_URL}/api/notification/addNotiToken`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: userr.token,
                  noti_token,
                }),
              }
            );
          }
        }
        setUser(json.user);
        setToken(userr.token);
        setIsAdmin(userr.isAdmin);
        setPhone(userr.phone);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    const hideSplash = async () => await SplashScreen.hideAsync();
    hideSplash();
    getData();
    // clearAll()
  }, []);

  if (loading) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack.Navigator>
      {token && user_info ? (
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
