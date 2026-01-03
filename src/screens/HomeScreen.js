import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useHabits } from '../context/HabitContext';
import HabitItem from '../components/HabitItem';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const { habits, addHabit, triggerNotification } = useHabits();
  const [text, setText] = useState('');
  const [greeting, setGreeting] = useState("SYSTEM ONLINE 🟢"); 

  // --- LOGIKA SAPAAN PINTAR ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 4) setGreeting("LATE NIGHT HACKER 👾");
    else if (hour < 11) setGreeting("GOOD MORNING COMMANDER ☀️");
    else if (hour < 15) setGreeting("GOOD AFTERNOON AGENT 🌤️");
    else if (hour < 18) setGreeting("SUNSET CITY VIBES 🌆");
    else setGreeting("NIGHT CITY AWAITS 🌙");
  }, []);

  // --- HITUNGAN STATISTIK ---
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => 
    h.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  const percentage = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);
  const remaining = totalHabits - completedToday;

  const handleAdd = () => { 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    addHabit(text); 
    setText(''); 
  };

  // --- FUNGSI TEST NOTIFIKASI (Update dikit biar rapi) ---
  const handleTestNotification = () => {
    triggerNotification("SYSTEM CHECK 🔔", "Notification systems are online, Agent.");
  };

  return (
    <LinearGradient colors={['#2b1055', '#000000']} style={styles.container} start={{x:0, y:0}} end={{x:1, y:1}}>
      <StatusBar barStyle="light-content" backgroundColor="#2b1055" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>MY TARGETS</Text>
        </View>
        
        {/* Update di sini: Panggil handleTestNotification */}
        <TouchableOpacity onPress={handleTestNotification} style={styles.glassBtn}>
          <Text style={{fontSize: 22}}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PENDING</Text>
          <Text style={styles.statNumber}>{remaining}</Text>
        </View>
        <View style={[styles.statBox, {borderColor: '#00F3FF'}]}> 
          <Text style={[styles.statLabel, {color:'#00F3FF'}]}>SUCCESS RATE</Text>
          <Text style={[styles.statNumber, {color:'#00F3FF'}]}>{percentage}%</Text>
        </View>
      </View>

      {/* LIST CONTENT */}
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HabitItem habit={item} />}
        ListEmptyComponent={
          <View style={{alignItems:'center', marginTop:50, opacity:0.5}}>
            <Text style={{color:'white', fontSize:16}}>NO DATA. INITIATE PROTOCOL. 🚀</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* INPUT AREA */}
      <View style={styles.floatingArea}>
        <View style={styles.inputGlass}>
          <TextInput 
            style={styles.input} placeholder="New Mission..." placeholderTextColor="rgba(255,255,255,0.4)"
            value={text} onChangeText={setText}
          />
          <TouchableOpacity onPress={handleAdd}>
            <LinearGradient colors={['#FF0080', '#7928CA']} style={styles.addBtn} start={{x:0, y:0}} end={{x:1, y:1}}>
              <Text style={styles.addIcon}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  greeting: { color: '#00F3FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5, textTransform: 'uppercase' },
  
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  glassBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  statBox: {
    width: '48%', padding: 20, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1, borderColor: '#FF0080', alignItems: 'center',
    shadowColor: "#FF0080", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 2, marginBottom: 5, fontWeight:'bold' },
  statNumber: { color: '#FFFFFF', fontSize: 32, fontWeight: '900' },

  floatingArea: { position: 'absolute', bottom: 30, width: width, alignItems: 'center' },
  inputGlass: { width: width - 40, flexDirection: 'row', padding: 6, borderRadius: 25, backgroundColor: 'rgba(30, 30, 40, 0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  input: { flex: 1, color: 'white', paddingHorizontal: 20, fontSize: 16, fontWeight:'600' },
  addBtn: { width: 54, height: 54, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: "#FF0080", shadowOpacity: 0.6, shadowRadius: 10, elevation: 8 },
  addIcon: { fontSize: 30, color: 'white', fontWeight: 'bold', marginTop: -2 }
});