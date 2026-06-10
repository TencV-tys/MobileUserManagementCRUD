

import { NavigationContainer } from '@react-navigation/native'
import Navigator from './src/navigator/Navigator';
import UserDatabase from './src/database/userData'
import { useEffect } from 'react';


export default function App() {

  useEffect(() => {
    initializedDatabase()
  }, [])

  const initializedDatabase = async (): Promise<void> => {
    try {
      const success = await UserDatabase.createTable()

      if (success) console.log('Database initialized successfully')
      else console.log('Failed initializing')


    } catch (e) {
      console.error('Error Database Initializing', e)
    }

  }

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
