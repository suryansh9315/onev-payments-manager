import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { admin, number, sessionToken, user } from "../atoms/User";
import { useRecoilState } from "recoil";
import Loader from "../components/Loader";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import DriverAccordion from "../components/DriverAccordion";
import { Icon, Input } from "@rneui/themed";
import FilterAccordion from "../components/FilterAccordion";
import SortAccordion from "../components/SortAccordion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import DriverListItem from "../components/DriverListItem";

console.log(API_URL?.substring(0, 0));

const DriversScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigation = useNavigation();

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

  const handleSearch = () => {
    if (searchInput.length === 0) {
      return setFilteredDrivers(drivers);
    }
    setFilteredDrivers(
      drivers.filter(
        (driver) =>
          driver?.name.includes(searchInput) ||
          driver?.dNumber.includes(searchInput)
      )
    );
  };

  const downloadExcel = async () => {
    try {
      const drivers_list = [];
      for (const driver of drivers) {
        drivers_list.push({
          name: driver.name,
          number: driver.dNumber,
          balance: driver.balance,
          vehicle_number: driver.vNumber,
          vehicle_model: driver.vModel,
          rent: driver.rent,
          status: driver.status,
        });
      }
      const ws = XLSX.utils.json_to_sheet(drivers_list);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Drivers");
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });
      const uri = FileSystem.cacheDirectory + "drivers.xlsx";
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

  useEffect(() => {
    if (isFocused) {
      fetchAllDrivers();
    }
  }, [isFocused, reload]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, zIndex: 1000 }}>
        <View
          style={{
            paddingVertical: 20,
            marginBottom: 20,
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
          <Text style={{ fontSize: 22, fontWeight: "400" }}>Drivers</Text>
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
            marginBottom: 20,
          }}
        >
          <Input
            value={searchInput}
            onChangeText={(e) => setSearchInput(e)}
            placeholder="Search"
            leftIcon={
              <Icon name="search1" type="antdesign" size={24} color="gray" />
            }
            rightIcon={
              <TouchableOpacity onPress={downloadExcel}>
                <MaterialCommunityIcons
                  name="microsoft-excel"
                  size={28}
                  color="#3a3a3a"
                />
              </TouchableOpacity>
            }
            onEndEditing={handleSearch}
            leftIconContainerStyle={{ marginRight: 10 }}
            errorStyle={{ display: "none" }}
            inputContainerStyle={{
              paddingLeft: 15,
              paddingRight: 10,
              paddingVertical: 4,
              backgroundColor: "#fff",
              borderRadius: 10,
              elevation: 1,
              borderWidth: 1,
              borderColor: "#fff",
            }}
            inputStyle={{ fontSize: 16, backgroundColor: "#fff" }}
          />
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <FilterAccordion />
            <SortAccordion />
          </View>
        </View> */}
      </View>
      <View
        style={{
          zIndex: -1000,
          gap: 5,
          paddingHorizontal: 15,
          paddingBottom: 180,
        }}
      >
        <FlatList
          data={filteredDrivers}
          renderItem={({ item }) => (
            <>
              <DriverListItem item={item} logout={logout} />
            </>
          )}
          keyExtractor={(item) => item.dNumber}
          scrollEnabled
        />
      </View>
    </SafeAreaView>
  );
};

export default DriversScreen;
