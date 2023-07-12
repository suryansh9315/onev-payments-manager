import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigators/RootNavigator.jsx";
import { RecoilRoot } from "recoil";
import { decode } from 'base-64';

if(typeof atob === 'undefined') {
  global.atob = decode;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <RecoilRoot>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </RecoilRoot>
    </SafeAreaProvider>
  );
}
