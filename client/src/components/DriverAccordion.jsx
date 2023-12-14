import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { ListItem, Icon, Input } from "@rneui/themed";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";
import { API_URL } from "@env";
import DriverDoc from "./DriverDoc";

console.log(API_URL?.substring(0, 0));

const DriverAccordion = ({ driver, logout, setReload, reload, setLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const [newRent, setNewRent] = useState(0);
  const token = useRecoilValue(sessionToken);
  const [cash, setCash] = useState("");
  const docsRef = useRef();
  const [docs, setDocs] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
          newRent,
        }),
      });
      const json = await response.json();
      alert(`${json.message}`);
      if (response.status === 400) {
        logout();
        return;
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (driver.status === "Inactive") return alert("Driver Inactive.");
    if (cash < 500) {
      return alert("Cash Deposits of less than 500 are not allowed.");
    }
    setLoading(true);
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
      alert(`${json.message}`);
      if (response.status === 400) {
        logout();
        return;
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

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
      if (response.status === 400) {
        logout();
        return;
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const showHideDocs = () => {
    if (docs) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setDocs(!docs);
      }, 200);
    } else {
      setDocs(!docs);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ListItem.Accordion
      bottomDivider
      containerStyle={{ borderRadius: 4 }}
      content={
        <>
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 18 }}>
              {driver?.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{ fontSize: 14, color: "gray" }}>
              {driver?.dNumber}
            </ListItem.Subtitle>
          </ListItem.Content>
          {driver?.balance >= 0 ? (
            <Icon type="antdesign" name="checkcircle" color="#4aaf4f" />
          ) : (
            <Icon type="antdesign" name="closecircle" color="#f44336" />
          )}
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          padding: 20,
          paddingBottom: 30,
          gap: 20,
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: 30,
            gap: 30,
          }}
        >
          <Image
            source={{ uri: driver?.profilePic.url }}
            style={{ height: 100, width: 100, borderRadius: 60 }}
          />
          <View>
            <Text style={{ fontSize: 18, maxWidth: 150 }}>{driver?.name}</Text>
            <Text style={{ fontSize: 14, color: "gray" }}>
              {driver?.dNumber}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Vehicle Number
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.vNumber}</Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Vehicle Model
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.vModel}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Rent
            </Text>
            <Text style={{ fontSize: 18 }}>&#8377; {driver?.rent}</Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Balance
            </Text>
            <Text style={{ fontSize: 18 }}>&#8377; {driver?.balance}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Client Name
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.client}</Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Hub Location
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.hub}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Admin Name
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.admin_name}</Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 140,
              height: 70,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10, color: "gray", marginBottom: 2 }}>
              Advance Payment
            </Text>
            <Text style={{ fontSize: 18 }}>{driver?.advance}</Text>
          </View>
        </View>
        <Animated.View
          style={{ display: docs ? "flex" : "none", opacity: fadeAnim }}
          ref={docsRef}
        >
          <DriverDoc item={driver} />
        </Animated.View>
        <View style={{ marginTop: 10 }}>
          <Input
            onChangeText={(e) => setCash(+e)}
            keyboardType="numeric"
            value={cash}
            placeholder="Enter Cash Amount"
            errorStyle={{ display: "none" }}
            inputContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              backgroundColor: "#fff",
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "#bbbbbb",
            }}
            inputStyle={{ fontSize: 16, backgroundColor: "#fff" }}
          />
        </View>
        <View style={{ marginTop: 0 }}>
          <Input
            onChangeText={(e) => setNewRent(+e)}
            keyboardType="numeric"
            value={newRent}
            placeholder="Enter New Rent"
            errorStyle={{ display: "none" }}
            inputContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              backgroundColor: "#fff",
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "#bbbbbb",
            }}
            inputStyle={{ fontSize: 16, backgroundColor: "#fff" }}
          />
        </View>
        <View style={{ gap: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{ width: 140 }}
              onPress={handlePaymentUpdate}
            >
              <Text
                style={{
                  backgroundColor: "#ffae00",
                  color: "#fff",
                  textAlign: "center",
                  paddingVertical: 10,
                  borderRadius: 4,
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 140 }}
              onPress={handleDriverStatus}
            >
              <Text
                style={{
                  backgroundColor:
                    driver?.status === "Active" ? "#4aaf4f" : "#f44336",
                  paddingVertical: 10,
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: 4,
                }}
              >
                {driver?.status}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <TouchableOpacity style={{ width: 140 }} onPress={showHideDocs}>
              <Text
                style={{
                  backgroundColor: "#0051C4",
                  color: "#fff",
                  textAlign: "center",
                  paddingVertical: 10,
                  borderRadius: 4,
                }}
              >
                {docs ? "Hide Docs" : "View Docs"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 140 }} onPress={updateRent}>
              <Text
                style={{
                  backgroundColor: "#2c2c2c",
                  paddingVertical: 10,
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: 4,
                }}
              >
                Update Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ListItem.Accordion>
  );
};

export default DriverAccordion;
