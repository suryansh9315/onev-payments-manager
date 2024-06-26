import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import HistoryGraph from "../components/HistoryGraph";
import { useState } from "react";
import Loader from "../components/Loader";
import { API_URL } from "@env";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";

console.log(API_URL.substring(0, 0));
const { height } = Dimensions.get("window");
const formatter = Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const data = [
  {
    date: new Date("2023-07-15"),
    value: 10000,
    color: "#2AB0A7",
    overlay_color: "#defcf9",
  },
  {
    date: new Date("2023-06-15"),
    value: 20000,
    color: "#b0952a",
    overlay_color: "#fcfbde",
  },
  {
    date: new Date("2023-05-15"),
    value: 5000,
    color: "#e94646",
    overlay_color: "#fcdede",
  },
  {
    date: new Date("2023-04-15"),
    value: 0,
    color: "#2a43b0",
    overlay_color: "#dee2fc",
  },
  {
    date: new Date("2023-03-15"),
    value: 15000,
    color: "#b02aae",
    overlay_color: "#f7defc",
  },
  {
    date: new Date("2023-02-15"),
    value: 4000,
    color: "#78b02a",
    overlay_color: "#ebfcde",
  },
];

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const token = useRecoilValue(sessionToken);
  const [orders, setOrders] = useState([]);
  const [allTimeSpent, setAllTimeSpent] = useState(0);
  const [graphData, setGraphData] = useState([])

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/fetchDriverAllSpent`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const jsonn = await res.json();
      if (res.status === 200) {
        setAllTimeSpent(jsonn.total);
      } else {
        alert(`${jsonn.message}`);
      }
      const response = await fetch(`${API_URL}/api/orders/fetchDriverOrders`, {
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
      if (response.status === 200) {
        const unsorted_orders = json.orders;
        unsorted_orders.sort((a, b) => b.created_at - a.created_at);
        setOrders(unsorted_orders);
      } else {
        alert(`${json.message}`);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (loading) {
    return <Loader />;
  }

  if (!orders || !allTimeSpent) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            backgroundColor: "#fff",
            flex: 1,
            gap: 30,
            paddingHorizontal: 20,
            minHeight: height,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              paddingVertical: 20,
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
            <Text style={{ fontSize: 18, fontWeight: "400" }}>
              Transaction History
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 16, color: "#313131", opacity: 0.6 }}>
                TOTAL SPENT
              </Text>
              <Text style={{ fontSize: 44 }}>&#8377;{allTimeSpent}</Text>
            </View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 25,
                paddingVertical: 15,
                backgroundColor: "#E6F6FA",
                borderRadius: 50,
              }}
            >
              <Text
                style={{ color: "#11A794", fontWeight: "600", fontSize: 16 }}
              >
                All Time
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <HistoryGraph data={graphData} />
          </View>
          <View>
            {orders.map((item) => (
              <TouchableOpacity
                key={item.txnId}
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 15,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor:
                          item.status === "Paid" ? "#26ff00" : "#ff3030",
                      }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>
                      #{item?.txnId.substring(0, 12)}...
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#434343",
                      opacity: 0.5,
                      paddingLeft: 20,
                    }}
                  >
                    {formatter.format(item?.created_at * 1000)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      opacity: 1,
                    }}
                  >
                    &#8377;{item?.amount / 100}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
