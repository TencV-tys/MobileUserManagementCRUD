

import * as Lite from 'expo-sqlite'

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  created_at: string;
}

class UserDatabase {
  private db: Lite.SQLiteDatabase
  constructor() {
    this.db = Lite.openDatabaseSync('users.db')
  }

  async createTable(): Promise<boolean> {
    try {
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)

      console.log('Table created successfully')
      return true
    } catch (e) {
      console.error('Error creating table', e)
      return false
    }
  }

  async addUser(name: string, email: string, age: number): Promise<number> {
    try {
      const res = await this.db.runAsync(`INSERT INTO users (name,email,age) VALUES (?,?,?)`, [name, email, age])
      return res.lastInsertRowId

    } catch (e) {
      console.error('Error adding new user', e)
      return 0
    }

  }

  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.db.getAllAsync('SELECT id,name,email,age,created_at FROM users ORDER BY id DESC')
      console.log('Users loaded', users?.length)
      return users as User[]
    } catch (e) {
      console.error('Error fetching', e)
      return []
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      const user = await this.db.getFirstAsync('SELECT * FROM users WHERE id = ?', [id])
      console.log('User found', user)
      return user as User | null
    } catch (e) {
      console.error('Error getting id', e)
      return null
    }
  }
  async updateUser(id: number, name: string, email: string, age: number): Promise<number> {
    try {
      const result = await this.db.runAsync('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [
        name, email, age, id
      ])
      console.log('User updated')
      return result.changes
    } catch (e) {
      console.error('Error updatingg', e)
      return 0
    }
  }

  async deleteUser(id: number): Promise<number> {
    try {
      const res = await this.db.runAsync('DELETE FROM users WHERE id = ?', [id])
      console.log('User deleted', res.changes)
      return res.changes
    } catch (e) {
      console.error('Error Deleting', e)
      return 0
    }
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const users = await this.db.getAllAsync('SELECT * FROM users WHERE name LIKE ? OR email LIKE ?',
        `%${searchTerm}%`, `%${searchTerm}%`)
      return users as User[]
    } catch (e) {
      console.error('Error searching', e)
      return []
    }
  }


}

export default new UserDatabase();
