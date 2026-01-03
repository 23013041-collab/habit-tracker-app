import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

/* ======================================================
   NOTIFICATION HANDLER
   (Popup + Sound saat app foreground)
====================================================== */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HabitContext = createContext();

/* ======================================================
   PROVIDER
====================================================== */
export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [notifData, setNotifData] = useState({
    visible: false,
    title: '',
    message: '',
  });

  /* =======================
     INIT
  ======================= */
  useEffect(() => {
    loadHabits();
    setupNotifications();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  /* =======================
     IN-APP BANNER
  ======================= */
  const showInAppBanner = (title, message) => {
    setNotifData({ visible: true, title, message });
    setTimeout(() => {
      setNotifData(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  /* =======================
     TEST NOTIFICATION
  ======================= */
  const triggerNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        channelId: 'habit-vip-channel',
      },
      trigger: null,
    });
    showInAppBanner(title, body);
  };

  /* =======================
     ADD HABIT
  ======================= */
  const addHabit = (title) => {
    if (!title.trim()) return;
    setHabits(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        completedDates: [],
        reminderTime: null,
        reminderIso: null,
        notificationId: null,
      },
    ]);
  };

  /* =======================
     DELETE HABIT
  ======================= */
  const deleteHabit = async (id) => {
    const habit = habits.find(h => h.id === id);
    if (habit?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        habit.notificationId
      );
    }
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  /* =======================
     UPDATE HABIT
  ======================= */
  const updateHabit = (id, newTitle) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, title: newTitle } : h))
    );
  };

  /* =======================
     TOGGLE COMPLETE
  ======================= */
  const toggleHabitCompletion = async (id) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const done = habit.completedDates.includes(today);

        if (!done && habit.notificationId) {
          Notifications.cancelScheduledNotificationAsync(
            habit.notificationId
          );
        }

        if (!done) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'MISSION COMPLETE! 🎉',
              body: `Target "${habit.title}" selesai.`,
              sound: 'default',
              channelId: 'habit-vip-channel',
            },
            trigger: null,
          });
          showInAppBanner('MISSION COMPLETE! 🎉', 'Good job, Agent!');
        }

        return {
          ...habit,
          completedDates: done
            ? habit.completedDates.filter(d => d !== today)
            : [...habit.completedDates, today],
          reminderTime: done ? null : habit.reminderTime,
          reminderIso: done ? null : habit.reminderIso,
          notificationId: done ? null : habit.notificationId,
        };
      })
    );
  };

  /* =======================
     ⏰ SET REMINDER (KUNCI BACKGROUND)
     ➜ ABSOLUTE DATE TRIGGER
  ======================= */
  const setHabitReminder = async (id, fullDate) => {
    const now = new Date();
    if (fullDate <= now) {
      Alert.alert('Waktu Salah', 'Pilih waktu di masa depan');
      return;
    }

    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // Batalkan alarm lama
    if (habit.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        habit.notificationId
      );
    }

    try {
      const notificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ WAKE UP AGENT!',
            body: `Waktunya: ${habit.title}`,
            sound: 'default',
            channelId: 'habit-vip-channel',
          },
          trigger: {
            type: 'date',   // 🔥 PALING STABIL (APP BOLEH MATI)
            date: fullDate,
          },
        });

      setHabits(prev =>
        prev.map(h =>
          h.id === id
            ? {
                ...h,
                reminderTime: fullDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }),
                reminderIso: fullDate.toISOString(),
                notificationId,
              }
            : h
        )
      );

      showInAppBanner('ALARM SET ✅', 'Pengingat berhasil dijadwalkan');
    } catch (e) {
      console.log('Reminder error:', e);
      Alert.alert('Error', 'Gagal pasang alarm');
    }
  };

  /* =======================
     STORAGE
  ======================= */
  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) setHabits(JSON.parse(stored));
    } catch {}
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch {}
  };

  /* =======================
     PROVIDER
  ======================= */
  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        deleteHabit,
        updateHabit,
        toggleHabitCompletion,
        setHabitReminder,
        triggerNotification,
        notifData,
        setNotifData,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

/* ======================================================
   ANDROID CHANNEL SETUP (IMPORTANCE MAX)
====================================================== */
async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-vip-channel', {
      name: 'Alarm Misi Penting',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 500, 250],
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

/* ======================================================
   HOOK
====================================================== */
export const useHabits = () => useContext(HabitContext);
