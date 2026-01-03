# Nama Aplikasi
Habit Alarm (Anti-Kill Background Service)

## Deskripsi Aplikasi
Aplikasi ini adalah aplikasi pengingat kebiasaan (Habit Tracker) yang dirancang khusus untuk mengatasi masalah notifikasi mati pada perangkat Android. 

Fitur unggulan aplikasi ini adalah **"High Priority Background Alarm"**, di mana alarm akan tetap berbunyi keras dan menyalakan layar HP secara otomatis meskipun:
1. Aplikasi ditutup paksa (Kill/Force Close) dari Recent Apps.
2. Layar HP dalam keadaan mati/terkunci (Deep Sleep).

Aplikasi ini menggunakan integrasi langsung ke Android AlarmManager melalui library Expo Notifications.

## Anggota Kelompok
1. [Nama Abang] - [NIM Abang]
2. [Nama Teman 1] - [NIM]
3. [Nama Teman 2] - [NIM]
(Hapus baris ini kalau kerja sendiri)

---

### Cara Menjalankan Aplikasi
1. Clone repository ini.
2. Buka terminal dan jalankan:
   ```bash
   npm install
   npx expo start --clear