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

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter name')
      return
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter email')
      return
    }
    if (!age.trim()) {
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

  // ✅ Move AddForm logic directly in return, not as separate function
  return (
    <View style={s.formContainer}>
      <Text style={s.title}>Add New User</Text>

      <TextInput
        style={s.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={s.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={s.input}
        placeholder="Enter age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={s.buttonContainer}>
        <TouchableOpacity 
          style={[s.button, s.cancelButton]} 
          onPress={() => nav.goBack()}
        >
          <Text style={s.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[s.button, s.addButton, loading && s.disabledButton]} 
          onPress={handleAddUser}
          disabled={loading}
        >
          <Text style={s.buttonText}>
            {loading ? 'Adding...' : 'Add User'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default AddUserScreen