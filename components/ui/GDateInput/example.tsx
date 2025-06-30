/**
 * Example d'utilisation du composant GDateInput
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GDateInput from './index';

const GDateInputExample = () => {
  const [birthDate, setBirthDate] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleBirthDateValidation = (isValid: boolean, errorMessage?: string) => {
    if (!isValid && errorMessage) {
      console.log('Erreur date de naissance:', errorMessage);
    }
  };

  const handleEventDateValidation = (isValid: boolean, errorMessage?: string) => {
    if (!isValid && errorMessage) {
      console.log('Erreur date événement:', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemples GDateInput</Text>

      {/* Date de naissance - pas de dates futures */}
      <GDateInput
        label="Date de naissance"
        value={birthDate}
        onChangeText={setBirthDate}
        allowFutureDates={false}
        onDateValidation={handleBirthDateValidation}
        style={styles.input}
      />

      {/* Date d'événement - dates futures autorisées */}
      <GDateInput
        label="Date d'événement"
        value={eventDate}
        onChangeText={setEventDate}
        allowFutureDates={true}
        onDateValidation={handleEventDateValidation}
        style={styles.input}
      />

      <Text style={styles.info}>
        • Tapez uniquement les chiffres (ex: 15062025)
        • Le format DD/MM/YYYY est appliqué automatiquement
        • La validation se fait lors de la perte de focus
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  info: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default GDateInputExample;
