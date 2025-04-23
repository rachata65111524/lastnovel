import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkCard from '../components/WorkCard';
import { router } from 'expo-router';

const BASE_URL = 'http://10.0.2.2:5000';

type Work = {
  id: number;
  title: string;
  type: 'novel' | 'comic';
  cover_image: string;
};

export default function MyBooksScreen() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyWorks = async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) return;

      const user = JSON.parse(userJson);
      const res = await fetch(`${BASE_URL}/api/works/user/${user.id}`);
      const data = await res.json();
      setWorks(data);
    } catch (err) {
      console.error('Error loading works:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyWorks();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔙 ปุ่มย้อนกลับ */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← กลับ</Text>
      </TouchableOpacity>

      {/* 🧾 หัวข้อ */}
      <Text style={styles.heading}>📚 ผลงานของฉัน</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : works.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>ยังไม่มีผลงาน</Text>
      ) : (
        <FlatList
          data={works}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <WorkCard work={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: '#007AFF' }, // iOS style สีฟ้า
});
