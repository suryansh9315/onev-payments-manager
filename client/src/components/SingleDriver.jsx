import { Icon, Switch, SpeedDial, Dialog } from "@rneui/themed";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";
import { sessionToken } from "../atoms/User";
import { API_URL } from "@env";
import Loader from "./Loader";
import DocsCarousel from "./DocsCarousel";
import AttendanceCalendar from "./AttendanceCalendar";

const SingleDriver = ({ route, navigation }) => {
  const { driver, logout } = route.params;
  const { top } = useSafeAreaInsets();
  const token = useRecoilValue(sessionToken);
  const [loading, setLoading] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(
    driver.status === "Active" ? true : false
  );
  const imageLinks = [
    { url: driver?.aadharFront, label: "Aadhar Front" },
    { url: driver?.aadharBack, label: "Aadhar Back" },
    { url: driver?.panFront, label: "Pan Front" },
    { url: driver?.rcFront, label: "RC Front" },
    { url: driver?.rcFront, label: "RC Back" },
    { url: driver?.dlFront, label: "DL Front" },
    { url: driver?.dlBack, label: "DL Back" },
    { url: driver?.insurance, label: "Insurance" },
  ];
  const [open, setOpen] = useState(false);
  const [cashVisible, setCashVisible] = useState(false);
  const [cash, setCash] = useState(0);
  const [cashError, setCashError] = useState("");
  const [cashErrorStatus, setCashErrorStatus] = useState(false);
  const [rentVisible, setRentVisible] = useState(false);
  const [rent, setRent] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDriverStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/updateDriverStatus`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id: driver._id,
          currentStatus: driver.status,
        }),
      });
      const json = await response.json();
      alert(`${json.message}`);
      if (response.status === 200) {
        driver.status = driver.status === "Inactive" ? "Active" : "Inactive";
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

  const updateRent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/updateRent`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id: driver._id,
          newRent: rent,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        driver.rent = rent;
      }
      alert(`${json.message}`);
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
      setRentVisible(!rentVisible);
      setRent(0);
    }
  };

  const handlePaymentUpdate = async () => {
    if (driver.status === "Inactive") {
      setCashErrorStatus(true);
      setCashError("Driver Inactive.");
      return;
    }
    if (cash < 500) {
      setCashErrorStatus(true);
      setCashError("Cash Deposits of less than 500 are not allowed.");
      return;
    }
    setLoading(true);
    setCashErrorStatus(false);
    try {
      const response = await fetch(`${API_URL}/api/orders/createCashOrder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          driver_id: driver._id,
          amount: cash,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        driver.balance += cash;
        driver.Paid += cash;
      }
      alert(`${json.message}`);
      if (response.status === 400) {
        logout();
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
      setCashVisible(!cashVisible);
      setCash(0);
      setCashError("");
      setCashErrorStatus(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
          <View
            style={{
              backgroundColor: "#005EFF",
              width: "100%",
              height: 150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                height: 118,
                width: 118,
                borderRadius: 60,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: -45,
                elevation: 3,
              }}
            >
              <Image
                source={{ uri: driver?.profilePic?.url }}
                style={{
                  height: 110,
                  width: 110,
                  borderRadius: 55,
                }}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "500",
              textAlign: "center",
              marginTop: 50,
              marginBottom: 10,
            }}
          >
            {driver?.name}
          </Text>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text
              style={{
                fontWeight: "200",
                fontSize: 16,
                marginBottom: 10,
                paddingHorizontal: 5,
              }}
            >
              BASIC INFO
            </Text>
            <View
              style={{
                paddingBottom: 15,
                paddingTop: 25,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="call"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>Phone</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.dNumber}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="mail"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>Mail</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.dEmail}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Status :
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: driver.status === "Active" ? "#4aaf4f" : "#f44336",
                    }}
                  >
                    {switchStatus ? "Active" : "inactive"}
                  </Text>
                </View>
                <Switch
                  value={switchStatus}
                  onValueChange={(value) => {
                    setSwitchStatus(value);
                    handleDriverStatus();
                  }}
                  thumbColor={"#005EFF"}
                  style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                  trackColor={{ false: "#fccac6", true: "#9bd59e" }}
                />
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text
              style={{
                fontWeight: "200",
                fontSize: 16,
                marginBottom: 10,
                paddingHorizontal: 5,
              }}
            >
              VEHICLE INFO
            </Text>
            <View
              style={{
                paddingBottom: 20,
                paddingTop: 20,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="creditcard"
                    type="antdesign"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Vehicle Number
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.vNumber}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="car"
                    type="antdesign"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Vehicle Model
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.vModel}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="rupee"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Vehicle Rent
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  &#8377; {driver?.rent}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text
              style={{
                fontWeight: "200",
                fontSize: 16,
                marginBottom: 10,
                paddingHorizontal: 5,
              }}
            >
              PAYMENT INFO
            </Text>
            <View
              style={{
                paddingBottom: 20,
                paddingTop: 20,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="bank"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Account Number
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.accountNumber}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="bank"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Account IFSC
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.accountIFSC}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="balance-scale"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Balance
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  &#8377; {driver?.balance}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="rupee"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>Paid</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  &#8377; {driver?.Paid}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text
              style={{
                fontWeight: "200",
                fontSize: 16,
                marginBottom: 10,
                paddingHorizontal: 5,
              }}
            >
              MORE INFO
            </Text>
            <View
              style={{
                paddingBottom: 20,
                paddingTop: 20,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="user-o"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Admin Name
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.admin_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="user-o"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Admin Number
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {driver?.admin_number}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="calendar-o"
                    type="font-awesome"
                    color="#000"
                    size={15}
                    style={{ width: 20 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Joining Date
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {new Date(driver?.date)
                    .toString()
                    ?.split(" ")
                    ?.slice(1, 4)
                    ?.join(" ")}
                </Text>
              </View>
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
              DOCUMENTS
            </Text>
            <View
              style={{
                paddingBottom: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
                gap: 10,
              }}
            >
              <DocsCarousel docs={imageLinks} />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              marginBottom: 50,
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
              ATTENDANCE
            </Text>
            <View
              style={{
                paddingBottom: 30,
                paddingTop: 10,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
                borderRadius: 5,
                elevation: 1,
              }}
            >
              <AttendanceCalendar
                driver={driver}
                logout={logout}
                value={currentDate}
                onChange={setCurrentDate}
              />
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              backgroundColor: "#fff",
              borderRadius: 50,
              elevation: 5,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrow-back"
                type="ionicon"
                size={24}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <SpeedDial
        isOpen={open}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        color="#005EFF"
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add Cash"
          onPress={() => {
            setOpen(false);
            setCashVisible(true);
          }}
          color="#005EFF"
        />
        <SpeedDial.Action
          icon={{ name: "update", color: "#fff" }}
          title="Update Rent"
          color="#005EFF"
          onPress={() => {
            setOpen(false);
            setRentVisible(true);
          }}
        />
      </SpeedDial>
      <Dialog
        isVisible={cashVisible}
        onBackdropPress={() => {
          setCashErrorStatus(false);
          setCash(0);
          setCashError("");
          setCashVisible(!cashVisible);
        }}
      >
        <View style={{ backgroundColor: "#fff", gap: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Add Cash</Text>
          <TextInput
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 5,
              backgroundColor: "#f6f6f6",
              fontSize: 14,
              elevation: 1,
            }}
            placeholderTextColor={"#5f5f5f"}
            value={cash}
            onChangeText={(e) => setCash(+e)}
            placeholder="Type Amount to Add"
            keyboardType="number-pad"
          />
          {cashErrorStatus && (
            <View style={{ position: "relative", top: -10, left: 5 }}>
              <Text style={{ fontSize: 12, color: "red" }}>* {cashError}</Text>
            </View>
          )}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#005EFF",
                borderRadius: 5,
                width: "50%",
              }}
              onPress={handlePaymentUpdate}
            >
              <Text
                style={{
                  backgroundColor: "#005EFF",
                  color: "#fff",
                  textAlign: "center",
                  paddingVertical: 12,
                  fontSize: 12,
                  borderRadius: 5,
                }}
              >
                Add Cash
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
      <Dialog
        isVisible={rentVisible}
        onBackdropPress={() => {
          setRent(0);
          setRentVisible(!rentVisible);
        }}
      >
        <View style={{ backgroundColor: "#fff", gap: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Update Rent</Text>
          <TextInput
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 5,
              backgroundColor: "#f6f6f6",
              fontSize: 14,
              elevation: 1,
            }}
            placeholderTextColor={"#5f5f5f"}
            value={rent}
            onChangeText={(e) => setRent(+e)}
            placeholder="Type New Rent"
            keyboardType="number-pad"
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#005EFF",
                borderRadius: 5,
                width: "50%",
              }}
              onPress={updateRent}
            >
              <Text
                style={{
                  backgroundColor: "#005EFF",
                  color: "#fff",
                  textAlign: "center",
                  paddingVertical: 12,
                  fontSize: 12,
                  borderRadius: 5,
                }}
              >
                Update Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

export default SingleDriver;
