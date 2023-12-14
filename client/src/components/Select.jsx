import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "@rneui/themed";

const Select = ({ list, setList, originalList }) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    // if (search.length === 0) {
    //   return setList(originalList);
    // }
    // setList(
    //   originalList.filter(
    //     (driver) =>
    //       driver?.name.includes(search) || driver?.dNumber.includes(search)
    //   )
    // );
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F9F9F8",
          borderRadius: 2,
          paddingHorizontal: 15,
          paddingVertical: 5,
          elevation: 1,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleSearch}
        >
          <Icon
            name="search"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          style={{
            flex: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
          onChangeText={(e) => {
            setSearch(e);
          }}
        />
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "none",
          }}
          onPress={() => setSearch("")}
        >
          <Icon
            name="close"
            type="material"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{display: 'none'}}>
        <ScrollView
          nestedScrollEnabled={true}
          style={{
            height: 200,
            zIndex: 200000,
          }}
        >
          <View
            style={{
              backgroundColor: "#F9F9F8",
              borderRadius: 2,
              elevation: 1,
              gap: 5,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
          >
            {list?.map((driver) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }}
                key={driver?.dNumber}
              >
                <Text style={{ fontWeight: "300", fontSize: 14 }}>
                  {driver.name}
                </Text>
                <Text style={{ fontWeight: "400", fontSize: 10 }}>
                  {driver.dNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({});
