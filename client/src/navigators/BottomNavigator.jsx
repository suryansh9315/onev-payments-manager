import PaymentScreen from "../screens/PaymentScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import QRCode from "../screens/QRCode";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";

const Drawer = createDrawerNavigator();

const BottomNavigator = () => {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="HomeDriver"
        backBehavior="history"
        screenOptions={{ headerShown: false, drawerStyle: { width: '80%' }}}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="Payment" component={PaymentScreen} />
        <Drawer.Screen name="HomeDriver" component={HomeScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
        <Drawer.Screen name="QRCodePayment" component={QRCode} />
      </Drawer.Navigator>
    </>
  );
};

export default BottomNavigator;
