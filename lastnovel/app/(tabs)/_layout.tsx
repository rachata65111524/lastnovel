// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import Footer from '../../components/Footer';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="write" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
