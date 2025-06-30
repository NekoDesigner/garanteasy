# GDateInput

Un composant de saisie de date intelligent pour React Native avec formatage automatique et validation.

## Fonctionnalités

- ✅ **Formatage automatique** : L'utilisateur tape seulement les chiffres, le composant ajoute automatiquement les "/" pour le format DD/MM/YYYY
- ✅ **Validation de date** : Vérifie que la date existe dans le calendrier
- ✅ **Contrôle des dates futures** : Option pour autoriser ou interdire les dates supérieures à aujourd'hui
- ✅ **Messages d'erreur** : Affichage d'erreurs contextuelles lors de la validation
- ✅ **Feedback visuel** : Bordure rouge en cas d'erreur

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `label` | `string` | - | **Requis.** Libellé du champ |
| `allowFutureDates` | `boolean` | `false` | Autorise les dates futures |
| `onDateValidation` | `(isValid: boolean, errorMessage?: string) => void` | - | Callback appelé lors de la validation |
| `errorStyle` | `StyleProp<TextStyle>` | - | Style personnalisé pour le message d'erreur |
| `labelStyle` | `StyleProp<TextStyle>` | - | Style personnalisé pour le libellé |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Style personnalisé pour le conteneur |

*+ toutes les props de `TextInput` de React Native*

## Utilisation

### Exemple basique

```tsx
import GDateInput from './components/ui/GDateInput';

function MyComponent() {
  const [date, setDate] = useState('');

  return (
    <GDateInput
      label="Date de naissance"
      value={date}
      onChangeText={setDate}
      allowFutureDates={false}
    />
  );
}
```

### Avec validation personnalisée

```tsx
import GDateInput from './components/ui/GDateInput';

function MyComponent() {
  const [date, setDate] = useState('');

  const handleValidation = (isValid: boolean, errorMessage?: string) => {
    if (!isValid) {
      console.log('Erreur:', errorMessage);
      // Gérer l'erreur (ex: afficher un toast, etc.)
    }
  };

  return (
    <GDateInput
      label="Date d'événement"
      value={date}
      onChangeText={setDate}
      allowFutureDates={true}
      onDateValidation={handleValidation}
    />
  );
}
```

## Comportement

### Formatage automatique
- L'utilisateur tape `15062025`
- Le composant affiche automatiquement `15/06/2025`

### Validation
La validation se déclenche lors de la perte de focus (`onBlur`) et vérifie :

1. **Format** : DD/MM/YYYY (2 chiffres jour, 2 chiffres mois, 4 chiffres année)
2. **Existence** : La date doit exister dans le calendrier (ex: 31/02/2025 est invalide)
3. **Dates futures** : Si `allowFutureDates={false}`, les dates supérieures à aujourd'hui sont rejetées

### Messages d'erreur
- `"Format invalide. Utilisez DD/MM/YYYY"` : Format incorrect
- `"Date invalide"` : Date inexistante dans le calendrier
- `"Date future non autorisée"` : Date future quand `allowFutureDates={false}`

## Styles

Le composant utilise des styles prédéfinis mais accepte des styles personnalisés :

```tsx
<GDateInput
  label="Ma date"
  containerStyle={{ marginBottom: 20 }}
  labelStyle={{ color: 'blue' }}
  errorStyle={{ fontSize: 14, fontWeight: 'bold' }}
  style={{ borderColor: 'green' }}
/>
```

## Accessibilité

- `testID` par défaut : `'gdateinput'`
- `testID` pour l'input : `'gdateinput-input'`
- `testID` pour l'erreur : `'gdateinput-error'`
