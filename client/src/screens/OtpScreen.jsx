import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { admin, number, sessionToken } from "../atoms/User";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 4;

const OtpScreen = ({ navigation }) => {
  const isAdmin = useRecoilValue(admin);
  const phone = useRecoilValue(number);
  const [token, setToken] = useRecoilState(sessionToken);
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleOTPSubmit = async () => {
    try {
      const response = await fetch(
        `http://192.168.97.110:5000/api/auth/verifyOtp`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: "+91 " + phone,
            otp: value,
            isManager: isAdmin,
          }),
        }
      );
      const json = await response.json();
      console.log(json)
      if (response.status === 200) {
        setToken(json?.token);
        navigation.navigate("Home");
      } else {
        alert("Something went wrong...");
      }
    } catch (error) {
      alert("Something went wrong...");
      console.error(error);
    } finally {
      setValue("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <MaterialIcons
            name="keyboard-backspace"
            size={30}
            color="black"
            onPress={() => navigation.navigate("Login")}
          />
          <Text style={styles.headerTitle}>Verify Phone</Text>
          <View />
        </View>
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 30 }}>OTP Verification</Text>
          <Text>One Time Password (OTP) has been sent to this number</Text>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            +91 {phone}
          </Text>
          <View style={styles.inputContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              onEndEditing={handleOTPSubmit}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Didn’t Receive a code ?</Text>
            <Text style={{ fontWeight: 600 }}> Request Again</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: -15,
  },
  contentContainer: {
    gap: 10,
  },
  inputContainer: {
    backgroundColor: "#114084",
    borderRadius: 10,
    marginVertical: 10,
  },
  codeFieldRoot: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: 40,
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 38,
    fontSize: 26,
    borderRadius: 3,
    textAlign: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  focusCell: {
    backgroundColor: "#e7e7e7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});
