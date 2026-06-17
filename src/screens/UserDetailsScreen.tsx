import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { User } from "../database/userData";
import UserDatabase from '../database/userData'
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RootStack } from "../navigator/Navigator"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type UserDetailsProp = NativeStackNavigationProp<RootStack,'UserDetails'>

const UserDetailScreen = () => {  
const nav = useNavigation<UserDetailsProp>()
const route = useRoute()
const [user , setUser] = useState<User | null>(null)
const {userId} = route.params as {userId:number}
const [loading, setLoading] = useState<boolean>(true)

useFocusEffect(
  useCallback(()=>{
    loadUser()
  },[])
)

const loadUser = async ():Promise<void>=> {
      try{
        setLoading(true)
         const res = await UserDatabase.getById(userId)
         
         if(!res){
          setUser(null)
         }
         setUser(res)

      }catch(e){
         console.error('Error fethcing user data')
         Alert.alert('Error',`Error fetching ${e}`)

      }finally{
        setLoading(false)
      }
}


const handleDelete = ():void=>{
    
      if (!user) return

        Alert.alert('Deleting this user', 
          'Are you sure you want to delete this user?',
          [
            {text:'Cancel',style:'cancel'},
            {text:'Delete',
             style:'destructive',
             onPress: async()=>{
              try{
              await UserDatabase.deleteUser(user.id)
              Alert.alert('Success','User deleted successfully')
              nav.goBack()
              }catch(e){
                console.error('Error deleting ',e)
                Alert.alert('Error','Error Deleting')
              }
             }
            }
          ]
        )

       
    

}


if(!user){
  return(
    <View>
        <Text> User not found</Text>
        <TouchableOpacity onPress={()=> nav.goBack()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
    </View>
  )
}


  return (
    <View style={s.container}>
      <View style={s.userData}>
          <View style={s.textContainer}><Text style={s.userText}>Name: {user?.name}</Text></View>
          <View style={s.textContainer}><Text style={s.userText}>Email: {user?.email}</Text></View>
          <View style={s.textContainer}><Text style={s.userText}>Age:{user?.age}</Text></View>
          <View style={s.textContainer}><Text style={s.userText}>Created:{user?.created_at ? new Date(user?.created_at).toLocaleDateString():'N?A'}</Text></View>
      </View>
      <View style={s.buttonContainer}>
          <TouchableOpacity
          style={s.editButton}
          onPress={()=> nav.navigate('EditUser',{userId: user?.id} as {userId:number})}
          >
              <Text style={s.buttonText}>Edit User</Text>
          </TouchableOpacity>
          <TouchableOpacity
           style={s.deleteButton}
           onPress={handleDelete}
          >
            <Text style={s.buttonText}>Delete User</Text>
          </TouchableOpacity>
        
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container:{
    flex:1,
  },
  userData:{
   paddingTop:30,
   alignItems:'center'
  },
  textContainer:{
    padding:20
  },
  userText:{
    fontSize:30,
    fontWeight:'600'
  },
  buttonContainer:{
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical:12
  },
  editButton:{
    backgroundColor:'green',
    padding:10,
    borderRadius:10
  },
  deleteButton:{
    backgroundColor:'red',
    padding:10,
    borderRadius:10
  },
  buttonText:{
    color:'white',
    fontSize:16,
    fontWeight:'500'
  }
})

export default UserDetailScreen

