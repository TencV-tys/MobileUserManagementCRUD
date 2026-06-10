import { useEffect, useState, useCallback } from "react";
import { type RootStack } from "../navigator/Navigator";
import { View, TouchableOpacity, Text, Alert, StyleSheet, FlatList } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../database/userData'
import UserDatabase from '../database/userData'
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useFocusEffect(
    useCallback(() => {
      if (UserDatabase.isReady()) loadUsers()
    }, [])
  )

  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true)
      const allUsers = await UserDatabase.getAllUser()
      setUsers(allUsers)
    } catch (e) {
      console.error('Error loading', e)
      Alert.alert('Error , Failed to load users')
    } finally {
      setLoading(false)
    }
  }



  return (
    <View>
      <Text>Home Screen</Text>
    </View>

  )
}

export default HomeScreen
