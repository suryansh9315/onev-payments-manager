import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./RootNavigator.jsx";
import { RecoilRoot } from "recoil";

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
