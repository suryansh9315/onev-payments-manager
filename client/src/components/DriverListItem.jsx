import { Icon } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DriverListItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        marginBottom:5,
        borderRadius: 5,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 15,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        elevation: 1,
      }}
      onPress={() => {
        navigation.navigate("SingleDriver", {
          driver: item,
        });
      }}
    >
      <View style={{ gap: 3 }}>
        <Text style={{ fontWeight: "400", fontSize: 15 }}>{item?.name}</Text>
        <Text style={{ fontWeight: "200", fontSize: 12 }}>{item?.dNumber}</Text>
      </View>
      <View>
        {item?.balance >= 0 ? (
          <Icon type="antdesign" name="checkcircle" color="#4aaf4f" size={18} />
        ) : (
          <Icon type="antdesign" name="closecircle" color="#f44336" size={18} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DriverListItem;
