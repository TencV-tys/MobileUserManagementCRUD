import { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import UserDatabase, { User } from "../database/userData";
import { RootStack } from "../navigator/Navigator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AddPropScreen = NativeStackNavigationProp<RootStack, 'AddUser'>

const AddUserScreen = () => {
  const nav = useNavigation<AddPropScreen>()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleAddUser = async (): Promise<void> => {

    if (!name?.trim()) {
      Alert.alert('Error', 'Please enter name')
      return
    }
    if (!email?.trim()) {
      Alert.alert('Error', 'Please enter email')
      return
    }
    if (!age?.trim()) {
      Alert.alert('Error', 'Please enter age')
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age (1-120)')
      return
    }

    try {
      setLoading(true)
      const result = await UserDatabase.addUser(name.trim(), email.trim(), ageNum)

      if (result > 0) {
        Alert.alert('Success', 'User Added successfully')
        nav.goBack()
      } else {
        Alert.alert('Error', 'Failed to add user')
      }

    } catch (e) {
      console.error('Error adding ', e)
      Alert.alert('Error', 'Something went wrong')
    } finally {
      setLoading(false)
    }


  }

  const AddForm = () => {
    return (
      <View style={s.formContainer}>
        <Text> Add New User</Text>

        <TextInput
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        /> <TextInput
          placeholder="Enter age"
          value={age}
          onChangeText={setAge}
        />

        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddUser}
          disabled={loading}>

          <Text>
            {
              loading ? 'Adding...' : 'Add User'
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <AddForm />
  )
}

const s = StyleSheet.create({
  formContainer: {
    flex: 1
  }
})

export default AddUserScreen

