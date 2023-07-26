import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Transition = () => {
  const tranAnimationRef = useRef(null);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    tranAnimationRef.current?.play();
    return () => {
      tranAnimationRef.current?.reset();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LottieView
          ref={tranAnimationRef}
          style={{
            width: width,
            height: height,
          }}
          resizeMode="cover"
          source={require("../animations/transition.json")}
          loop={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Transition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
