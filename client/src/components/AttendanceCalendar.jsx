import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";
import Loader from "./Loader";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
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

const AttendanceCalendar = ({ driver, logout, value, onChange }) => {
  const token = useRecoilValue(sessionToken);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState("");
  const isFocused = useIsFocused();
  const [reload, setReload] = useState(false);
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

  const getAttendance = async () => {
    setLoading(true);
    try {
      const date_now_string = value.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      const date_now_string_array = date_now_string.split("/");
      const date_d = date_now_string_array[1];
      const month = date_now_string_array[0];
      const year = date_now_string_array[2];
      const date = date_d + "-" + month + "-" + year;
      const response = await fetch(`${API_URL}/api/attendance/getAttendance`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id: driver._id,
          date,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (response.status === 200) {
        setAttendance(json.attendance);
      }
      if (response.status === 401) {
        setAttendance("N/A");
      }
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (new_attendance) => {
    setLoading(true);
    try {
      const date_now_string = value.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      const date_now_string_array = date_now_string.split("/");
      const date_d = date_now_string_array[1];
      const month = date_now_string_array[0];
      const year = date_now_string_array[2];
      const date = date_d + "-" + month + "-" + year;
      const response = await fetch(
        `${API_URL}/api/attendance/changeAttendance`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            driver_id: driver._id,
            date,
            attendance: new_attendance,
          }),
        }
      );
      const json = await response.json();
      console.log(json)
      if (response.status === 200) {
        setAttendance(json.attendance);
      }
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAttendance();
    }
  }, [isFocused, reload, value]);

  return (
    <View>
      <View style={{ gap: 20, paddingTop: 10, marginBottom: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "300" }}>
          {value.toDateString()}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: attendance === "N/A" ? "#000" : "#fff",
            }}
            onPress={() => {
              updateAttendance("N/A")
            }}
          >
            <Text style={{ color: attendance === "N/A" ? "#fff" : "#000" }}>
              N/A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#23dc3d",
              backgroundColor: attendance === "present" ? "#23dc3d" : "#fff",
            }}
            onPress={() => {
              updateAttendance("present")
            }}
          >
            <Text
              style={{ color: attendance === "present" ? "#fff" : "#23dc3d" }}
            >
              P
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#ff0600",
              backgroundColor: attendance === "absent" ? "#ff0600" : "#fff",
            }}
            onPress={() => {
              updateAttendance("absent")
            }}
          >
            <Text
              style={{ color: attendance === "absent" ? "#fff" : "#ff0600" }}
            >
              A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#eed500",
              backgroundColor: attendance === "leave" ? "#eed500" : "#fff",
            }}
            onPress={() => {
              updateAttendance("leave")
            }}
          >
            <Text
              style={{ color: attendance === "leave" ? "#fff" : "#eed500" }}
            >
              L
            </Text>
          </TouchableOpacity>
        </View>
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

export default AttendanceCalendar;
