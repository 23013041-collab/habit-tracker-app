# Nama Aplikasi
My Targets: Agent Mission Tracker

## Deskripsi Aplikasi
**My Targets** adalah aplikasi produktivitas berbasis gamifikasi yang mengubah kebiasaan sehari-hari (Habit) menjadi "Misi Agen" yang harus diselesaikan. Aplikasi ini dibuat sebagai Proyek Akhir mata kuliah Mobile Programming.

Aplikasi ini memiliki dua keunggulan utama:
1.  **Antarmuka Modern (UI/UX):** Mengusung tema *Dark Mode* dengan gaya "Secret Agent" yang menampilkan dashboard "My Targets", statistik "Success Rate", dan daftar misi harian.
2.  **Sistem Notifikasi Handal (Background Service):** Menggunakan integrasi khusus ke Android AlarmManager. Fitur ini memastikan notifikasi pengingat ("Wake Up Agent") tetap masuk dan menyalakan layar HP meskipun aplikasi telah ditutup paksa (*Kill App*) atau HP dalam keadaan terkunci (*Deep Sleep*).

**Fitur Utama:**
* **Mission Dashboard:** Memantau jumlah target pending dan persentase keberhasilan.
* **Smart Reminder:** Notifikasi dengan prioritas tinggi yang anti-kill.
* **Persistensi Data:** Misi tersimpan aman secara lokal di perangkat.

## Anggota Kelompok
1. Efraim Dotulong - 23013041
2. Waraney M.K. Wantania - 23013044
3. Geren Ruauw - 23013025
4. Georley Wagiu - 23013003

---

### 🛠️ Teknologi yang Digunakan
* **Framework:** React Native (Expo SDK)
* **Storage:** AsyncStorage
* **Notifications:** Expo Notifications (Custom Channel ID)
* **UI Design:** Custom Dark Theme (Agent Style)

---

### 🚀 Cara Menjalankan Aplikasi

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/USERNAME_GITHUB/NAMA_REPO.git](https://github.com/USERNAME_GITHUB/NAMA_REPO.git)
    ```

2.  **Install Dependencies**
    Masuk ke folder project dan install library:
    ```bash
    npm install
    ```

3.  **Jalankan Server**
    Gunakan perintah clear cache agar aset UI termuat sempurna:
    ```bash
    npx expo start --clear
    ```

4.  **Scan QR Code**
    Buka aplikasi **Expo Go** di Android dan scan QR code yang muncul.

---

### 🧪 Cara Pengujian Fitur "Anti-Kill Notification"
Untuk mendemokan ketahanan notifikasi aplikasi ini:
1.  Buat Misi Baru dan atur waktu pengingat (misal: 1 menit lagi).
2.  **Matikan Aplikasi:** Tekan tombol Home, buka Recent Apps, lalu buang aplikasi (Swipe Up/Force Close).
3.  **Matikan Layar:** Kunci layar HP (Lock Screen).
4.  **Hasil:** Tepat pada waktunya, notifikasi akan tetap masuk, berbunyi, dan menyalakan layar HP.
