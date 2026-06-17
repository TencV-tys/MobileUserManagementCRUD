import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import UserDatabase from '../database/userData'
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigator/Navigator";

type EditScreenProp = NativeStackNavigationProp<RootStack, 'EditUser'>

const EditUserScreen = () => {
  const nav = useNavigation<EditScreenProp>()
  const route = useRoute()
  const { userId } = route.params as { userId: number }


  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (UserDatabase.isReady()) loadUserData()
  }, [])

  const loadUserData = async (): Promise<void> => {
    try {
      const user = await UserDatabase.getById(userId)
      if (user) {
        setName(user?.name)
        setEmail(user?.email)
        setAge(user?.age.toString())

      } else {
        Alert.alert('Error', 'User not found')
        nav.goBack()
      }

    } catch (e) {
      console.error('Error fetching user data', e)
      Alert.alert('Error', ' Failed to load user data')
    }

  }

  const handleUpdateUser = async (): Promise<void> => {

    if (!name.trim()) {
      Alert.alert('Error', 'please enter name')
      return
    }
    if (!email.trim()) {
      Alert.alert('Error', 'please enter email')
      return
    }

    if (!age.trim()) {
      Alert.alert('Error', 'please enter age')
      return
    }
        const ageNum = parseInt(age)

    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age (1-120)')
      return

    }
    try {
      setLoading(true)
      const result = await UserDatabase.updateUser(userId, name.trim(), email.trim(), ageNum)
      if (result > 0) {
        Alert.alert('Success', 'User updated sucessfully')
        nav.goBack()
      } else {
        Alert.alert('Error', 'Failed to update user')
      }
    } catch (e) {
      console.error('Error updating user:', e)
      Alert.alert('Error', 'Something went wrong')
    } finally {
      setLoading(false)
    }

  }

  return (
    <View style={s.container}>
   

      <TextInput
        style={s.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={s.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={s.input}
        placeholder="Enter Age"
        onChangeText={setAge}
        value={age}
        keyboardType="numeric"
      />

      <View style={s.buttonContainer}>
        <TouchableOpacity
        style={s.cancel}
          onPress={() => nav.goBack()}
        >
          <Text style={s.textButton}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.update}
          onPress={handleUpdateUser}
          disabled={loading}

        >
          <Text style={s.textButton}>{loading ? 'Updating...' : 'Update user'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const s = StyleSheet.create({
  container:{
    flex:1,
    padding:15
  },
  input:{
   borderWidth:1,
   padding:15,
   marginBottom:10,
   borderColor: '#ddd',
   borderRadius:10,
   fontSize:16,
   backgroundColor:'white'
  },
  buttonContainer:{
    padding:10,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    margin:5
  },
  cancel:{
    backgroundColor:'red',
    borderRadius:10,
    flex:1,
    alignItems:'center',
    marginRight:5
  },
  textButton:{
    fontSize:16,
    fontWeight:'600',
    padding:10,
    color:'white'
  },
  update:{
   backgroundColor:'green',
   borderRadius:10,
   flex:1,
   alignItems:'center',
   marginLeft:5

  }

})

export default EditUserScreen

