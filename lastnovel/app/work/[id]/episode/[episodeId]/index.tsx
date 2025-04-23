import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';

const BASE_URL = 'http://10.0.2.2:5000';

export default function EpisodeDetail() {
  const { episodeId } = useLocalSearchParams();
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/episodes/${episodeId}`)
      .then(res => res.json())
      .then(data => setEpisode(data))
      .catch(err => {
        console.error(err);
        Alert.alert('โหลดตอนล้มเหลว');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{episode.title}</Text>
      {episode.content && <Text style={{ marginTop: 10 }}>{episode.content}</Text>}
      {episode.images && episode.images.map((url: string, index: number) => (
        <Image key={index} source={{ uri: url }} style={{ width: '100%', height: 300, marginTop: 10 }} />
      ))}
    </ScrollView>
  );
}
