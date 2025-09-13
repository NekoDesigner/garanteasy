import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { History, HistoryDisplayLabel } from "../../../models/History/History";
import { InterventionDropdownProps } from "./@types";

export const INTERVENTION_OPTIONS = ["Réparation", "Maintenance", "Mise à jour", "Remplacement", "Inspection"] as const;

const InterventionDropdown: React.FC<InterventionDropdownProps> = ({ onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Réparation");

  const options = INTERVENTION_OPTIONS;

  const toggleDropdown = () => setOpen(!open);

  const handleSelect = (value: HistoryDisplayLabel) => {
    setSelected(value);
    setOpen(false);
    if (onValueChange) {
      onValueChange(History.setLabelToDatabaseFormat(value));
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton principal */}
      <TouchableOpacity style={styles.button} onPress={toggleDropdown} activeOpacity={0.7}>
        <Text style={styles.buttonText}>{selected}</Text>
        <AntDesign
          name={open ? "up" : "down"}
          size={16}
          color="#140E57"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {/* Menu déroulant */}
      {open && (
        <View style={styles.dropdown}>
          {options.map((item) => (
            <TouchableOpacity key={item} style={styles.option} onPress={() => handleSelect(item)}>
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#140E57",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonText: {
    fontSize: 14,
    color: "#140E57",
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 40, // juste sous le bouton
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#140E57",
    borderRadius: 6,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#140E57",
  },
});

export default InterventionDropdown;
