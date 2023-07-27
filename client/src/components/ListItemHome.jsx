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
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              height: 220,
              width: 220,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={{ uri: item?.profilePic?.url }}
              style={{
                width: 180,
                height: 180,
                resizeMode: "cover",
                borderRadius: 100,
              }}
            />
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.title}>{item?.name}</Text>
            <Text style={styles.description}>{item?.dNumber}</Text>
          </View>
          <ScrollView
            style={{
              marginBottom: 20,
              marginHorizontal: 15,
              paddingHorizontal: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                gap: 14,
                width: "100%",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  EMAIL
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {item?.dEmail}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  JOINING DATE
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {Date(item?.date).split(" ").slice(1, 4).join(" ")}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  ADMIN NAME
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.admin_name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  ADMIN NUMBER
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.admin_number?.split(" ")[1]}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      );

    case 1:
      return (
        <View
          style={{
            width,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              height: 250,
              width: 250,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={item.image_comp}
              style={{ width: 250, height: 250, resizeMode: "contain" }}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Vehicle Info</Text>
          </View>
          <ScrollView
            style={{
              marginBottom: 20,
              marginHorizontal: 15,
              paddingHorizontal: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                gap: 14,
                width: "100%",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  VEHICLE NUMBER
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {item?.vNumber}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  VEHICLE MODEL
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.vModel}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  VEHICLE RENT
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.rent}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  OWNER NAME
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.name}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      );

    case 2:
      return (
        <View
          style={{
            width,
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              height: 250,
              width: 250,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={item.image_comp}
              style={{ width: 230, height: 250, resizeMode: "contain" }}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Payment Info</Text>
          </View>
          <ScrollView
            style={{
              marginBottom: 20,
              marginHorizontal: 15,
              paddingHorizontal: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                gap: 14,
                width: "100%",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  BALANCE
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {item?.balance}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  TOTAL PAID
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.Paid}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  width: "90%",
                  backgroundColor: "#fff",
                  elevation: 3,
                  gap: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  PAYMENT STATUS
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item?.balance >= 0 ? "Paid" : "Not Paid"}
                </Text>
              </View>
            </View>
          </ScrollView>
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
          <View
            style={{
              height: 250,
              width: 250,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={item.image_comp}
              style={{ width: 250, height: 200, resizeMode: "contain" }}
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
    fontSize: 24,
    marginBottom: 5,
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
