import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { sessionToken, admin, number, user } from "../atoms/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Loader from "../components/Loader";

const CreateDriver = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const [name, setName] = useState("");
  const [dNumber, setDNumber] = useState("");
  const [vNumber, setVNumber] = useState("");
  const [vModel, setVModel] = useState("");
  const [rent, setRent] = useState("");
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [dLFront, setDLFront] = useState(null);
  const [dLBack, setDLBack] = useState(null);
  const [rCFront, setRCFront] = useState(null);
  const [rCBack, setRCBack] = useState(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].base64);
    }
  };

  const pickImageCamera = async (setImage) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].base64);
    }
  };

  const handleSubmit = async () => {
    if (
      !aadharFront ||
      !aadharBack ||
      !dLFront ||
      !dLBack ||
      !rCFront ||
      !rCBack ||
      !dNumber ||
      !name ||
      !vNumber ||
      !vModel ||
      !rent
    ) {
      return alert("Upload all Images...");
    }
    try {
      setLoading(true);
      const isTokenValid = await fetch(
        `http://192.168.1.9:5000/api/auth/getDriver`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            dNumber: "+91" + dNumber,
          }),
        }
      );
      const jsonn = await isTokenValid.json();
      if (isTokenValid.status === 400) {
        setAadharFront(null);
        setAadharBack(null);
        setDLFront(null);
        setDLBack(null);
        setRCFront(null);
        setRCBack(null);
        setName("");
        setDNumber("");
        setVModel("");
        setVNumber("");
        setRent("");
        alert(`${jsonn.message}`);
        logout();
        setLoading(false);
        return;
      }
      if (isTokenValid.status === 401) {
        setAadharFront(null);
        setAadharBack(null);
        setDLFront(null);
        setDLBack(null);
        setRCFront(null);
        setRCBack(null);
        setName("");
        setDNumber("");
        setVModel("");
        setVNumber("");
        setRent("");
        alert(`${jsonn.message}`);
        setLoading(false);
        return;
      }
      const aadharFrontRef = ref(storage, `drivers/${dNumber}/aadharFront`);
      const aadharBackRef = ref(storage, `drivers/${dNumber}/aadharBack`);
      const dlFrontRef = ref(storage, `drivers/${dNumber}/dlFront`);
      const dlBackRef = ref(storage, `drivers/${dNumber}/dlBack`);
      const rcFrontRef = ref(storage, `drivers/${dNumber}/rcFront`);
      const rcBackRef = ref(storage, `drivers/${dNumber}/rcBack`);
      await uploadString(aadharFrontRef, aadharFront, "base64");
      await uploadString(aadharBackRef, aadharBack, "base64");
      await uploadString(dlFrontRef, dLFront, "base64");
      await uploadString(dlBackRef, dLBack, "base64");
      await uploadString(rcFrontRef, rCFront, "base64");
      await uploadString(rcBackRef, rCBack, "base64");
      const aadharFrontURL = await getDownloadURL(aadharFrontRef);
      const aadharBackURL = await getDownloadURL(aadharBackRef);
      const dlFrontURL = await getDownloadURL(dlFrontRef);
      const dlBackURL = await getDownloadURL(dlBackRef);
      const rcFrontURL = await getDownloadURL(rcFrontRef);
      const rcBackURL = await getDownloadURL(rcBackRef);
      const driver_obj = {
        name,
        aadharFrontURL,
        aadharBackURL,
        rcFrontURL,
        rcBackURL,
        dlFrontURL,
        dlBackURL,
        dNumber: "+91 " + dNumber,
        vNumber,
        vModel,
        rent,
      };
      const response = await fetch(
        `http://192.168.1.9:5000/api/auth/createDriver`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_obj,
            token,
          }),
        }
      );
      const json = await response.json();
      console.log(json);
      if (response.status === 400) {
        setLoading(false);
        return alert(`${json.message}`);
      }
      alert(`${json.message}`);
      setAadharFront(null);
      setAadharBack(null);
      setDLFront(null);
      setDLBack(null);
      setRCFront(null);
      setRCBack(null);
      setName("");
      setDNumber("");
      setVModel("");
      setVNumber("");
      setRent("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Something Went Wrong...");
    }
  };

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

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.containerWrapper}>
          <View style={styles.profileContainer}>
            <View>
              <Text style={{ fontSize: 22 }}>{userr?.name}</Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                {userr?.number}
              </Text>
            </View>
            <TouchableOpacity onPress={logout}>
              <Image
                source={require("../../assets/Profile.png")}
                style={{ height: 70, width: 70 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>Add New Driver</Text>
          <View style={styles.inputContainer}>
            <Input
              value={name}
              onChangeText={(e) => setName(e)}
              placeholder="Elon Musk"
              label="Name"
              labelStyle={{
                color: "#000",
                fontWeight: "100",
                marginBottom: 5,
                fontSize: 14,
              }}
              errorStyle={{ display: "none" }}
              inputContainerStyle={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="DL 7CN 7222"
              value={vNumber}
              onChangeText={(e) => setVNumber(e)}
              label="Vehicle Number"
              errorStyle={{ display: "none" }}
              labelStyle={{
                color: "#000",
                fontWeight: "100",
                marginBottom: 5,
                fontSize: 14,
              }}
              inputContainerStyle={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="i10 Sports"
              value={vModel}
              onChangeText={(e) => setVModel(e)}
              errorStyle={{ display: "none" }}
              label="Vehicle Model"
              labelStyle={{
                color: "#000",
                fontWeight: "100",
                marginBottom: 5,
                fontSize: 14,
              }}
              inputContainerStyle={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="9315566594"
              value={dNumber}
              onChangeText={(e) => setDNumber(e)}
              keyboardType="numeric"
              errorStyle={{ display: "none" }}
              label="Driver Number"
              labelStyle={{
                color: "#000",
                fontWeight: "100",
                marginBottom: 5,
                fontSize: 14,
              }}
              inputContainerStyle={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="$ 800"
              value={rent}
              onChangeText={(e) => setRent(e)}
              errorStyle={{ display: "none" }}
              keyboardType="numeric"
              label="Rent"
              labelStyle={{
                color: "#000",
                fontWeight: "100",
                marginBottom: 5,
                fontSize: 14,
              }}
              inputContainerStyle={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <View style={{ flexDirection: "row" }}>
              <Input
                containerStyle={{
                  width: "50%",
                }}
                errorStyle={{ display: "none" }}
                editable={false}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setAadharFront)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setAadharFront)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                label="Aadhar Card"
                labelStyle={{
                  color: "#000",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                placeholder="Front"
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
              <Input
                label="."
                labelStyle={{
                  color: "#fff",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                errorStyle={{ display: "none" }}
                editable={false}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setAadharBack)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setAadharBack)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                placeholder="Back"
                containerStyle={{
                  width: "50%",
                }}
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Input
                containerStyle={{
                  width: "50%",
                }}
                errorStyle={{ display: "none" }}
                editable={false}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setDLFront)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setDLFront)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                label="Driving License"
                labelStyle={{
                  color: "#000",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                placeholder="Front"
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
              <Input
                label="."
                labelStyle={{
                  color: "#fff",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                errorStyle={{ display: "none" }}
                editable={false}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setDLBack)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setDLBack)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                placeholder="Back"
                containerStyle={{
                  width: "50%",
                }}
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Input
                containerStyle={{
                  width: "50%",
                }}
                editable={false}
                errorStyle={{ display: "none" }}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setRCFront)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setRCFront)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                label="RC"
                labelStyle={{
                  color: "#000",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                placeholder="Front"
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
              <Input
                label="."
                labelStyle={{
                  color: "#fff",
                  fontWeight: "100",
                  marginBottom: 5,
                  fontSize: 14,
                }}
                errorStyle={{ display: "none" }}
                editable={false}
                rightIcon={
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setRCBack)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setRCBack)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                }
                rightIconContainerStyle={{ margin: 0, padding: 0 }}
                placeholder="Back"
                containerStyle={{
                  width: "50%",
                }}
                inputContainerStyle={{
                  borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ width: "70%" }} onPress={handleSubmit}>
              <Text style={styles.button}>Add Driver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDriver;

const styles = StyleSheet.create({
  containerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "500",
    marginBottom: 15,
    marginTop: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 5,
  },
  inputContainer: {
    gap: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#3bbcc5",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 15,
    borderRadius: 3,
    fontSize: 16,
  },
});
