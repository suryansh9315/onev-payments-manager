import { StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

const Loader = () => {
  const loaderAnimationRef = useRef(null);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    loaderAnimationRef.current?.play();
    return () => {
      loaderAnimationRef.current?.reset();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LottieView
          ref={loaderAnimationRef}
          style={{
            width: 150,
            height: 150,
          }}
          resizeMode="cover"
          source={require("../animations/loader.json")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
