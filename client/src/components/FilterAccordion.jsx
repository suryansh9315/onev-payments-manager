import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const FilterAccordion = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Not Paid", value: "not_paid" },
  ]);

  return (
    <>
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
          placeholder="Filter"
          dropDownContainerStyle={{ borderWidth: 0 }}
        />
      </View>
    </>
  );
};

export default FilterAccordion;
