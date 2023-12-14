import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
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
import Profile_JSON from "../animations/profile_4.json";

console.log(API_URL?.substring(0, 0));
const data = [
  { key: "Piaggio Ev 3W", value: "Piaggio Ev 3W" },
  { key: "Euler Ev 3W", value: "Euler Ev 3W" },
  { key: "OSM Log9 Ev 3W", value: "OSM Log9 Ev 3W" },
  { key: "Tata Ace Ev 4W", value: "Tata Ace Ev 4W" },
  { key: "Altigreen Ev 3W", value: "Altigreen Ev 3W" },
];

const CreateDriver = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [userr, setUser] = useRecoilState(user);
  const [phone, setPhone] = useRecoilState(number);
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [dNumber, setDNumber] = useState("");
  const [dHub, setDHub] = useState("");
  const [dClient, setDClient] = useState("");
  const [dAdvance, setDAdvance] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [vNumber, setVNumber] = useState("");
  const [vModel, setVModel] = useState("");
  const [rent, setRent] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [panFront, setPanFront] = useState(null);
  const [vInsurance, setVInsurance] = useState(null);
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
    if (!profilePic) {
      return alert("Please Upload Profile Picture");
    }
    if (!name) {
      return alert("Please Enter Driver name");
    }
    if (!dNumber) {
      return alert("Please Enter Driver Number");
    }
    if (!dEmail) {
      return alert("Please Enter Driver Email");
    }
    if (!dClient) {
      return alert("Please Enter Client Name");
    }
    if (!dHub) {
      return alert("Please Enter Hub Location");
    }
    if (!dAdvance) {
      return alert("Please Enter Advance Payment");
    }
    if (!accountNumber) {
      return alert("Please Enter Driver Account Number");
    }
    if (!accountIFSC) {
      return alert("Please Enter Driver Account IFSC");
    }
    if (!vNumber) {
      return alert("Please Enter Vehicle Number");
    }
    if (!vModel) {
      return alert("Please Enter Vehicle Model");
    }
    if (!rent) {
      return alert("Please Enter Vehicle Rent");
    }
    if (!aadharFront) {
      return alert("Please Upload Aadhar Front");
    }
    if (!aadharBack) {
      return alert("Please Upload Aadhar Back");
    }
    if (!panFront) {
      return alert("Please Upload Pan Front");
    }
    if (!dLFront) {
      return alert("Please Upload DL Front");
    }
    if (!dLBack) {
      return alert("Please Upload DL Back");
    }
    if (!rCFront) {
      return alert("Please Upload RC Front");
    }
    if (!rCBack) {
      return alert("Please Upload RC Back");
    }
    if (!vInsurance) {
      return alert("Please Upload Vehicle Insurance");
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
        setVInsurance(null);
        setPanFront(null);
        setAccountIFSC("");
        setAccountNumber("");
        setName("");
        setDNumber("");
        setDEmail("");
        setDAdvance("")
        setDClient("")
        setDHub("")
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
        setVInsurance(null);
        setPanFront(null);
        setAccountIFSC("");
        setAccountNumber("");
        setName("");
        setDNumber("");
        setDEmail("");
        setDAdvance("")
        setDClient("")
        setDHub("")
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
      const panFrontRef = ref(storage, `drivers/${dNumber}/panFront`);
      const insuranceRef = ref(storage, `drivers/${dNumber}/insurance`);
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
      const panFrontURL = await uploadImageAsync(panFront.uri, panFrontRef);
      const insuranceURL = await uploadImageAsync(vInsurance.uri, insuranceRef);
      const driver_obj = {
        name,
        profilePic: { url: profilePicURL, type: profilePic.type },
        aadharFront: { url: aadharFrontURL, type: aadharFront.type },
        aadharBack: { url: aadharBackURL, type: aadharBack.type },
        rcFront: { url: rcFrontURL, type: rCFront.type },
        rcBack: { url: rcBackURL, type: rCBack.type },
        dlFront: { url: dlFrontURL, type: dLFront.type },
        dlBack: { url: dlBackURL, type: dLBack.type },
        panFront: { url: panFrontURL, type: panFront.type },
        insurance: { url: insuranceURL, type: vInsurance.type },
        dNumber: "+91 " + dNumber,
        dEmail,
        advance: dAdvance,
        client: dClient,
        hub: dHub,
        vNumber: vNumber.toUpperCase(),
        vModel,
        rent: +rent,
        accountNumber,
        accountIFSC,
        status: "Inactive",
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
      setVInsurance(null);
      setPanFront(null);
      setAccountIFSC("");
      setAccountNumber("");
      setName("");
      setDNumber("");
      setDEmail("");
      setDAdvance("")
      setDClient("")
      setDHub("")
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
                {!profilePic?.uri ? (
                  <View
                    style={{
                      width: 200,
                      height: 200,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LottieView
                      autoPlay
                      ref={profileAnimationRef}
                      style={{
                        width: 180,
                        height: 180,
                      }}
                      resizeMode="cover"
                      source={Profile_JSON}
                    />
                  </View>
                ) : (
                  <Image
                    source={{ uri: profilePic.uri }}
                    style={{ height: 200, width: 200, borderRadius: 100 }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 26 }}>Personal Details</Text>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Name
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                value={name}
                onChangeText={(e) => setName(e)}
                placeholder="Parth Yadav"
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Driver Number
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="931XXXX594"
                value={dNumber}
                onChangeText={(e) => setDNumber(e)}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Driver Email
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="test@gmail.com"
                value={dEmail}
                onChangeText={(e) => setDEmail(e)}
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Hub Location
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="Mayur Vihar"
                value={dHub}
                onChangeText={(e) => setDHub(e)}
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Client Name
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="Parth Yadav"
                value={dClient}
                onChangeText={(e) => setDClient(e)}
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Advance Payment
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="10000"
                value={dAdvance}
                onChangeText={(e) => setDAdvance(e)}
              />
            </View>
            <Text style={{ fontSize: 26, marginTop: 20 }}>Account Details</Text>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Account Number
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="1266XXXXXXXX"
                value={accountNumber}
                onChangeText={(e) => setAccountNumber(e)}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Account IFSC Code
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="HDFC000XXXX"
                value={accountIFSC}
                onChangeText={(e) => setAccountIFSC(e)}
              />
            </View>
            <Text style={{ fontSize: 26, marginTop: 20 }}>Vehicle Details</Text>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Vehicle Number
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="XY88 XY8888"
                value={vNumber}
                onChangeText={(e) => setVNumber(e)}
              />
            </View>
            <View>
              <Text
                style={{
                  color: "#5f5f5f",
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
                boxStyles={{
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  borderWidth: 0,
                  elevation: 1,
                }}
                inputStyles={{ fontSize: 14 }}
                search={false}
                defaultOption={{ key: "Piaggio Ev 3W", value: "Piaggio Ev 3W" }}
                dropdownStyles={{
                  backgroundColor: "#F9F9F8",
                  borderWidth: 0,
                  elevation: 1,
                }}
              />
            </View>
            <View>
              <Text style={{ marginBottom: 5, fontSize: 14, color: "#5f5f5f" }}>
                Vehicle Rent
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: "#F9F9F8",
                  fontSize: 14,
                  elevation: 1,
                }}
                placeholderTextColor={"#5f5f5f"}
                placeholder="&#8377; 800"
                value={rent}
                onChangeText={(e) => setRent(e)}
                errorStyle={{ display: "none" }}
                keyboardType="numeric"
              />
            </View>
            <Text style={{ fontSize: 26, marginTop: 20 }}>
              Upload Documents
            </Text>
            <View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "#5f5f5f" }}>
                  Aadhar Card
                </Text>
                <View
                  style={{
                    display: aadharFront && aadharBack ? "flex" : "none",
                  }}
                >
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                </View>
                <View
                  style={{
                    display: aadharFront && aadharBack ? "none" : "flex",
                  }}
                >
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Front</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Back</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Pan Card</Text>
                <View
                  style={{
                    display: panFront ? "flex" : "none",
                  }}
                >
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                </View>
                <View
                  style={{
                    display: panFront ? "none" : "flex",
                  }}
                >
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "100%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Front</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => pickDocument(setPanFront)}>
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setPanFront)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setPanFront)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "#5f5f5f" }}>DL</Text>
                <View
                  style={{
                    display: dLFront && dLBack ? "flex" : "none",
                  }}
                >
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                </View>
                <View
                  style={{
                    display: dLFront && dLBack ? "none" : "flex",
                  }}
                >
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Front</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => pickDocument(setDLFront)}>
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
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Back</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => pickDocument(setDLBack)}>
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
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "#5f5f5f" }}>RC</Text>
                <View
                  style={{
                    display: rCFront && rCBack ? "flex" : "none",
                  }}
                >
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                </View>
                <View
                  style={{
                    display: rCFront && rCBack ? "none" : "flex",
                  }}
                >
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Front</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => pickDocument(setRCFront)}>
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
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "48%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Back</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => pickDocument(setRCBack)}>
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
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "#5f5f5f" }}>
                  Insurance
                </Text>
                <View
                  style={{
                    display: vInsurance ? "flex" : "none",
                  }}
                >
                  <Icon
                    name="checkcircle"
                    size={16}
                    color="green"
                    type="antdesign"
                  />
                </View>
                <View
                  style={{
                    display: vInsurance ? "none" : "flex",
                  }}
                >
                  <Icon
                    name="closecircle"
                    size={16}
                    color="red"
                    type="antdesign"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9F9F8",
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 5,
                    fontSize: 14,
                    elevation: 1,
                    width: "100%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#5f5f5f" }}>Front</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => pickDocument(setVInsurance)}
                    >
                      <Icon
                        name="documents-outline"
                        size={22}
                        color="gray"
                        type="ionicon"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => pickImageCamera(setVInsurance)}
                    >
                      <Icon
                        name="camerao"
                        size={22}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(setVInsurance)}>
                      <Icon
                        name="upload"
                        size={20}
                        color="gray"
                        type="antdesign"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ width: "100%" }} onPress={handleSubmit}>
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
    paddingHorizontal: 30,
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
    marginTop: 40,
  },
  button: {
    backgroundColor: "#005EFF",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 18,
    borderRadius: 5,
    fontSize: 16,
  },
});
