import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Container from '../Container';
import SearchIcon from '../ui/Icons/SearchIcon';
import styles from './styles';

const SearchBar = () => {
  const handleDonePress = () => {
    console.log('Done pressed');
  };
  return (
    <Container>
      <View style={styles.container}>
        <TextInput
          placeholder="Rechercher..."
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleDonePress}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleDonePress()}
        >
          <SearchIcon />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default SearchBar;