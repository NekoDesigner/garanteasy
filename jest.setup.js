/* eslint-env jest */
import "@testing-library/jest-native/extend-expect";

// jest.setup.js
process.env.EXPO_OS = process.env.EXPO_OS || "web";
// jest.setup.js
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    AntDesign: (props) => React.createElement("Icon", props),
    // ajoute d'autres sets si tu les utilises
  };
});


