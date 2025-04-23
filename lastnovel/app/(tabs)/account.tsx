import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = 'http://10.0.2.2:5000'; // เปลี่ยนถ้าคุณ deploy

export default function AccountScreen() {
  const [username, setUsername] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUsername(user.username);
        setNewName(user.username);
      }
    };
    loadUser();
  }, []);

  const onLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('ออกจากระบบแล้ว');
    router.replace('/(auth)/login');
  };

  const updateUsername = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson || '{}');

      const res = await fetch(`${BASE_URL}/api/auth/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newName }),
      });

      const result = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('user', JSON.stringify({ ...user, username: newName }));
        setUsername(newName);
        setEditing(false);
        Alert.alert('✅ เปลี่ยนชื่อเรียบร้อยแล้ว');
      } else {
        Alert.alert('เกิดข้อผิดพลาด', result.error);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนชื่อได้');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/default-avatar.png')}
        style={styles.avatar}
      />
      <Text style={styles.username}>{username}</Text>

      {editing ? (
        <>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="ชื่อใหม่"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={updateUsername}>
            <Text style={styles.buttonText}>💾 บันทึกชื่อ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text style={{ color: 'gray', marginTop: 8 }}>ยกเลิก</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
          <Text style={styles.buttonText}>✏️ แก้ไขชื่อ</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/my-books')}>
        <Text style={styles.buttonText}>📚 My Book</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#e53935' }]} onPress={onLogout}>
        <Text style={[styles.buttonText, { color: 'white' }]}>🚪 ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: {
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
  },
  buttonText: { textAlign: 'center', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 10,
    backgroundColor: 'white',
  },
});
