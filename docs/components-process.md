# How to Describe and Add a Component

Follow these steps to create and document a new component in this project:

## 1. Create a Directory

- Inside the `components` folder, create a new directory named after your component.

## 2. Create the Component

- Implement the component logic in a dedicated file (e.g., `MyComponent.tsx`).

## 2.1. Example: Creating a `Card` Component (React Native Expo)

Suppose you want to add a `Card` component for a React Native Expo project. Your folder structure might look like:

```
components/
└── Card/
  ├── Card.tsx
  ├── Card.stories.tsx
  ├── types.ts
  ├── styles.ts
  └── __tests__
    └── Card.spec.tsx
```

**Card.tsx**

```tsx
import React from "react";
import { View } from "react-native";
import { CardProps } from "./types";
import { styles } from "./styles";

const Card: React.FC<CardProps> = ({
  children,
  elevation = 2,
  style,
  ...props
}) => (
  <View style={[styles.card, { elevation }, style]} {...props}>
    {children}
  </View>
);

export default Card;
```

**types.ts**

```ts
import { ReactNode } from "react";
import { ViewProps, StyleProp, ViewStyle } from "react-native";

export interface CardProps extends ViewProps {
  children: ReactNode;
  elevation?: number;
  style?: StyleProp<ViewStyle>;
}
```

**styles.ts**

```ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
```

**Card.test.tsx**

```tsx
import React from "react";
import { render } from "@testing-library/react-native";
import Card from "./Card";

test("renders children", () => {
  const { getByText } = render(<Card>Test Content</Card>);
  expect(getByText("Test Content")).toBeTruthy();
});
```

## 3. Separate Concerns

- **Types:** Place all TypeScript types in a separate file (e.g., `types.ts`).
- **Styles:** Place styles in their own file (e.g., `styles.ts`).
- **Logic:** Keep the main component logic isolated from types and styles.

### Example

Suppose you are adding a `Button` component:

```
components/
└── Button/
  ├── Button.tsx          // Main component logic
  ├── Button.stories.tsx  // Storybook
  ├── types.ts            // TypeScript types
  ├── styles.ts           // Component styles
  └── __tests__           // Tests
    └── Button.spec.tsx   // Tests
```

- **Button.tsx:** Implements the button's functionality.
- **types.ts:** Defines props and other types.
- **styles.ts:** Contains styled-components or CSS-in-JS.
- **Button.test.tsx:** Includes unit and integration tests.

## 4. Add Tests

- Create a test file (e.g., `MyComponent.test.tsx`) to ensure your component works as expected.

## 5. Storybook

To configure and view Storybook:

- Create a `.env` file in the root of your project if it doesn't exist.
- Add or update the following variables as needed:

```env
 EXPO_PUBLIC_STORYBOOK_ENABLED=false
```
> Set `EXPO_PUBLIC_STORYBOOK_ENABLED` to `true` for seeing Storybook view.
- Make sure the `.env` file is loaded by your development environment or scripts.

## 5.1. Full Example: `Alert` Component with Storybook

Suppose you want to add an `Alert` component and document it with Storybook.

**Folder Structure:**
```
components/
└── Alert/
  ├── Alert.tsx
  ├── Alert.stories.tsx
  ├── types.ts
  ├── styles.ts
  └── __tests__
    └── Alert.spec.tsx
```

**Alert.tsx**
```tsx
import React from "react";
import { View, Text } from "react-native";
import { AlertProps } from "./types";
import { styles } from "./styles";

const Alert: React.FC<AlertProps> = ({ message, type = "info", style }) => (
  <View style={[styles.alert, styles[type], style]}>
  <Text style={styles.text}>{message}</Text>
  </View>
);

export default Alert;
```

**types.ts**
```ts
import { StyleProp, ViewStyle } from "react-native";

export interface AlertProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  style?: StyleProp<ViewStyle>;
}
```

**styles.ts**
```ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  alert: {
  padding: 12,
  borderRadius: 6,
  marginVertical: 8,
  },
  info: {
  backgroundColor: "#e3f2fd",
  },
  success: {
  backgroundColor: "#e8f5e9",
  },
  warning: {
  backgroundColor: "#fffde7",
  },
  error: {
  backgroundColor: "#ffebee",
  },
  text: {
  color: "#333",
  fontSize: 16,
  },
});
```

**Alert.stories.tsx**
```tsx
import React from "react";
import { Alert } from "./Alert";
import { View } from "react-native";

export default {
  title: "Components/Alert",
  component: Alert,
};

export const Info = () => (
  <View style={{ padding: 16 }}>
  <Alert message="This is an info alert." type="info" />
  </View>
);

export const Success = () => (
  <View style={{ padding: 16 }}>
  <Alert message="Operation successful!" type="success" />
  </View>
);

export const Warning = () => (
  <View style={{ padding: 16 }}>
  <Alert message="This is a warning." type="warning" />
  </View>
);

export const Error = () => (
  <View style={{ padding: 16 }}>
  <Alert message="Something went wrong." type="error" />
  </View>
);
```

**__tests__/Alert.spec.tsx**
```tsx
import React from "react";
import { render } from "@testing-library/react-native";
import Alert from "../Alert";

test("renders alert message", () => {
  const { getByText } = render(<Alert message="Test Alert" />);
  expect(getByText("Test Alert")).toBeTruthy();
});
```

**How to View in Storybook:**

1. Ensure `EXPO_PUBLIC_STORYBOOK_ENABLED=true` in your `.env`.
2. Run your project and open Storybook to see the `Alert` component stories.


## 6. Submit via Pull Request

- **Do not push directly to the `main` branch.**
- Create a new branch for your component.
- Open a pull request for review before merging.

## Summary

- [ ] Create a directory in `components`
- [ ] Separate types, styles, and logic
- [ ] Add tests
- [ ] Open a pull request (no direct pushes to `main`)
