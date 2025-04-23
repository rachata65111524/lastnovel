import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

const BASE_URL = 'http://10.0.2.2:5000';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const onRegister = async () => {
    if (!email || !password || !username || !birthdate) return Alert.alert('กรุณากรอกข้อมูลให้ครบ');

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, birthdate }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('สมัครสำเร็จ! ลองล็อกอินได้เลย');
        router.replace('/(auth)/login');
      } else {
        Alert.alert(data.error || 'Register failed');
      }
    } catch (err) {
      Alert.alert('Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Birthdate (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={onRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={{ marginTop: 16 }}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 8 },
  button: { backgroundColor: '#03dac6', padding: 16, borderRadius: 8 },
  buttonText: { color: '#000', textAlign: 'center', fontWeight: 'bold' },
});
