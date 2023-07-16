import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";
import React from "react";

const Paginator = ({ list, scrollX }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        height: 64,
        backgroundColor: "#fff",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {list.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

        return (
          <Animated.View
            style={{
              height: 10,
              width: dotWidth,
              borderRadius: 5,
              marginHorizontal: 5,
              backgroundColor: "#493d84",
              opacity
            }}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({});
