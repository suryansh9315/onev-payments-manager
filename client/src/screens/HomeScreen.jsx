import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { sessionToken, admin, number, user } from "../atoms/User";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const [user_info, setUser] = useRecoilState(user);
  console.log(user_info)

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>HomeScreen</Text>
      <Text>{phone}</Text>
      <Text onPress={logout}>Logout</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
