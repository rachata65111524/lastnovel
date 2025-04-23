import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

type Work = {
  id: number;
  title: string;
  type: 'novel' | 'comic';
  cover_image: string;
};

export default function WorkCard({ work }: { work: Work }) {
  const handlePress = () => {
    router.push(`/work/${work.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Image source={{ uri: work.cover_image }} style={styles.cover} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{work.title}</Text>
          <Text>{work.type === 'novel' ? 'นิยาย' : 'การ์ตูน'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    alignItems: 'center',
  },
  cover: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
