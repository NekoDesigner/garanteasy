import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E7E4E4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  input: {
    flex: 1, // Added flex to make it take all available space
    height: '100%',
    color: COLORS.blueDarker,
    paddingHorizontal: 10, // Optional: Adds padding inside the input}}
  },
  searchButton: {
    backgroundColor: COLORS.blueDarker,
    width: 60,
    height: 60,
    alignItems: 'center',
    paddingTop: 5,
    borderBottomLeftRadius: 50
  },
});

export default styles;
