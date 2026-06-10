import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen'
import EditScreen from '../screens/EditUserScreen'
import AddScreen from '../screens/AddUserScreen'
import UserDetailsScreen from '../screens/UserDetailsScreen'

const St = createNativeStackNavigator()

const Navigator = () => {
  return (
    <St.Navigator>
      <St.Screen name='Home' component={HomeScreen} options={{ title: 'User Management' }} />
      <St.Screen name='AddUser' component={AddScreen} options={{ title: 'Add New User' }} />
      <St.Screen name='EditUser' component={EditScreen} options={{ title: 'Edit User' }} />
      <St.Screen name='UserDetails' component={UserDetailsScreen} options={{ title: 'User Details' }} />
    </St.Navigator>
  )
}

export default Navigator
