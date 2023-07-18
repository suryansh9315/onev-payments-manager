import AllHistory from '../screens/AllHistory'
import CreateDriver from '../screens/CreateDriver'
import DriversScreen from '../screens/DriversScreen'
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerAdmin from "../components/CustomDrawerAdmin";

const Drawer = createDrawerNavigator();

const BottomNavigator = () => {
  return (
    <Drawer.Navigator
        initialRouteName="Drivers"
        backBehavior="initialRoute"
        screenOptions={{ headerShown: false, drawerStyle: { width: '80%' }}}
        drawerContent={(props) => <CustomDrawerAdmin {...props} />}
      >
        <Drawer.Screen name="Drivers" component={DriversScreen} />
        <Drawer.Screen name="CreateDriver" component={CreateDriver} />
        <Drawer.Screen name="AllHistory" component={AllHistory} />
      </Drawer.Navigator>
  );
};

export default BottomNavigator;
