import React, { Component } from 'react';
import { Text, View } from 'react-native';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';

export class HomeScreen extends Component {
  render() {
    return (
      <ScreenView>
        <SearchBar />
          <View>
            <Text>HomeScreen</Text>
          </View>
      </ScreenView>
    );
  }
}

export default HomeScreen;