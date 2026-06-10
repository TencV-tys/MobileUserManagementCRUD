import { useState, useCallback } from "react";
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

  const handleDelete = (userId: number, userName: string): void => {
    Alert.alert("DeleteUser",
      `Delete ${userName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await UserDatabase.deleteUser(userId)
            loadUsers()
          }
        }
      ]
    )

  }

  const renderUser = ({ item }: { item: User }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('UserDetails', { userId: item.id })}
      >
        <View>
          <Text>Name:{item.name}</Text>
          <Text>Email:{item.email}</Text>
          <Text>Age:{item.age}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }


  return (
    <View style={s.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddUser')}
      >
        <Text>Add User</Text>
      </TouchableOpacity>

      {
        loading ? (<Text>Loading...</Text>) :
          users.length === 0 ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddUser')}
            >
              <Text>Add user first</Text>
            </TouchableOpacity>) :
            (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUser}
              />
            )
      }


    </View>

  )
}

const s = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default HomeScreen
