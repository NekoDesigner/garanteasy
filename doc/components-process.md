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
  ├── types.ts
  ├── styles.ts
  └── Card.test.tsx
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
  ├── Button.tsx        // Main component logic
  ├── types.ts          // TypeScript types
  ├── styles.ts         // Component styles
  └── Button.test.tsx   // Tests
```

- **Button.tsx:** Implements the button's functionality.
- **types.ts:** Defines props and other types.
- **styles.ts:** Contains styled-components or CSS-in-JS.
- **Button.test.tsx:** Includes unit and integration tests.

## 4. Add Tests

- Create a test file (e.g., `MyComponent.test.tsx`) to ensure your component works as expected.

## 5. Submit via Pull Request

- **Do not push directly to the `main` branch.**
- Create a new branch for your component.
- Open a pull request for review before merging.

## Summary

- [ ] Create a directory in `components`
- [ ] Separate types, styles, and logic
- [ ] Add tests
- [ ] Open a pull request (no direct pushes to `main`)
