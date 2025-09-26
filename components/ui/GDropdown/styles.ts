/**
 * GDropdownStyles - Duration Dropdown Component Styles
 */

import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  label: {
    marginBottom: 5,
    color: COLORS.placeholder,
    fontSize: 14,
    fontFamily: SIZES.font.familly.default,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    minHeight: 44,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownButtonPlaceholder: {
    fontSize: 16,
    color: COLORS.placeholder,
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: -1,
    right: -1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  dropdownOptionTextSelected: {
    color: COLORS.blueDarker,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default styles;
