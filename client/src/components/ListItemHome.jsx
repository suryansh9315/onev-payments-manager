import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React from "react";
import DriverDoc from "./DriverDoc";

const ListItemHome = ({ item }) => {
  const { width, height } = useWindowDimensions();
  const index = item.index;

  switch (index) {
    case 0:
      return (
        <View
          style={{
            width,
            height,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              height: 300,
              width: 300,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item?.profilePic?.url }}
              style={{
                width: 200,
                height: 200,
                resizeMode: "cover",
                borderRadius: 100,
              }}
            />
          </View>
          <View>
            <Text style={styles.title}>{item?.name}</Text>
            <Text style={styles.description}>{item?.dNumber}</Text>
          </View>
          <View style={{ gap: 40, marginTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  email
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {item?.dEmail}
                </Text>
              </View>
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  joining date
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {Date(item?.date).split(" ").slice(1, 4).join(" ")}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  admin name
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.admin_name}
                </Text>
              </View>
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  admin number
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.admin_number?.split(" ")[1]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );

    case 1:
      return (
        <View
          style={{
            width,
            height,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Image
              source={item.image_comp}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text style={styles.title}>Vehicle Info</Text>
          </View>
          <View style={{ gap: 40, marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  vehicle number
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.vNumber}
                </Text>
              </View>
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  vehicle model
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.vModel}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  vehicle rent
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.rent}
                </Text>
              </View>
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  owner name
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {item?.name?.split(" ")[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );

    case 2:
      return (
        <View
          style={{
            width,
            height,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Image
              source={item.image_comp}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text style={styles.title}>Payment Info</Text>
          </View>
          <View style={{ gap: 40, marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  balance
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.balance}
                </Text>
              </View>
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  total paid
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.Paid}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#62656b", fontSize: 14, fontWeight: "300" }}
                >
                  payment status
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item?.balance >= 0 ? "Paid" : "Not Paid"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );

    case 3:
      return (
        <View
          style={{
            width,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Image
              source={item.image_comp}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text style={styles.title}>Documents</Text>
          </View>
          <ScrollView style={{ marginVertical: 20 }}>
            <DriverDoc item={item} />
          </ScrollView>
        </View>
      );

    default:
      return (
        <View
          style={{
            width,
            height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text>Extra Slide</Text>
        </View>
      );
  }
};

export default ListItemHome;

const styles = StyleSheet.create({
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
    color: "#493d8a",
  },
  description: {
    fontWeight: "300",
    textAlign: "center",
    paddingHorizontal: 64,
    color: "#62656b",
    fontSize: 18,
  },
});
