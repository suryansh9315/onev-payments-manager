import AllHistory from '../screens/AllHistory'
import CreateDriver from '../screens/CreateDriver'
import DriversScreen from '../screens/DriversScreen'
import SinglePayment from '../screens/SinglePayment'
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerAdmin from "../components/CustomDrawerAdmin";

const Drawer = createDrawerNavigator();

const BottomNavigator = () => {
  return (
    <Drawer.Navigator
        initialRouteName="CreateDriver"
        backBehavior="history"
        screenOptions={{ headerShown: false, drawerStyle: { width: '80%' }}}
        drawerContent={(props) => <CustomDrawerAdmin {...props} />}
      >
        <Drawer.Screen name="Drivers" component={DriversScreen} />
        <Drawer.Screen name="CreateDriver" component={CreateDriver} />
        <Drawer.Screen name="AllHistory" component={AllHistory} />
        <Drawer.Screen name="SinglePaymentAll" component={SinglePayment} />
      </Drawer.Navigator>
  );
};

export default BottomNavigator;
