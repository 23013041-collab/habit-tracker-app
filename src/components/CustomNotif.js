import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar } from 'react-native';

export default function CustomNotif({ visible, title, message, onHide }) {
  const slideAnim = useRef(new Animated.Value(-150)).current; // Mulai dari luar layar atas

  useEffect(() => {
    if (visible) {
      // Animasi Turun
      Animated.spring(slideAnim, {
        toValue: Platform.OS === 'ios' ? 50 : 10, // Posisi muncul
        useNativeDriver: true,
        speed: 12,
        bounciness: 5,
      }).start();

      // Otomatis hilang setelah 3 detik
      const timer = setTimeout(() => {
        closeNotif();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const closeNotif = () => {
    // Animasi Naik (Hilang)
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.content}>
        {/* Ikon Aplikasi Kecil */}
        <View style={styles.headerRow}>
          <View style={styles.smallIcon} />
          <Text style={styles.appName}>HabitTracker • Sekarang</Text>
        </View>

        {/* Isi Notifikasi */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: StatusBar.currentHeight || 40, // Muncul di bagian atas layar
    left: 20,
    right: 20,
    backgroundColor: '#333333', // Warna abu gelap kayak notif Android
    borderRadius: 16,
    padding: 16,
    zIndex: 9999, // Pastikan selalu di paling atas
    elevation: 10, // Bayangan (Android)
    shadowColor: '#000', // Bayangan (iOS)
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  content: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00F3FF', // Ikon warna Cyan
    marginRight: 8,
  },
  appName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
});