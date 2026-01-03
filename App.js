import React from 'react';
import { StatusBar, View } from 'react-native';
import { HabitProvider, useHabits } from './src/context/HabitContext';
import HomeScreen from './src/screens/HomeScreen';
import CustomNotif from './src/components/CustomNotif'; // Import notif yang kita buat

// Kita buat wrapper kecil biar bisa baca Context di App.js
const MainLayout = () => {
  const { notifData, setNotifData } = useHabits();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#2b1055" />
      <HomeScreen />
      
      {/* INI NOTIFIKASINYA MENGAMBANG DI ATAS */}
      <CustomNotif 
        visible={notifData.visible}
        title={notifData.title}
        message={notifData.message}
        onHide={() => setNotifData({ ...notifData, visible: false })}
      />
    </View>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <MainLayout />
    </HabitProvider>
  );
}