/**
 * GDropdown - Duration Dropdown Component
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { IGDropdownProps } from "./@types";
import GDropdownStyles from "./styles";

const GDropdown: React.FC<IGDropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Sélectionner...",
  containerStyle,
  labelStyle,
  dropdownStyle,
  testID = 'gdropdown',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleOptionPress = (value: string) => {
    console.log('GDropdown: Option pressed with value:', value);
    onValueChange(value);
    setIsOpen(false);
  };

  const renderDropdownIcon = () => (
    <Text style={GDropdownStyles.dropdownIcon}>
      {isOpen ? "▲" : "▼"}
    </Text>
  );

  return (
    <View style={[GDropdownStyles.container, containerStyle]} testID={testID}>
      <Text style={[GDropdownStyles.label, labelStyle]}>{label}</Text>

      <View style={[GDropdownStyles.dropdownContainer, dropdownStyle, disabled && GDropdownStyles.disabled]}>
        <TouchableOpacity
          style={GDropdownStyles.dropdownButton}
          onPress={() => !disabled && setIsOpen(!isOpen)}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text style={selectedOption ? GDropdownStyles.dropdownButtonText : GDropdownStyles.dropdownButtonPlaceholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          {renderDropdownIcon()}
        </TouchableOpacity>

        {isOpen && (
          <View style={GDropdownStyles.dropdownList}>
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 150 }}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    GDropdownStyles.dropdownOption,
                    index === options.length - 1 && GDropdownStyles.dropdownOptionLast,
                    selectedValue === option.value && GDropdownStyles.dropdownOptionSelected,
                  ]}
                  onPress={() => handleOptionPress(option.value)}
                >
                  <Text
                    style={[
                      GDropdownStyles.dropdownOptionText,
                      selectedValue === option.value && GDropdownStyles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default GDropdown;
