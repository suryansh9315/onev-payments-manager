import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { sessionToken, admin, number, user } from "../atoms/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loader from "../components/Loader";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import LottieView from "lottie-react-native";

console.log(API_URL?.substring(0, 0));
const data = [
  { key: "Piaggio Ev 3W", value: "Piaggio Ev 3W" },
  { key: "Euler Ev 3W", value: "Euler Ev 3W" },
  { key: "OSM Log9 Ev 3W", value: "OSM Log9 Ev 3W" },
  { key: "Tata Ace Ev 4W", value: "Tata Ace Ev 4W" },
  { key: "Altigreem Ev 3W", value: "Altigreem Ev 3W" },
];

const CreateDriver = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const [name, setName] = useState("");
  const [dNumber, setDNumber] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [vNumber, setVNumber] = useState("");
  const [vModel, setVModel] = useState("");
  const [rent, setRent] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [dLFront, setDLFront] = useState(null);
  const [dLBack, setDLBack] = useState(null);
  const [rCFront, setRCFront] = useState(null);
  const [rCBack, setRCBack] = useState(null);
  const navigation = useNavigation();
  const profileAnimationRef = useRef(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 0.4,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, type: "image" });
    }
  };

  const pickDocument = async (setDoc) => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type: "application/pdf",
    });
    if (result.type !== "cancel") {
      setDoc({ uri: result.uri, type: "pdf" });
    }
  };

  const pickImageCamera = async (setImage) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 0.2,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, type: "image" });
    }
  };

  const uploadImageAsync = async (image, ref) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    await uploadBytes(ref, blob);
    blob.close();
    return await getDownloadURL(ref);
  };

  const handleSubmit = async () => {
    if (
      !profilePic ||
      !aadharFront ||
      !aadharBack ||
      !dLFront ||
      !dLBack ||
      !rCFront ||
      !rCBack ||
      !dNumber ||
      !dEmail ||
      !name ||
      !vNumber ||
      !vModel ||
      !rent
    ) {
      return alert("Upload all Images...");
    }
    try {
      setLoading(true);
      const isTokenValid = await fetch(`${API_URL}/api/auth/getDriver`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          dNumber: "+91" + dNumber,
        }),
      });
      const jsonn = await isTokenValid.json();
      if (isTokenValid.status === 400) {
        setProfilePic(null);
        setAadharFront(null);
        setAadharBack(null);
        setDLFront(null);
        setDLBack(null);
        setRCFront(null);
        setRCBack(null);
        setName("");
        setDNumber("");
        setDEmail("");
        setVModel("");
        setVNumber("");
        setRent("");
        alert(`${jsonn.message}`);
        logout();
        setLoading(false);
        return;
      }
      if (isTokenValid.status === 401) {
        setProfilePic(null);
        setAadharFront(null);
        setAadharBack(null);
        setDLFront(null);
        setDLBack(null);
        setRCFront(null);
        setRCBack(null);
        setName("");
        setDNumber("");
        setDEmail("");
        setVModel("");
        setVNumber("");
        setRent("");
        alert(`${jsonn.message}`);
        setLoading(false);
        return;
      }
      const profilePicRef = ref(storage, `drivers/${dNumber}/profilePic`);
      const aadharFrontRef = ref(storage, `drivers/${dNumber}/aadharFront`);
      const aadharBackRef = ref(storage, `drivers/${dNumber}/aadharBack`);
      const dlFrontRef = ref(storage, `drivers/${dNumber}/dlFront`);
      const dlBackRef = ref(storage, `drivers/${dNumber}/dlBack`);
      const rcFrontRef = ref(storage, `drivers/${dNumber}/rcFront`);
      const rcBackRef = ref(storage, `drivers/${dNumber}/rcBack`);
      const profilePicURL = await uploadImageAsync(
        profilePic.uri,
        profilePicRef
      );
      const aadharFrontURL = await uploadImageAsync(
        aadharFront.uri,
        aadharFrontRef
      );
      const aadharBackURL = await uploadImageAsync(
        aadharBack.uri,
        aadharBackRef
      );
      const dlFrontURL = await uploadImageAsync(dLFront.uri, dlFrontRef);
      const dlBackURL = await uploadImageAsync(dLBack.uri, dlBackRef);
      const rcFrontURL = await uploadImageAsync(rCFront.uri, rcFrontRef);
      const rcBackURL = await uploadImageAsync(rCBack.uri, rcBackRef);
      const driver_obj = {
        name,
        profilePic: { url: profilePicURL, type: profilePic.type },
        aadharFront: { url: aadharFrontURL, type: aadharFront.type },
        aadharBack: { url: aadharBackURL, type: aadharBack.type },
        rcFront: { url: rcFrontURL, type: rCFront.type },
        rcBack: { url: rcBackURL, type: rCBack.type },
        dlFront: { url: dlFrontURL, type: dLFront.type },
        dlBack: { url: dlBackURL, type: dLBack.type },
        dNumber: "+91 " + dNumber,
        dEmail,
        vNumber: vNumber.toUpperCase(),
        vModel,
        rent: +rent,
        status: "Active"
      };
      const response = await fetch(`${API_URL}/api/auth/createDriver`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver_obj,
          token,
        }),
      });
      const json = await response.json();
      if (response.status === 400) {
        setLoading(false);
        return alert(`${json.message}`);
      }
      alert(`${json.message}`);
      setProfilePic(null);
      setAadharFront(null);
      setAadharBack(null);
      setDLFront(null);
      setDLBack(null);
      setRCFront(null);
      setRCBack(null);
      setName("");
      setDNumber("");
      setDEmail("");
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

  useEffect(() => {
    profileAnimationRef.current?.play();
    return () => {
      profileAnimationRef.current?.reset();
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.containerWrapper}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 20,
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
            <Text style={{ fontSize: 22, fontWeight: "400" }}>
              Create Driver
            </Text>
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
          <View style={styles.inputContainer}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => pickImageCamera(setProfilePic)}>
                {!profilePic ? (
                  <LottieView
                    ref={profileAnimationRef}
                    style={{
                      width: 180,
                      height: 180,
                    }}
                    resizeMode="cover"
                    source={require("../animations/profile.json")}
                  />
                ) : (
                  <Image
                    source={{ uri: profilePic.uri }}
                    style={{ height: 180, width: 180, borderRadius: 90 }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Input
              value={name}
              onChangeText={(e) => setName(e)}
              placeholder="Parth Yadav"
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
                borderRadius: 10,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="XY88 XY8888"
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
                borderRadius: 10,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: "#000",
                  marginBottom: 5,
                  fontSize: 14,
                }}
              >
                Vehicle Model
              </Text>
              <SelectList
                setSelected={(val) => setVModel(val)}
                data={data}
                save="value"
                boxStyles={{}}
                inputStyles={{ fontSize: 16 }}
                search={false}
                defaultOption={{ key: "Piaggio Ev 3W", value: "Piaggio Ev 3W" }}
              />
            </View>
            <Input
              placeholder="931XXXX594"
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
                borderRadius: 10,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="test@gmail.com"
              value={dEmail}
              onChangeText={(e) => setDEmail(e)}
              errorStyle={{ display: "none" }}
              label="Driver Email"
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
                borderRadius: 10,
              }}
              inputStyle={{ fontSize: 16 }}
            />
            <Input
              placeholder="&#8377; 800"
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
                borderRadius: 10,
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setAadharFront)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: aadharFront ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setAadharBack)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: aadharBack ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setDLFront)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: dLFront ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setDLBack)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: dLBack ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setRCFront)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: rCFront ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
                  <View style={{ flexDirection: "row", gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => pickDocument(setRCBack)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
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
                  borderColor: rCBack ? "#07db00" : "#ff0000",
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
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
    backgroundColor: "#fff",
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
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    borderRadius: 10,
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
