import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import WorkCard from '../../components/WorkCard';

const BASE_URL = 'http://10.0.2.2:5000'; // ใช้กับ Android Emulator

export default function HomeScreen() {
  const [selectedType, setSelectedType] = useState<'novel' | 'comic'>('novel');
 
  type Work = {
    id: number;
    title: string;
    type: 'novel' | 'comic';
    cover_image: string;
  };
  
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/works?type=${selectedType}`);
      const data = await res.json();
      setWorks(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [selectedType]);

  return (
    <View style={styles.container}>
      {/* Toggle novel/comic */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedType === 'novel' && styles.activeButton]}
          onPress={() => setSelectedType('novel')}
        >
          <Text style={styles.toggleText}>นิยาย</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedType === 'comic' && styles.activeButton]}
          onPress={() => setSelectedType('comic')}
        >
          <Text style={styles.toggleText}>การ์ตูน</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
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
  container: { flex: 1, padding: 16 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  activeButton: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
