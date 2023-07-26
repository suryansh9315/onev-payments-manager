import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import DrawerItem from "./DrawerItem";
import { admin, number, sessionToken, user } from "../atoms/User";
import { useRecoilState } from "recoil";
import { Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

const items = [
  {
    icon: "list",
    label: "Drivers",
    screen: "Drivers",
    color: "#rgb(42,177,166)",
    type: "ionicons",
  },
  {
    icon: "adduser",
    label: "Create Driver",
    screen: "CreateDriver",
    color: "#F75428",
    type: "antdesign",
  },
  {
    icon: "history",
    label: "History",
    screen: "AllHistory",
    color: "#FE7896",
    type: "octicons",
  },
];

const CustomDrawerAdmin = (props) => {
  const [user_info, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const { height } = useWindowDimensions();

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

  return (
    <DrawerContentScrollView
      {...props}
    >
      <View
        style={{
          position: "absolute",
          zIndex: 1000,
          width: "100%",
          alignItems: "center",
          top: 80,
        }}
      >
        <Image
          source={require("../../assets/Profile.png")}
          style={{
            height: 120,
            width: 120,
            zIndex: 1000,
          }}
        />
      </View>
      <View style={{ height: 130, backgroundColor: "white" }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomRightRadius: 50,
            backgroundColor: "#000",
          }}
        />
      </View>
      <View style={{ height: 350, backgroundColor: "white" }}>
        <View
          style={{
            backgroundColor: "#000",
            flex: 1,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 50,
            backgroundColor: "#fff",
            paddingHorizontal: 30,
            paddingVertical: 40,
            gap: 15,
          }}
        >
          <View style={{ alignItems: "center", paddingVertical: 15, gap: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>
              {user_info?.name}
            </Text>
            <Text style={{ fontWeight: "300", fontSize: 14 }}>
              {user_info?.number}
            </Text>
          </View>
          {items.map((item) => (
            <DrawerItem item={item} key={item.label} />
          ))}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            onPress={logout}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#000",
                justifyContent: "center",
                borderRadius: 20,
                height: 40,
                width: 40,
              }}
            >
              <Icon size={20} type="antdesign" name="logout" color="#fff" />
            </View>
            <Text style={{ fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerAdmin;
