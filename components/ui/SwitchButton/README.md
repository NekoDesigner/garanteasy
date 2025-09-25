# SwitchButton

Un composant switch button personnalisable pour React Native avec animations fluides.

## Fonctionnalités

- ✨ Animations fluides avec `Animated`
- 📏 Trois tailles disponibles (small, medium, large)
- 🎨 Couleurs personnalisables
- 🏷️ Support des labels avec positionnement flexible
- ♿ Support de l'accessibilité
- 🚫 État désactivé
- 🧪 Tests unitaires inclus

## Utilisation de base

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import SwitchButton from '@/components/ui/SwitchButton';

export default function Example() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View>
      <SwitchButton
        value={isEnabled}
        onValueChange={setIsEnabled}
        label="Activer les notifications"
      />
    </View>
  );
}
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `value` | `boolean` | **requis** | Valeur actuelle du switch |
| `onValueChange` | `(value: boolean) => void` | **requis** | Fonction appelée quand la valeur change |
| `label` | `string` | `undefined` | Texte du label à afficher |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Position du label par rapport au switch |
| `disabled` | `boolean` | `false` | Désactive le switch |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Taille du switch |
| `colors` | `SwitchColors` | Couleurs par défaut | Couleurs personnalisées |
| `style` | `ViewStyle` | `undefined` | Style personnalisé du conteneur |
| `testID` | `string` | `'switchbutton'` | ID pour les tests |

### Type SwitchColors

```tsx
{
  active?: string;           // Couleur de fond quand activé
  inactive?: string;         // Couleur de fond quand désactivé
  thumb?: string;            // Couleur du bouton
  disabledActive?: string;   // Couleur de fond activé/désactivé
  disabledInactive?: string; // Couleur de fond inactif/désactivé
}
```

## Exemples

### Avec label à gauche

```tsx
<SwitchButton
  value={darkMode}
  onValueChange={setDarkMode}
  label="Mode sombre"
  labelPosition="left"
/>
```

### Différentes tailles

```tsx
<SwitchButton
  value={small}
  onValueChange={setSmall}
  label="Petit"
  size="small"
/>

<SwitchButton
  value={medium}
  onValueChange={setMedium}
  label="Moyen"
  size="medium"
/>

<SwitchButton
  value={large}
  onValueChange={setLarge}
  label="Grand"
  size="large"
/>
```

### Couleurs personnalisées

```tsx
<SwitchButton
  value={custom}
  onValueChange={setCustom}
  label="Couleurs personnalisées"
  colors={{
    active: '#FF6B6B',
    inactive: '#4ECDC4',
    thumb: '#FFE66D',
  }}
/>
```

### État désactivé

```tsx
<SwitchButton
  value={disabled}
  onValueChange={setDisabled}
  label="Switch désactivé"
  disabled={true}
/>
```

## Accessibilité

Le composant inclut le support de l'accessibilité avec :
- `accessibilityRole="switch"`
- `accessibilityState` pour l'état checked/disabled
- `accessibilityLabel` avec le label fourni

## Tests

Pour exécuter les tests :

```bash
npm test -- SwitchButton.spec.tsx
```