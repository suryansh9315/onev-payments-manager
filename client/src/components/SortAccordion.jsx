import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const SortAccordion = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Date", value: "date" },
    { label: "Name", value: "name" },
    { label: "Rent", value: "rent" },
    { label: "Balance", value: "balance" },
  ]);

  return (
    <View
        style={{
          width: 110,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={{ borderWidth: 0 }}
          zIndex={5000}
          placeholder="Sort"
          dropDownContainerStyle={{ borderWidth: 0 }}
        />
      </View>
  );
};

export default SortAccordion;
