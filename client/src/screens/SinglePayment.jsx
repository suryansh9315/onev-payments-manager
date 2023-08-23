import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";
import Loader from "../components/Loader";
import { API_URL } from "@env";

console.log(API_URL.substring(0, 0));

const SinglePayment = ({ route, navigation }) => {
  const { paymentDetails } = route.params;
  const [loading, setLoading] = useState(false);
  const token = useRecoilValue(sessionToken);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/updateQROrder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          currentStatus: paymentDetails?.status,
          order_id: paymentDetails?.id,
        }),
      });
      const jsonn = await res.json();
      console.log(jsonn);
      if (res.status === 200) {
        paymentDetails.status =
          paymentDetails.status === "Paid" ? "created" : "Paid";
        alert(jsonn.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            type="ionicon"
            size={28}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Payment Details</Text>
        <TouchableOpacity style={{ opacity: 0 }}>
          <Icon
            name="arrow-back"
            type="ionicon"
            size={32}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            backgroundColor: "#f9f9f8",
            marginHorizontal: 30,
            borderRadius: 10,
            paddingVertical: 20,
            elevation: 1,
          }}
        >
          <Image
            source={{ uri: paymentDetails?.screenshot?.url }}
            style={{
              height: 500,
              width: 300,
              resizeMode: "stretch",
            }}
          />
        </View>
        <View style={{ paddingHorizontal: 30, gap: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderColor: "#dddddd",
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: "#f9f9f8",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Icon
                name="payment"
                type="materialicon"
                size={28}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 12, fontWeight: "300" }}>
                Payment Status
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 18, alignItems: "center" }}>
                  {paymentDetails?.status === "Paid"
                    ? "Verified"
                    : "Unverified"}
                </Text>
                {paymentDetails?.status === "Paid" ? (
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                ) : (
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderColor: "#dddddd",
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: "#f9f9f8",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Icon
                name="calendar"
                type="antdesign"
                size={28}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 12, fontWeight: "300" }}>Date</Text>
              <Text style={{ fontSize: 18 }}>
                {new Date(paymentDetails?.created_at * 1000)
                  .toString()
                  ?.split(" ")
                  ?.slice(1, 5)
                  ?.join(" ")}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderColor: "#dddddd",
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: "#f9f9f8",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Icon
                name="user"
                type="antdesign"
                size={28}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 12, fontWeight: "300" }}>Name</Text>
              <Text style={{ fontSize: 18 }}>
                {paymentDetails?.driver_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderColor: "#dddddd",
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: "#f9f9f8",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Icon
                name="call"
                type="ionicon"
                size={28}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 12, fontWeight: "300" }}>Number</Text>
              <Text style={{ fontSize: 18 }}>
                {paymentDetails?.driver_number}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ paddingHorizontal: 30, marginTop: 20, marginBottom: 20 }}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              style={{
                backgroundColor: "#005EFF",
                paddingVertical: 15,
                textAlign: "center",
                borderRadius: 5,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Update Status
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SinglePayment;
