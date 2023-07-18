import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import { sessionToken, admin, user, number } from "../atoms/User";
import { useRecoilState } from "recoil";
import BottomNavigator from "./BottomNavigator";
import BottomNavigatorAdmin from "./BottomNavigatorAdmin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env' 
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

console.log(API_URL?.substring(0,0))
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const [user_info, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);

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
        const response = await fetch(
          `${API_URL}/api/auth/checkToken`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: userr.token,
              phone: "+91 " + userr.phone,
              isAdmin: userr.isAdmin
            }),
          }
        );
        const json = await response.json();
        if (response.status === 400) {
          alert(`${json.message}`);
          logout();
          return;
        }
        console.log(json)
        setUser(json.user)
        setToken(userr.token);
        setIsAdmin(userr.isAdmin);
        setPhone(userr.phone);
      }
    } catch (e) {
      console.log(e);
    } finally {
      await SplashScreen.hideAsync();
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
    getData();
    // clearAll()
  }, []);

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
