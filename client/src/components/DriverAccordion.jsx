import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ListItem, Icon } from "@rneui/themed";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";
import { API_URL } from '@env'

console.log(API_URL?.substring(0,0))

const DriverAccordion = ({ driver, logout, setReload, reload }) => {
  const [expanded, setExpanded] = useState(false);
  const token = useRecoilValue(sessionToken);

  const handlePaymentUpdate = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/updatePayStatus`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            dNumber: driver.dNumber
          }),
        }
      );
      const json = await response.json()
      alert(`${json.message}`)
      if (response.status === 400) {
        logout();
        return;
      }
      setReload(!reload)
    } catch (error) {
      console.log(error)
      alert("Something went wrong...");
    }
  }

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
          {driver?.payment_status ? (
            <Icon type="antdesign" name="checkcircle" color="#4aaf4f" onPress={handlePaymentUpdate} />
          ) : (
            <Icon type="antdesign" name="closecircle" color="#f44336" onPress={handlePaymentUpdate} />
          )}
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      <View
        style={{ backgroundColor: "#fff", width: "100%", padding: 20, gap: 20 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          <Image
            source={require("../../assets/Profile.png")}
            style={{ height: 120, width: 120 }}
          />
          <View style={{ marginLeft: 30 }}>
            <Text style={{ fontSize: 18 }}>{driver?.name}</Text>
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
            <Text style={{ fontSize: 18 }}>$ {driver?.rent}</Text>
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
            <Text style={{ fontSize: 18 }}>{driver?.balance}</Text>
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
              Admin Number
            </Text>
            <Text style={{ fontSize: 18 }}>
              {driver?.admin_number.split(" ")[1]}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            marginTop: 10,
          }}
        >
          <TouchableOpacity style={{ width: 140 }}>
            <Text
              style={{
                backgroundColor: "#ffae00",
                color: "#fff",
                textAlign: "center",
                paddingVertical: 10,
                borderRadius: 4
              }}
            >
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 140 }}>
            <Text
              style={{
                backgroundColor: "#f44336",
                paddingVertical: 10,
                color: "#fff",
                textAlign: "center",
                borderRadius: 4
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ListItem.Accordion>
  );
};

export default DriverAccordion;

const styles = StyleSheet.create({});
