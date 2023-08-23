import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useRecoilValue } from "recoil";
import { number, sessionToken } from "../atoms/User";
import Loader from "../components/Loader";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";

console.log(API_URL?.substring(0, 0));

const QRCode = ({ route, navigation }) => {
  const { amount } = route.params;
  const [screenshot, setScreenshot] = useState(null);
  const driver_phone = useRecoilValue(number);
  const token = useRecoilValue(sessionToken);
  const [loading, setLoading] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const isFocused = useIsFocused();

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const handleSubmit = async () => {
    if (!screenshot) return alert("Upload Payment Screenshot");
    try {
      setLoading(true);
      const date = new Date();
      const new_name =
        "d-" +
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        "-" +
        date.getHours() +
        "-" +
        date.getMinutes() +
        "-a-" +
        amount;
      const screenShotRef = ref(
        storage,
        `payments/${driver_phone}/${new_name}`
      );
      const screenShotURL = await uploadImageAsync(
        screenshot.uri,
        screenShotRef
      );
      const response = await fetch(`${API_URL}/api/orders/createQROrder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          token,
          screenshot: { url: screenShotURL, type: screenshot.type },
        }),
      });
      if (response.status === 400 || response.status === 404) {
        alert("Something Went Wrong");
        return;
      }
      alert(
        "Payment Recorded. It will reflect in your account after we verify it."
      );
      navigation.navigate("History");
    } catch (error) {
      alert("Something Went Wrong");
    } finally {
      setScreenshot(null);
      setLoading(false);
    }
  };

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 0.4,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, type: "image" });
    }
  };

  const uploadImageAsync = async (image, ref) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    await uploadBytes(ref, blob);
    blob.close();
    return await getDownloadURL(ref);
  };

  useEffect(() => {
    setScreenshot(null)
    setShowSample(false)
  }, [isFocused])

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
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Scan & Pay</Text>
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
            gap: 5,
            paddingVertical: 30,
            marginBottom: 20,
            backgroundColor: "#f9f9f8",
            elevation: 1,
            borderRadius: 5,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: "300" }}>Pay with</Text>
            <Image
              style={{ width: 60, height: 20, resizeMode: "contain" }}
              source={require("../../assets/UPI.png")}
            />
          </View>
          <Text style={{ fontWeight: "300" }}>To</Text>
          <Text style={{ fontWeight: "500", fontSize: 20 }}>
            Kissan Mobility Private Limited
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Image
              style={{ width: 200, height: 200, resizeMode: "contain" }}
              source={require("../../assets/QR.png")}
            />
          </View>
          <Text style={{ fontWeight: "600", fontSize: 36 }}>
            &#8377; {amount}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View>
            <Text
              style={{
                textAlign: "right",
                marginBottom: 5,
                fontSize: 13,
                fontWeight: "300",
              }}
            >
              Tap to copy UPI ID or wallet
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 18,
              gap: 18,
              backgroundColor: "#f9f9f8",
              elevation: 1,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => copyToClipboard("7701813679@paytm")}
            >
              <Text style={{ fontSize: 15 }}>UPI ID:</Text>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>
                7701813679@paytm
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#1d1c1c",
                opacity: 0.1,
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => copyToClipboard("7701813679")}
            >
              <Text style={{ fontSize: 15 }}>Paytm Wallet:</Text>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>
                7701813679
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#f9f9f8",
              elevation: 1,
              paddingHorizontal: 20,
              paddingVertical: 20,
              marginVertical: 20,
              borderRadius: 5,
              gap: 10,
            }}
          >
            <View style={{ marginBottom: 5 }}>
              <Text
                style={{ fontSize: 22, fontWeight: "600", letterSpacing: 1.5 }}
              >
                Instructions
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "justify",
                  lineHeight: 22,
                  letterSpacing: 1.3,
                }}
              >
                <Text style={{ fontWeight: "800" }}>1. </Text>Copy UPI ID or
                Scan QR Code with your preferred Payment Service Provider
                (Paytm, PhonePe, GooglePay)
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "justify",
                  lineHeight: 22,
                  letterSpacing: 1.3,
                }}
              >
                <Text style={{ fontWeight: "800" }}>2. </Text>Complete the
                transaction and make sure its of the same amount as shown above.
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "justify",
                  lineHeight: 22,
                  letterSpacing: 1.3,
                }}
              >
                <Text style={{ fontWeight: "800" }}>3. </Text>Open Payment
                History Page in your PSP App.
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "justify",
                  lineHeight: 22,
                  letterSpacing: 1.3,
                }}
              >
                <Text style={{ fontWeight: "800" }}>4. </Text>Take screenshot of
                the transaction and attach the same through upload button below.
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "justify",
                  lineHeight: 22,
                  letterSpacing: 1.3,
                }}
              >
                <Text style={{ fontWeight: "800" }}>5. </Text>View the sample
                screenshot for more clarification.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 18,
              backgroundColor: "#f9f9f8",
              elevation: 1,
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15 }}>Sample Screenshot</Text>
            <View>
              <TouchableOpacity onPress={() => setShowSample(!showSample)}>
                <Text
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    backgroundColor: "#005EFF",
                    color: "#fff",
                    borderRadius: 5,
                    fontSize: 12,
                  }}
                >
                  {showSample ? "Hide" : "View" } Sample
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 15,
              paddingVertical: 18,
              backgroundColor: "#f9f9f8",
              elevation: 1,
              borderRadius: 5,
              marginBottom: 20,
              display: showSample ? "flex" : "none" 
            }}
          >
            <Image
              source={require("../../assets/sample_payment.jpg")}
              style={{ height: 500, width: 300 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 18,
              backgroundColor: "#f9f9f8",
              elevation: 1,
              borderRadius: 5,
              marginTop: 0,
            }}
          >
            <Text style={{ fontSize: 15 }}>Screenshot of Payment</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {screenshot ? (
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
              <TouchableOpacity onPress={() => pickImage(setScreenshot)}>
                <Text
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    backgroundColor: "#005EFF",
                    color: "#fff",
                    borderRadius: 5,
                    fontSize: 12,
                  }}
                >
                  Upload
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 15,
              paddingVertical: 18,
              backgroundColor: "#f9f9f8",
              elevation: 1,
              borderRadius: 5,
              marginBottom: 20,
              display: screenshot ? "flex" : "none" 
            }}
          >
            <Image
              source={{uri: screenshot?.uri}}
              style={{ height: 500, width: 300 }}
            />
          </View>
        </View>
        <View
          style={{ marginBottom: 20, paddingHorizontal: 20, marginTop: 50 }}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              style={{
                backgroundColor: "#005EFF",
                paddingVertical: 15,
                textAlign: "center",
                borderRadius: 8,
                color: "#fff",
                fontSize: 16,
                fontWeight: 400,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCode;
