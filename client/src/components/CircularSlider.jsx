import Svg, { Circle, G } from "react-native-svg";
import React, { useState, useRef } from "react";
import { PanResponder, Animated, Text, View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const CircularSlider = ({ payment, maxPayment = 5000, setPayment }) => {
  const PADDING = 50;
  const size = width - PADDING * 2;
  const strokeWidth = 50;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const initialPercentage = (payment / maxPayment) * 100;
  const [percentage, setPercentage] = useState(initialPercentage);
  const angle = (2 * Math.PI * payment) / maxPayment;
  const initialEndX = radius * Math.sin(angle);
  const initialEndY = radius * Math.cos(angle);

  const start = useRef(new Animated.ValueXY({ x: 0, y: -radius })).current;
  const end = useRef(
    new Animated.ValueXY({ x: initialEndX, y: -initialEndY })
  ).current;

  const normalize = (value) => {
    const res = value % (2 * Math.PI);
    return res > 0 ? res : 2 * Math.PI + res;
  };

  const panEndResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (e, gesture) => {
        const { moveX, moveY } = gesture;
        let newAngle = Math.atan2(
          moveX - (center + PADDING),
          height / 2 - moveY
        );
        newAngle = normalize(newAngle);
        const newEndX = radius * Math.sin(newAngle);
        const newEndY = radius * Math.cos(newAngle);
        const newPayment = (newAngle * maxPayment) / (2 * Math.PI);
        const newPercentage = (newPayment * 100) / maxPayment;
        setPayment(Math.round(newPayment / 100) * 100);
        setPercentage(newPercentage);
        end.setValue({
          x: newEndX,
          y: -newEndY,
        });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          alignItems: "center",
          justifyContent: "center"
        },
      ]}
    >
      <Svg height={size} width={size}>
        <G origin={center} rotation={-90}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e6e7e8"
            strokeWidth={strokeWidth}
            fill="white"
            fillOpacity={0}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#F75428"
            strokeWidth={strokeWidth}
            fill="white"
            fillOpacity={0}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * percentage) / 100
            }
          />
        </G>
      </Svg>
      <Animated.View
        style={{
          height: 50,
          width: 50,
          backgroundColor: "#e8e8e8",
          borderRadius: 25,
          transform: [{ translateX: start.x }, { translateY: start.y }],
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 14,
            width: 14,
            backgroundColor: "#cbcbcb",
            borderRadius: 7,
            position: "absolute",
          }}
        />
      </Animated.View>
      <Animated.View
        {...panEndResponder.panHandlers}
        style={{
          height: 50,
          width: 50,
          backgroundColor: "#ffffff",
          borderRadius: 25,
          transform: [{ translateX: end.x }, { translateY: end.y }],
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 14,
            width: 14,
            backgroundColor: "#cbcbcb",
            borderRadius: 7,
            position: "absolute",
          }}
        />
      </Animated.View>
      <View style={{ position: "absolute" }}>
        <Text style={{ fontSize: 36, color: "#000", fontWeight: 600 }}>
          &#8377;{String(payment).substring(0, 6)}
        </Text>
      </View>
    </Animated.View>
  );
};

export default CircularSlider;
