import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomSplashScreen = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
    return () => {
      animationRef.current?.reset();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <LottieView
        ref={animationRef}
        style={{
          width: 250,
          height: 250,
          backgroundColor: '#fff'
        }}
        resizeMode="cover"
        source={require("../animations/data.json")} 
      />
    </SafeAreaView>
  );
};

export default CustomSplashScreen;
