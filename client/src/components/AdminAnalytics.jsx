import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Icon, SpeedDial } from "@rneui/themed";
import BasicCalendar from "./BasicCalendar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import Select from "./Select";
import { API_URL } from "@env";
import { useRecoilState } from "recoil";
import { admin, number, sessionToken, user } from "../atoms/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc, eachDayOfInterval } from "date-fns";

const AdminAnalytics = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const [speedDial, setSpeedDial] = useState(false);

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem("user_info");
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    deleteData();
    setToken(null);
    setIsAdmin(false);
    setPhone(null);
    setUser(null);
  };

  const fetchAllDrivers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/getAllDrivers`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const json = await response.json();
      if (response.status === 400) {
        alert(`${json.message}`);
        logout();
        return;
      }
      const rawDrivers = json.docs;
      rawDrivers?.sort((a, b) => a.balance - b.balance);
      setDrivers(rawDrivers);
      setFilteredDrivers(rawDrivers);
    } catch (error) {
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const downloadFinancialReport = async () => {
    if (compareAsc(endDate, startDate) < 0) {
      alert("Choose correct start and end date.");
      return;
    }
    try {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const temp_row = [];
      for (const date of days) {
        for (const driver of drivers) {
          const temp_obj = {};
          const date_string =
            date.getDate() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getFullYear();
          temp_obj["Date"] = date_string;
          temp_obj["Driver Name"] = driver.name;
          temp_obj["Driver Number"] = driver.dNumber;
          temp_obj["Vehicle Number"] = driver.vNumber;
          temp_obj["Hub Location"] = driver.hub;
          temp_obj["Vehicle Rent"] = driver.rent;
          const financial_string = await getFinance(date_string, driver._id);
          temp_obj["Total Collection"] = financial_string.total;
          temp_obj["Cash Collection"] = financial_string.cash;
          temp_obj["Online Collection"] = financial_string.online;
          temp_obj["Balance"] = driver.balance;
          temp_row.push(temp_obj);
        }
      }
      const ws = XLSX.utils.json_to_sheet(temp_row);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Finance");
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });
      const uri = FileSystem.cacheDirectory + "Financial.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "MyWater data",
        UTI: "com.microsoft.excel.xlsx",
      });
    } catch (error) {
      console.log(error);
      alert("Somethng went wrong...");
    }
  };

  const downloadAttendanceReport = async () => {
    if (compareAsc(endDate, startDate) < 1) {
      alert("Choose correct start and end date.");
      return;
    }
    try {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const temp_row = [];
      for (const driver of drivers) {
        const temp_obj = {};
        temp_obj["driver_name"] = driver.name;
        temp_obj["driver_number"] = driver.dNumber;
        for (const date of days) {
          const date_string =
            date.getDate() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getFullYear();
          const attendance_string = await getAttendance(
            date_string,
            driver._id
          );
          temp_obj[date_string] = attendance_string;
        }
        temp_row.push(temp_obj);
      }
      const ws = XLSX.utils.json_to_sheet(temp_row);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });
      const uri = FileSystem.cacheDirectory + "Attendance.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "MyWater data",
        UTI: "com.microsoft.excel.xlsx",
      });
    } catch (error) {
      console.log(error);
      alert("Somethng went wrong...");
    }
  };

  const getAttendance = async (date, driver_id) => {
    try {
      const response = await fetch(`${API_URL}/api/attendance/getAttendance`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id,
          date,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        return json.attendance;
      }
      if (response.status === 401) {
        return "N/A";
      }
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      return "N/A";
    }
  };

  const getFinance = async (date, driver_id) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/getDateFinance`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id,
          date,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        return json.amount;
      }
      if (response.status === 401) {
        return "N/A";
      }
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      return "N/A";
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchAllDrivers();
    }
  }, [isFocused, reload]);

  return (
    <SafeAreaView>
      <ScrollView nestedScrollEnabled={true}>
        <View
          style={{
            marginHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon
              name="menu-unfold"
              type="antdesign"
              size={32}
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "400" }}>Analytics</Text>
          <View style={{ opacity: 0 }}>
            <Icon
              name="menu-unfold"
              type="antdesign"
              size={32}
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "200",
              fontSize: 16,
              marginBottom: 10,
              paddingHorizontal: 5,
            }}
          >
            START DATE
          </Text>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderRadius: 5,
              elevation: 1,
            }}
          >
            <BasicCalendar value={startDate} onChange={setStartDate} />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontWeight: "200",
              fontSize: 16,
              marginBottom: 10,
              paddingHorizontal: 5,
            }}
          >
            END DATE
          </Text>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderRadius: 5,
              elevation: 1,
            }}
          >
            <BasicCalendar value={endDate} onChange={setEndDate} />
          </View>
        </View>
        {/* <View
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "200",
              fontSize: 16,
              marginBottom: 10,
              paddingHorizontal: 5,
            }}
          >
            SELECT DRIVERS
          </Text>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderRadius: 5,
              elevation: 1,
            }}
          >
            <Select
              list={filteredDrivers}
              setList={setFilteredDrivers}
              originalList={drivers}
            />
          </View>
        </View> */}
      </ScrollView>
      <SpeedDial
        isOpen={speedDial}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setSpeedDial(!speedDial)}
        onClose={() => setSpeedDial(!speedDial)}
        color="#005EFF"
      >
        <SpeedDial.Action
          icon={{ name: "credit-card", color: "#fff" }}
          title="Download Financial Report"
          onPress={() => {
            setSpeedDial(false);
            downloadFinancialReport();
          }}
          color="#005EFF"
        />
        <SpeedDial.Action
          icon={{ name: "update", color: "#fff" }}
          title="Download Attendance Report"
          color="#005EFF"
          onPress={() => {
            setSpeedDial(false);
            downloadAttendanceReport();
          }}
        />
      </SpeedDial>
    </SafeAreaView>
  );
};

export default AdminAnalytics;
