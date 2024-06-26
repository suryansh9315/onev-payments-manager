import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { CheckBox } from '@rneui/themed';
import { useRecoilState } from "recoil";
import { admin, number, sessionToken, user } from "../atoms/User";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env' 

SplashScreen.preventAutoHideAsync();
console.log(API_URL.substring(0,0))

const height = Dimensions.get("window").height;

const LoginScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const [userr, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);
  const [loading, setLoading] = useState(false);

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
        const user_info = JSON.parse(jsonValue);
        const response = await fetch(
          `${API_URL}/api/auth/checkToken`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: user_info.token,
            }),
          }
        );
        const json = await response.json();
        if (response.status === 400) {
          alert(`${json.message}`);
          logout();
          return;
        }
        setToken(user_info.token);
        setIsAdmin(user_info.isAdmin);
        setPhone(user_info.phone);
        setUser(user_info.userr)
      }
    } catch (e) {
      console.log(e);
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const requestOtp = async () => {
    if (phone.length !== 10) return
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: "+91 " + phone,
            isManager: isAdmin,
          }),
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        navigation.navigate("Otp");
        setLoading(false);
      } else {
        setLoading(false);
        alert(`${json.message}`);
      }
    } catch (error) {
      setLoading(false);
      alert("Something went wrong...");
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoHeading}>PAYCOL</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputContainerWrapper}>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputTitle}>Welcome</Text>
              <MaterialCommunityIcons
                name="hand-clap"
                size={24}
                color="#ffbb9d"
              />
            </View>
            <Text style={styles.inputDesc}>
              With a valid number, you can access deliveries, and our other
              services.
            </Text>
            <View style={styles.inputMobileContainer}>
              <TouchableOpacity style={styles.countryContainer}>
                <Image
                  source={require("../../assets/Flag.png")}
                  style={{ width: 30, aspectRatio: 1.3, borderRadius: 5 }}
                />
                <Text style={{ fontSize: 12 }}>+91</Text>
                <Entypo name="chevron-thin-down" size={12} color="black" />
              </TouchableOpacity>
              <View style={styles.mobileContainer}>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Mobile Number"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  inputMode="numeric"
                  maxLength={10}
                  onEndEditing={requestOtp}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#114084",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 5,
              }}
            >
              <CheckBox
                right
                checkedIcon="check-square-o"
                uncheckedIcon="square-o"
                checked={isAdmin}
                containerStyle={{
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  backgroundColor: '#114084',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                size={22}
                checkedColor="#53ed58"
                uncheckedColor="#f9f9f9"
                onPress={() => setIsAdmin(!isAdmin)}
              />
              <Text style={{ color: "#fff", fontWeight: "300" }}>Admin</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    backgroundColor: "#F4FDFE",
    alignItems: "center",
    justifyContent: "center",
    minHeight: (2 / 3) * height,
  },
  logo: {
    height: 250,
    width: 250,
  },
  logoHeading: {
    fontSize: 35,
    fontWeight: "600",
    color: "#114084",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: "#114084",
    alignItems: "center",
    justifyContent: "center",
    minHeight: (1 / 3) * height,
  },
  inputContainerWrapper: {
    marginVertical: 20,
    paddingHorizontal: 30,
    gap: 10,
    width: "100%",
  },
  inputTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inputTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "400",
  },
  inputDesc: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
  },
  inputMobileContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginTop: 10,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4FDFE",
    height: 50,
    borderRadius: 5,
    gap: 5,
    width: "30%",
  },
  mobileContainer: {
    height: 50,
    borderRadius: 5,
    width: "70%",
  },
  mobileInput: {
    borderRadius: 5,
    backgroundColor: "#F4FDFE",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
