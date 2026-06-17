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
            try{
            await UserDatabase.deleteUser(userId)
            loadUsers()
            }catch(e){
              console.error('Error deleting')
              Alert.alert('Error','Error Deleting')
            }
          }
        }
      ]
    )

  }

  const renderUser = ({ item }: { item: User }) => {
    return (
      <TouchableOpacity
        style={s.detailContainer}
        onPress={() => navigation.navigate('UserDetails', { userId: item.id })}
      >
        <View style={s.detailHolder}>
          <Text style={s.detailText}>Name:{item.name}</Text>
          <Text style={s.detailText}>Email:{item.email}</Text>
          <Text style={s.detailText}>Age:{item.age}</Text>
        </View>
        <TouchableOpacity
          style={s.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={s.deleteText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }


  return (
    <View style={s.container}>
      {
      users.length > 0 && (
      <View style={s.addContainer}>
      <TouchableOpacity
        style={s.addButton}
        onPress={() => navigation.navigate('AddUser')}
      >
        <Text style={s.addText}>Add User</Text>
      </TouchableOpacity>
      </View>
       )
        }
      {
        loading ? (
        <View style={s.loadingContainer}>
          <Text style={s.loadingText}>Loading...</Text>
        </View>
        ) :
          users.length === 0 ? (
            <View style={s.addFirstContainer}>
            <TouchableOpacity
              style={s.addFirst}
              onPress={() => navigation.navigate('AddUser')}
            >
              <Text style={s.addFirstText}>Add user first</Text>
            </TouchableOpacity> 
            </View>
            ) :
            (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUser}
              />
            )}
        </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1
  },
  addButton:{
    alignItems:'center',
    padding:10,
    backgroundColor:'blue',
    borderRadius:10,
    width:'50%'
  },
  addContainer:{
      width:'100%',
      alignItems:'center',
      paddingVertical:10
  },
  addText:{
    fontSize:14,
    color:'white',

  },
  detailContainer:{
    paddingHorizontal:20,
    paddingVertical:10,
    borderWidth:1,
    marginVertical:10,
    marginHorizontal:8
  },
  detailHolder:{
    padding:3,
    justifyContent:'space-around',
  },
  detailText:{
    fontWeight:'500',
    fontStyle:'italic'
  },
  deleteButton:{
    margin:5,
    alignItems:'center',
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor:'red',
    borderRadius:10
  },
  deleteText:{
    color:'white',
    fontWeight:'500'
  },
  loadingContainer:{
    alignItems:'center',
    flex:1,
    justifyContent:'center',

  },
  loadingText:{
    fontWeight:'500',
    fontSize:18
  },
  addFirstContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  addFirst:{
    backgroundColor:'blue',
    padding:12,
    borderRadius:10
  },
  addFirstText:{
    fontSize:18,
    fontWeight:'500',
    color:'white'
  }
})

export default HomeScreen
