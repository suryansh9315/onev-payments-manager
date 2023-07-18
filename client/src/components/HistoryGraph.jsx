import { Text, View, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL } from "@env";
import { sessionToken } from "../atoms/User";
import { useRecoilValue } from "recoil";

console.log(API_URL.substring(0, 0));
const { width } = Dimensions.get("window");
const aspectRatio = 195 / 305;
const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1;
const formatter = Intl.DateTimeFormat("en", { month: "short" });

const UnderLay = ({ dates, graphOffset, step }) => {
  dates.sort((a, b) => a - b);
  return (
    <View
      style={{
        marginLeft: graphOffset,
        flexDirection: "row",
        alignItems: "center",
        height: graphOffset,
      }}
    >
      {dates.map((date, i) => (
        <View key={date} style={{ width: step }}>
          <Text style={{ textAlign: "center" }}>
            {formatter.format(new Date(date))}
          </Text>
        </View>
      ))}
    </View>
  );
};

const SideLay = ({ values, graphOffset, heightG }) => {
  values.sort((a, b) => b - a);
  return (
    <View
      style={{
        width: graphOffset,
        height: heightG,
        overflow: "hidden",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {values.map((value, i) => (
        <View key={i}>
          <Text>{+value < 1000 ? +value : +value / 1000}k</Text>
        </View>
      ))}
    </View>
  );
};

const HistoryGraph = () => {
  const [data, setData] = useState([]);
  const token = useRecoilValue(sessionToken);
  const widthC = width - 40;
  const heightC = widthC * aspectRatio;
  const graphOffset = 25;
  const widthG = widthC - graphOffset;
  const heightG = heightC - graphOffset;
  const step = widthG / 6;
  const values = data?.map((e) => e.value);
  const dates = data?.map((e) => e.date);
  const maxY = Math.max(...values);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const gRes = await fetch(`${API_URL}/api/orders/fetchDriverLast6Spent`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const gJson = await gRes.json();
      if (gRes.status === 200) {
        const unsorted_data = gJson.data;
        unsorted_data.sort((a, b) => a.date - b.date);
        setData(unsorted_data);
      } else {
        alert(`${gJson.message}`);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: heightC,
          width: widthC,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: heightC,
          width: widthC,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        height: heightC,
        width: widthC,
      }}
    >
      <View style={{ flexDirection: "row", height: heightG, width: widthC }}>
        <SideLay values={values} graphOffset={graphOffset} heightG={heightG} />
        <View
          style={{
            height: heightG,
            width: widthG,
          }}
        >
          {data?.map((bar, i) => {
            if (bar.value == 0) return null;
            return (
              <View
                key={bar.date}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: i * step,
                  width: step,
                  height: lerp(0, heightG, bar.value / maxY),
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 15,
                    right: 15,
                    backgroundColor: bar.overlay_color,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 15,
                    right: 15,
                    height: 32,
                    backgroundColor: bar.color,
                    borderRadius: 10,
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <UnderLay dates={dates} graphOffset={graphOffset} step={step} />
    </View>
  );
};

export default HistoryGraph;
