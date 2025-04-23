import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:5000';

export default function WorkDetail() {
  const { id } = useLocalSearchParams();
  const [userId, setUserId] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [type, setType] = useState('');
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson || '{}');
      setUserId(user.id);

      // ดึงข้อมูลผลงาน
      const res = await fetch(`${BASE_URL}/api/works/${id}`);
      const data = await res.json();
      setOwnerId(data.user_id);
      setType(data.type);
    };

    fetchData();
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/episodes/work/${id}`);
      const data = await res.json();
      setEpisodes(data);
    } catch (err) {
      console.error(err);
      Alert.alert('โหลดตอนล้มเหลว');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>📘 ผลงาน ID: {id}</Text>

      {userId === ownerId && (
        <Button title="➕ เพิ่มตอน" onPress={() => router.push(`/work/${id}/add-episode`)} />
      )}

      {userId !== ownerId && (
        <Text style={{ marginTop: 10, color: 'gray' }}>คุณสามารถอ่านได้เท่านั้น</Text>
      )}

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>📄 ตอนทั้งหมด:</Text>
      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text>📑 {item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}
