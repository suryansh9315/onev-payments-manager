import { Text, TouchableOpacity, View } from "react-native";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
  sub,
} from "date-fns";
import { API_URL } from "@env";
import Cell from "./Cell";
import { SelectList } from "react-native-dropdown-select-list";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const data = [
  { key: "Piaggio Ev 3W", value: "Piaggio Ev 3W" },
  { key: "Euler Ev 3W", value: "Euler Ev 3W" },
  { key: "OSM Log9 Ev 3W", value: "OSM Log9 Ev 3W" },
  { key: "Tata Ace Ev 4W", value: "Tata Ace Ev 4W" },
  { key: "Altigreen Ev 3W", value: "Altigreen Ev 3W" },
];

const DriverAttendanceCalendar = ({ driver, logout, value, onChange }) => {
  const token = useRecoilValue(sessionToken);
  const [loading, setLoading] = useState(false);
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
      const response = await fetch(
        `${API_URL}/api/attendance/getDriverAttendance`,
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
          }),
        }
      );
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

  useEffect(() => {
    getAttendance();
  }, [value]);

  return (
    <View>
      <View style={{ gap: 20, marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "300" }}>
          {value.toDateString()}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 20,
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
          >
            <Text
              style={{ color: attendance === "leave" ? "#fff" : "#eed500" }}
            >
              L
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DriverAttendanceCalendar;
