import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import PaymentScreen from "../screens/PaymentScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      activeColor="#ffffff"
      inactiveColor="#ffffff"
      barStyle={{ backgroundColor: "#114084" }}
      shifting={true}
      backBehavior="initialRoute"
    >
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarLabel: "Pay",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payments" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-variant" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Octicons name="history" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
