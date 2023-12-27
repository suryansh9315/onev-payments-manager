import {
  FlatList,
  Animated,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { admin, number, sessionToken, user } from "../atoms/User";
import ListItemHome from "../components/ListItemHome";
import Paginator from "../components/Paginator";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log(API_URL?.substring(0, 0));

const HomeScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const [user_info, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const list = [
    {
      ...user_info,
      index: 0,
      image_comp: require("../../assets/Male_avatar.png"),
    },
    {
      ...user_info,
      index: 1,
      image_comp: require("../../assets/electric_car.png"),
    },
    {
      ...user_info,
      index: 2,
      image_comp: require("../../assets/credit_card.png"),
    },
    {
      ...user_info,
      index: 3,
      image_comp: require("../../assets/text_files.png"),
    },
    {
      ...user_info,
      index: 4,
      image_comp: require("../../assets/Male_avatar.png"),
    }
  ];
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef();

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

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/getDriverInfo`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const json = await response.json();
      if (response.status === 400) {
        alert(`${json.message}`);
        logout();
        return;
      }
      setUser(json.driver);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{
          position: "absolute",
          zIndex: 1000,
          top,
          left: 0,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Icon
          name="menu-unfold"
          type="antdesign"
          size={32}
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          ToastAndroid.show("Refreshing !", ToastAndroid.SHORT);
          fetchUserInfo();
        }}
        style={{
          position: "absolute",
          zIndex: 1000,
          top,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Icon
          name="refresh-cw"
          type="feather"
          size={32}
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 3, paddingTop: 20, backgroundColor: "#fff" }}>
        <FlatList
          data={list}
          renderItem={({ item }) => <ListItemHome item={item} logout={logout} />}
          keyExtractor={(item) => item.index}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          ref={listRef}
        />
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Text>Payment Status</Text>
        <TouchableOpacity
          style={{ width: "100%", alignItems: "center" }}
          onPress={() => navigation.navigate("Payment")}
        >
          <Text
            style={{
              backgroundColor:
                user_info?.balance >= 0 ? "#rgb(42,177,166)" : "#F75428",
              paddingVertical: 15,
              textAlign: "center",
              width: "80%",
              borderRadius: 5,
              color: "#fff",
            }}
          >
            {user_info?.balance >= 0 ? "Paid" : "Not Paid"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%" }}>
        <Paginator list={list} scrollX={scrollX} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
