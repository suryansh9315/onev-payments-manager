import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AllHistory from '../screens/AllHistory'
import CreateDriver from '../screens/CreateDriver'
import DriversScreen from '../screens/DriversScreen'
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";

  return (
    <Tab.Navigator
      initialRouteName="CreateDriver"
      activeColor="#ffffff"
      inactiveColor="#ffffff"
      barStyle={{ backgroundColor: "#114084" }}
      shifting={true}
      backBehavior="initialRoute"
    >
      <Tab.Screen
        name="Drivers"
        component={DriversScreen}
        options={{
          tabBarLabel: "Drivers",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="address-book" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateDriver"
        component={CreateDriver}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color }) => (
            <AntDesign name="adduser" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AllHistory"
        component={AllHistory}
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
