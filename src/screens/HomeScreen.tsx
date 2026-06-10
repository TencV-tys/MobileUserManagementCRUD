import { useEffect, useState, useCallback } from "react";
import { type RootStack } from "../navigator/Navigator";
import { View, TouchableOpacity, Text, Alert, StyleSheet, FlatList } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Home'>;

const HomeScreen = () => {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>

  )
}

export default HomeScreen
