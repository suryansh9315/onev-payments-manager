import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { admin, number, sessionToken, user } from "../atoms/User";
import { useRecoilState } from "recoil";
import Loader from "../components/Loader";
import { useIsFocused } from "@react-navigation/native";
import DriverAccordion from "../components/DriverAccordion";
import { Icon, Input } from "@rneui/themed";
import FilterAccordion from "../components/FilterAccordion";
import SortAccordion from "../components/SortAccordion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

console.log(API_URL.substring(0, 0));

const DriversScreen = () => {
  const isFocused = useIsFocused();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [searchInput, setSearchInput] = useState("");

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
      setDrivers(json.docs);
      setFilteredDrivers(json.docs);
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
      <View style={{ paddingHorizontal: 20, paddingTop: 30, zIndex: 1000 }}>
        <View style={{ marginBottom: 20 }}>
          <Input
            value={searchInput}
            onChangeText={(e) => setSearchInput(e)}
            placeholder="Search"
            leftIcon={
              <Icon name="search1" type="antdesign" size={24} color="gray" />
            }
            onEndEditing={handleSearch}
            leftIconContainerStyle={{ marginRight: 10 }}
            errorStyle={{ display: "none" }}
            inputContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 4,
              backgroundColor: "#fff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ffffff",
            }}
            inputStyle={{ fontSize: 16, backgroundColor: "#fff" }}
          />
        </View>
        <View
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
        </View>
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
              <DriverAccordion
                driver={item}
                logout={logout}
                setReload={setReload}
                reload={reload}
              />
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

const styles = StyleSheet.create({});
