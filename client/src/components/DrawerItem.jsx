import { Text, View, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const DrawerItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: item.color,
          justifyContent: "center",
          borderRadius: 20,
          height: 40,
          width: 40,
        }}
      >
        <Icon size={20} type={item.type} name={item.icon} color="#fff" />
      </View>
      <Text style={{ fontSize: 16 }}>{item.label}</Text>
    </TouchableOpacity>
  );
};

export default DrawerItem;
