import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Container from '../Container';
import SearchIcon from '../ui/Icons/SearchIcon';
import styles from './styles';

interface SearchBarProps {
  onHandleSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onHandleSearch }) => {
  const [search, setSearch] = React.useState<string>('');
  const handleDonePress = () => {
    if (onHandleSearch) {
      onHandleSearch(search);
    }
  };
  return (
    <Container>
      <View style={styles.container}>
        <TextInput
          placeholder="Rechercher..."
          style={styles.input}
          returnKeyType="done"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
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