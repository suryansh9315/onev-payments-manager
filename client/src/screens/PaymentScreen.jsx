import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularSlider from "../components/CircularSlider";

const PaymentScreen = () => {
  const [payment, setPayment] = useState(1000);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          paddingVertical: 40,
          backgroundColor: '#fff'
        }}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 8, position: 'absolute', top: 80 }}
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
        <View style={{ position: 'absolute', bottom: 30 }}>
          <TouchableOpacity>
            <Text
              style={{
                backgroundColor: "#f4338f",
                paddingVertical: 12,
                width: 300,
                textAlign: 'center',
                borderRadius: 50,
                color: "#fff",
                fontSize: 16,
                fontWeight: 600
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
