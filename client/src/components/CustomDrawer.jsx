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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const items = [
  {
    icon: "home",
    label: "Home",
    screen: "HomeDriver",
    color: "#rgb(42,177,166)",
    type: "antdesign",
  },
  {
    icon: "payment",
    label: "Pay",
    screen: "Payment",
    color: "#0051C4",
    type: "",
  },
  {
    icon: "history",
    label: "History",
    screen: "History",
    color: "#FE7896",
    type: "octicons",
  },
];

const CustomDrawer = (props) => {
  const [user_info, setUser] = useRecoilState(user);
  const [token, setToken] = useRecoilState(sessionToken);
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

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
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#005EFF" }}>
      <View style={{ height: 80, backgroundColor: "white" }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomRightRadius: 50,
            backgroundColor: "#005EFF",
          }}
        />
      </View>
      <View style={{ height: height - 80, backgroundColor: "white" }}>
        <View
          style={{
            backgroundColor: "#005EFF",
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
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: user_info?.profilePic?.url }}
              style={{
                height: 120,
                width: 120,
                zIndex: 1000,
                borderRadius: 30,
              }}
            />
          </View>
          <View style={{ alignItems: "center", paddingVertical: 10, gap: 2 }}>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>
              {user_info?.name}
            </Text>
            <Text style={{ fontWeight: "300", fontSize: 14 }}>
              {user_info?.dNumber}
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
                backgroundColor: "#fe3d01",
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

export default CustomDrawer;
