import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Header from '../components/header';

export class HomeScreen extends Component {
  render() {
    return (
      <SafeAreaView>
        <Header />
      <View>
        <Text>HomeScreen</Text>
      </View>
      </SafeAreaView>
    );
  }
}

export default HomeScreen;