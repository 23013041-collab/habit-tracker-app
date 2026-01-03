import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { useHabits } from '../context/HabitContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HabitItem({ habit }) {
  const { toggleHabitCompletion, deleteHabit, updateHabit, setHabitReminder } = useHabits();
  
  const [isEditing, setIsEditing] = useState(false); 
  const [newTitle, setNewTitle] = useState(habit.title);
  const [showDetail, setShowDetail] = useState(false); 
  
  // State Logic untuk Pilih Tanggal DULU baru Jam
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); // 'date' atau 'time'
  const [tempDate, setTempDate] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completedDates.includes(today);
  
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); 
    return d.toISOString().split('T')[0];
  });

  const currentMonth = new Date().getMonth();
  const monthlyCount = habit.completedDates.filter(date => new Date(date).getMonth() === currentMonth).length;

  const handleSave = () => { updateHabit(habit.id, newTitle); setIsEditing(false); };
  const handleToggle = () => { toggleHabitCompletion(habit.id); };

  // --- LOGIKA BARU: PILIH TANGGAL -> LALU JAM ---
  const startPicker = () => {
    setPickerMode('date'); // Mulai dari tanggal
    setShowPicker(true);
  };

  const onPickerChange = (event, selectedDate) => {
    // Kalau user cancel
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || tempDate;
    setShowPicker(Platform.OS === 'ios'); // Di Android picker langsung nutup sendiri
    setTempDate(currentDate);

    if (pickerMode === 'date') {
      // Setelah pilih tanggal, lanjut pilih JAM
      setPickerMode('time');
      setShowPicker(true); // Buka lagi picker mode Time
    } else {
      // Setelah pilih jam, SIMPAN
      setPickerMode('date'); // Reset
      setShowPicker(false);
      setHabitReminder(habit.id, currentDate); // Panggil Context
    }
  };

  return (
    <>
      <View style={[styles.glassCard, isCompleted ? styles.borderNeon : styles.borderGlass]}>
        <View style={styles.cardContent}>
          <TouchableOpacity 
            style={[styles.checkbox, isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked]} 
            onPress={handleToggle}
          >
            {isCompleted && <Text style={styles.checkIcon}>✓</Text>}
          </TouchableOpacity>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            {isEditing ? (
              <TextInput 
                style={styles.inputEdit} value={newTitle} onChangeText={setNewTitle} autoFocus
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowDetail(true)} style={{flexDirection:'row', alignItems:'center'}}>
                   <Text style={[styles.title, isCompleted && styles.titleStrike, {marginBottom:0}]}>{habit.title}</Text>
                   <View style={styles.infoIcon}><Text style={{fontSize:10, color:'#00F3FF', fontWeight:'bold'}}>i</Text></View>
                   
                   {/* Badge Tanggal Alarm */}
                   {habit.reminderTime && (
                      <View style={styles.alarmBadge}>
                        <Text style={{fontSize:8, color:'#000'}}>📅 {habit.reminderTime}</Text>
                      </View>
                   )}
                </TouchableOpacity>
                
                <View style={styles.dotsWrapper}>
                  {last7Days.map((date, index) => {
                    const isDone = habit.completedDates.includes(date);
                    const isToday = date === today;
                    return (
                      <View key={index} style={[styles.dot, isDone ? styles.dotActive : styles.dotInactive, isToday && styles.dotToday]} />
                    );
                  })}
                  <Text style={styles.weekLabel}>7 Days</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.actionRow}>
            {isEditing ? (
              <TouchableOpacity onPress={handleSave}><Text style={styles.iconBtn}>💾</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)}><Text style={styles.iconBtn}>✏️</Text></TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => deleteHabit(habit.id)}>
              <Text style={[styles.iconBtn, {color:'#FF0055', fontWeight:'900', marginLeft:12}]}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL DETAIL */}
      <Modal visible={showDetail} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📊 HABIT DETAILS</Text>
            <Text style={styles.habitName}>"{habit.title}"</Text>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MONTHLY PROGRESS</Text>
              <Text style={styles.statValue}>{monthlyCount} <Text style={{fontSize:16}}>Times</Text></Text>
            </View>

            {/* --- TOMBOL SET ALARM (TANGGAL & JAM) --- */}
            <TouchableOpacity style={styles.alarmBtn} onPress={startPicker}>
              <Text style={styles.alarmText}>
                 {habit.reminderTime ? `📅 ALARM: ${habit.reminderTime}` : "📅 SET DATE & TIME"}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={tempDate}
                mode={pickerMode} // Bisa 'date' atau 'time'
                is24Hour={true}
                display="default"
                onChange={onPickerChange}
                minimumDate={new Date()} // Gak bisa pilih tanggal masa lalu
              />
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDetail(false)}>
              <Text style={styles.closeText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  glassCard: { marginBottom: 16, borderRadius: 24, backgroundColor: 'rgba(20, 20, 35, 0.7)', borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 5 },
  borderGlass: { borderColor: 'rgba(255, 255, 255, 0.1)' },
  borderNeon: { borderColor: 'rgba(0, 243, 255, 0.5)', backgroundColor: 'rgba(0, 243, 255, 0.05)' },
  cardContent: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, marginRight: 16, justifyContent:'center', alignItems:'center' },
  checkboxUnchecked: { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent' },
  checkboxChecked: { backgroundColor: '#00F3FF', borderColor: '#00F3FF', shadowColor: '#00F3FF', shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },
  checkIcon: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, letterSpacing: 0.5 },
  titleStrike: { color: 'rgba(255,255,255,0.3)', textDecorationLine: 'line-through' },
  infoIcon: { marginLeft:8, backgroundColor:'rgba(255,255,255,0.2)', width:18, height:18, borderRadius:9, justifyContent:'center', alignItems:'center' },
  alarmBadge: { marginLeft:8, backgroundColor:'#00F3FF', paddingHorizontal:6, paddingVertical:2, borderRadius:4 },
  dotsWrapper: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotActive: { backgroundColor: '#FF0080', shadowColor:'#FF0080', shadowOpacity:1, shadowRadius:5 },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  dotToday: { borderWidth: 1, borderColor: '#00F3FF', width: 10, height:10, borderRadius:5 },
  weekLabel: { color:'rgba(255,255,255,0.4)', fontSize:10, marginLeft: 5 },
  inputEdit: { fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#00F3FF', color: 'white', padding: 0 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { fontSize: 20, color: 'white', opacity: 0.8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#1A1A2E', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#FF0080', alignItems: 'center' },
  modalTitle: { color: '#00F3FF', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  habitName: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15, width: '100%', alignItems: 'center', marginBottom: 20 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 1 },
  statValue: { color: '#FF0080', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
  alarmBtn: { width: '100%', backgroundColor: 'rgba(0, 243, 255, 0.1)', borderWidth:1, borderColor:'#00F3FF', padding: 15, borderRadius: 12, marginBottom: 20, alignItems:'center' },
  alarmText: { color: '#00F3FF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  closeBtn: { backgroundColor: '#FF0055', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 30 },
  closeText: { color: 'white', fontWeight: 'bold' }
});