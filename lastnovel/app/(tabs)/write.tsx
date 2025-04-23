import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:5000';

export default function WriteScreen() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'novel' | 'comic'>('novel');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    if (!title || !image) {
      Alert.alert('กรุณากรอกชื่อเรื่องและเลือกรูปหน้าปก');
      return;
    }

    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson || '{}');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('user_id', user.id.toString()); // ✅ เพิ่ม user_id
      formData.append('cover_image', {
        uri: image!,
        name: 'cover.jpg',
        type: 'image/jpeg' as const,
      } as any);

      const res = await fetch(`${BASE_URL}/api/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('สร้างผลงานสำเร็จ');
        setTitle('');
        setImage(null);
      } else {
        Alert.alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      Alert.alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={{ textAlign: 'center' }}>เลือกรูปหน้าปก</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="ชื่อเรื่อง"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, type === 'novel' && styles.active]}
          onPress={() => setType('novel')}
        >
          <Text>นิยาย</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, type === 'comic' && styles.active]}
          onPress={() => setType('comic')}
        >
          <Text>การ์ตูน</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submit} onPress={onSubmit}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>สร้างผลงาน</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imagePicker: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
    marginHorizontal: 10,
  },
  active: {
    backgroundColor: '#6200ee',
  },
  submit: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 10,
  },
});
