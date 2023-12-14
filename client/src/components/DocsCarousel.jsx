import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Carousel from "react-native-reanimated-carousel";

const DocsCarousel = ({ docs }) => {
  const width = Dimensions.get("window").width - 60;

  const openURL = async (downloadUrl) => {
    const supported = await Linking.canOpenURL(downloadUrl);
    if (supported) {
      await Linking.openURL(downloadUrl);
    } else {
      console.log(`Don't know how to open this URL: ${downloadUrl}`);
    }
  };

  return (
    <View>
      <Carousel
        loop
        width={width}
        height={(9 / 16) * width + 30}
        autoPlay={false}
        data={docs}
        scrollAnimationDuration={1000}
        renderItem={({ index, item }) => {
          if (item?.url?.type === "image") {
            return (
              <View>
                <Image
                  source={{ uri: item?.url?.url }}
                  style={{
                    height: (9 / 16) * width,
                    width: width,
                    resizeMode: "cover",
                    borderRadius: 2,
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "300",
                    fontSize: 16,
                    marginTop: 5,
                  }}
                >
                  {item?.label}
                </Text>
              </View>
            );
          } else {
            return (
              <View>
                <View
                  style={{
                    height: (9 / 16) * width,
                    width: width,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#c7dafe",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 140,
                      backgroundColor: "#005EFF",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                    onPress={() => openURL(item?.url?.url)}
                  >
                    <Text
                      style={{
                        backgroundColor: "#005EFF",
                        color: "#eeeeee",
                      }}
                    >
                      Download PDF
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "300",
                    fontSize: 16,
                    marginTop: 5,
                  }}
                >
                  {item?.label}
                </Text>
              </View>
            );
          }
        }}
      />
    </View>
  );
};

export default DocsCarousel;
