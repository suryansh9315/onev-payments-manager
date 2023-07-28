import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CircularSlider from "../components/CircularSlider";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { useRecoilValue, useRecoilState } from "recoil";
import { user, sessionToken } from "../atoms/User";
import Loader from "../components/Loader";
import { API_URL, RAZORPAY_KEY_ID } from "@env";
import RazorpayCheckout from "react-native-razorpay";

console.log(API_URL?.substring(0, 0), RAZORPAY_KEY_ID?.substring(0, 0));

const PaymentScreen = () => {
  const [driver_info, setDriverInfo] = useRecoilState(user);
  const token = useRecoilValue(sessionToken);
  const [payment, setPayment] = useState(
    driver_info?.balance < 0 ? -driver_info?.balance : 0
  );
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (payment < 500) return alert("Online Payments of less than 500 are not allowed.");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders/createOrder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: payment,
          token,
        }),
      });
      const json = await response.json();
      if (response.status !== 200) {
        return alert(json?.message);
      }
      const order_id = json.order_id;
      const txnId = json.txnId;
      const options = {
        currency: "INR",
        key: RAZORPAY_KEY_ID,
        amount: payment,
        name: "Paycol Corp",
        order_id,
        prefill: {
          email: driver_info?.dEmail,
          contact: driver_info?.dNumber.split(" ").join(),
          name: driver_info?.name,
        },
      };
      RazorpayCheckout.open(options)
        .then(async (data) => {
          const responseV = await fetch(
            `${API_URL}/api/payments/verifySignature`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                txnId,
                token,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_signature: data.razorpay_signature,
              }),
            }
          );
          const jsonV = await responseV.json();
          if (response.status !== 200) {
            return alert(jsonV?.message);
          }
          const old_balance = driver_info.balance;
          const old_Paid = driver_info.Paid;
          const user_info_copy = driver_info;
          delete user_info_copy.balance;
          delete user_info_copy.Paid;
          setDriverInfo({
            ...user_info_copy,
            balance: old_balance + payment,
            Paid: old_Paid + payment,
          });
          alert(jsonV?.message);
          setLoading(false);
          navigation.navigate("HomeDriver");
        })
        .catch((error) => {
          setLoading(false);
          alert("Something went wrong");
        });
    } catch (error) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1000,
          top,
          left: 0,
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
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
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Payment</Text>
      </View>
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
        <CircularSlider payment={payment > 5000 ? 5000 : payment} setPayment={setPayment} />
        <View
          style={{
            position: "absolute",
            bottom: 30,
            width: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ width: "100%", alignItems: "center" }}
            onPress={handlePayment}
          >
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
