import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CircularSlider from "../components/CircularSlider";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";

const PaymentScreen = () => {
  const [payment, setPayment] = useState(1000);
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          size={36}
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          paddingVertical: 40,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            position: "absolute",
            top: 100,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 600 }}>
            Paying the due amount
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#a8a8a8",
              width: 250,
              textAlign: "center",
            }}
          >
            Move the dial to pay more or less to earn points.
          </Text>
        </View>
        <CircularSlider payment={payment} setPayment={setPayment} />
        <View
          style={{
            position: "absolute",
            bottom: 30,
            width: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={{
                backgroundColor: "#F75428",
                paddingVertical: 15,
                width: "90%",
                textAlign: "center",
                borderRadius: 10,
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Pay &#8377;{payment}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
