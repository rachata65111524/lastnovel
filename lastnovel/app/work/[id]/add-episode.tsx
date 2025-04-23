import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:5000';

export default function AddEpisodeScreen() {
  const { id: work_id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'novel' | 'comic'>('novel');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]); // ยังไม่เลือกภาพ

  useEffect(() => {
    const fetchType = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/works/${work_id}`);
        if (!res.ok) throw new Error('Failed to fetch work type');

        const data = await res.json();
        setType(data.type);
      } catch (error) {
        console.error('Error fetching work type:', error);
        Alert.alert('ไม่สามารถโหลดประเภทผลงานได้');
      }
    };

    fetchType();
  }, []);

  const onSubmit = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson || '{}');

      const body = {
        work_id,
        title,
        user_id: user.id, // ✅ เพิ่ม user_id ตรงนี้
        content: type === 'novel' ? content : null,
        images: type === 'comic' ? images : null,
      };

      const res = await fetch(`${BASE_URL}/api/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('เพิ่มตอนสำเร็จ');
        setTitle('');
        setContent('');
        setImages([]);
      } else {
        Alert.alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      Alert.alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      console.error(err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="ชื่อตอน"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1 }}
      />

      {type === 'novel' ? (
        <TextInput
          placeholder="เนื้อหา (สำหรับนิยาย)"
          multiline
          numberOfLines={10}
          value={content}
          onChangeText={setContent}
          style={{ marginTop: 10, borderWidth: 1, padding: 10 }}
        />
      ) : (
        <Button
          title="📷 เพิ่มรูป (ยังไม่ได้ทำ)"
          onPress={() => Alert.alert('Coming soon')}
        />
      )}

      <Button title="บันทึกตอน" onPress={onSubmit} />
    </View>
  );
}
