import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Cell from "./Cell";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  sub,
  add,
  format,
} from "date-fns";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BasicCalendar = ({ value, onChange }) => {
  const [attendance, setAttendance] = useState("");
  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;
  const prefixDays = startDate.getDay();

  const prevMonth = () => {
    onChange(sub(value, { months: 1 }));
  };

  const nextMonth = () => {
    onChange(add(value, { months: 1 }));
  };

  return (
    <View>
      <View style={{}}>
        <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "300" }}>
          {value.toDateString()}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flex: 7 }}>
        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={prevMonth}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "100",
            }}
          >
            &lt;
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            flex: 5,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "200",
            }}
          >
            {format(value, "LLLL yyyy")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={nextMonth}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "100",
            }}
          >
            &gt;
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 7, flexDirection: "row", gap: 5 }}>
        {daysOfWeek.map((day) => (
          <View
            style={{
              flex: 1,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            key={day}
          >
            <Text style={{ fontWeight: "300", fontSize: 12 }}>{day}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
        {Array(prefixDays)
          .fill(0)
          .map((_, index) => (
            <Cell key={index} empty={true} />
          ))}
        {Array(numDays)
          .fill(0)
          .map((_, index) => {
            const date = index + 1;
            return (
              <Cell
                key={date}
                empty={false}
                date={date}
                oldDate={value}
                onChange={onChange}
                setAttendance={setAttendance}
                attendance={attendance}
              >
                {date}
              </Cell>
            );
          })}
      </View>
    </View>
  );
};

export default BasicCalendar;
