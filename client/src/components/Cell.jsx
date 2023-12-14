import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { setDate } from "date-fns";

const Cell = ({
  children,
  empty,
  date,
  oldDate,
  onChange,
  attendance,
  setAttendance,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!empty) {
          onChange(setDate(oldDate, date));
        }
      }}
      style={{
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: empty ? 0 : 0,
        borderRadius: 20,
        backgroundColor:
          date === oldDate?.getDate() && !empty ? "#005EFF" : "#fff",
      }}
    >
      <Text
        style={{
          color: date === oldDate?.getDate() && !empty ? "#fff" : "#000",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Cell;
