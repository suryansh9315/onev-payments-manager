import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import React from "react";

const DriverDoc = ({ item }) => {
  const imageLinks = [
    { url: item?.aadharFront, label: "Aadhar Front" },
    { url: item?.aadharBack, label: "Aadhar Back" },
    { url: item?.panFront, label: "Pan Front" },
    { url: item?.panBack, label: "Pan Back" },
    { url: item?.rcFront, label: "RC Front" },
    { url: item?.rcFront, label: "RC Back" },
    { url: item?.dlFront, label: "DL Front" },
    { url: item?.dlBack, label: "DL Back" },
    { url: item?.insurance, label: "Insurance" },
  ];

  const openURL = async (downloadUrl) => {
    const supported = await Linking.canOpenURL(downloadUrl);
    if (supported) {
      await Linking.openURL(downloadUrl);
    } else {
      console.log(`Don't know how to open this URL: ${downloadUrl}`);
    }
  };

  return (
    <View style={{ gap: 20 }}>
      {imageLinks?.map((image) => {
        if (image.url?.type === "image") {
          return (
            <View key={image.label}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "300",
                  marginBottom: 10,
                  textAlign: "left",
                  color: "#62656b",
                }}
              >
                {image?.label}
              </Text>
              <Image
                source={{ uri: image?.url?.url }}
                style={{
                  height: 200,
                  width: 300,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
              />
            </View>
          );
        } else {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 70,
              }}
              key={image.label}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "300",
                  textAlign: "left",
                  color: "#62656b",
                }}
              >
                {image?.label}
              </Text>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 140,
                  backgroundColor: "#0051c3",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
                onPress={() => openURL(image?.url?.url)}
              >
                <Text
                  style={{
                    backgroundColor: "#0051c3",
                    color: "#eeeeee",
                  }}
                >
                  Download PDF
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      })}
    </View>
  );
};

export default DriverDoc;

const styles = StyleSheet.create({});
