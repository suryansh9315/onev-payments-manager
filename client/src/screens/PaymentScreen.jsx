import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularSlider from "../components/CircularSlider";

const PaymentScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 30 }}>
        {/* <Text>Coming Soon</Text> */}
        <CircularSlider initialPayment={1000} />
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
