import { FlatList, Animated, View, Text, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useRef } from "react";
import { useRecoilValue } from "recoil";
import { user } from "../atoms/User";
import ListItemHome from "../components/ListItemHome";
import Paginator from "../components/Paginator";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const user_info = useRecoilValue(user);
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
  ];
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef();

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
          paddingVertical: 20
        }}
      >
        <Icon
          name="menu-unfold"
          type="antdesign"
          size={36}
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 3, paddingTop: 20, backgroundColor: '#fff' }}>
        <FlatList
          data={list}
          renderItem={({ item }) => <ListItemHome item={item} />}
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
              backgroundColor: user_info?.balance >= 0
                ? "#rgb(42,177,166)"
                : "#F75428",
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
