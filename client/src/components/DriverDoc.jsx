import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const DriverDoc = ({ item }) => {
  const imageLinks = [
    { url: item?.aadharFrontURL, label: "Aadhar Front" },
    { url: item?.aadharBackURL, label: "Aadhar Back" },
    { url: item?.rcFrontURL, label: "RC Front" },
    { url: item?.rcFrontURL, label: "RC Back" },
    { url: item?.dlFrontURL, label: "DL Front" },
    { url: item?.dlBackURL, label: "DL Back" },
  ];
  console.log(imageLinks);

  return (
    <View style={{ gap: 20 }}>
      {imageLinks?.map((image) => (
        <View key={image.label}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "300",
              marginBottom: 10,
              textAlign: "left",
              color: '#62656b'
            }}
          >
            {image.label}
          </Text>
          <Image
            source={{ uri: image?.url }}
            style={{
              height: 200,
              width: 300,
              resizeMode: "cover",
              borderRadius: 5,
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default DriverDoc;

const styles = StyleSheet.create({});
