# Rencana Pengembangan — Lobby, Pengunjung, dan AI Product Visuals

Tanggal: 3 November 2026  
Status: **Selesai diimplementasikan & divalidasi secara lokal**  
Proyek: Ruang Karya / 3D Portfolio Gallery

## 1. Tujuan

Mengembangkan gallery yang sudah ada menjadi pengalaman museum yang memiliki ruang penyambutan, beberapa pengunjung, dan ruang khusus AI Product Visuals. Layout overlay tetap mengikuti referensi Framer: identitas dan navigasi di atas, informasi ruang di kiri, informasi karya di bawah, serta denah interaktif di kanan bawah.

Dokumen ini merupakan tambahan terhadap `../PRD.md`. Seluruh daftar pekerjaan di bawah adalah pekerjaan mendatang. Penyusunan rencana tidak mengubah implementasi aplikasi.

## 2. Kebutuhan yang dikonfirmasi dan usulan

| Bagian | Permintaan pemilik | Usulan implementasi |
| --- | --- | --- |
| Pengunjung | Ada beberapa orang sedang melihat karya; tidak terlalu ramai | Empat pengunjung dan satu petugas untuk keseluruhan museum |
| Ruang pertama | Lobby seperti referensi gambar 1 | Ruang penyambutan tersendiri sebelum ruang pamer pertama |
| Denah fisik | Denah dipajang pada dinding seperti gambar 2 | Papan denah di dinding kiri, konsisten dengan minimap layar |
| Penyambut tamu | Ada karyawan yang menyambut pengunjung | Petugas di meja resepsionis kanan, dengan gestur sambutan ringan |
| Buku katalog | Buku katalog museum dapat diklik | Buku 3D di atas meja yang membuka katalog HTML |
| Ruang AI Product | Ruang khusus karya AI Product Visuals milik pemilik | Ruang 04 setelah tiga ruang portofolio yang sudah ada |
| Susunan AI Product | Karya berjajar seperti rak pada gambar 3 | Tiga tingkat rak horizontal dengan delapan karya, susunan 3–3–2 |

Jumlah karakter, urutan ruang AI, serta susunan 3–3–2 merupakan usulan yang dapat disesuaikan. Arah visual dan fungsi utama mengikuti permintaan pemilik.

## 3. Susunan ruang

```text
Kota / halaman
      │
      ▼
00 — Lobby & Reception
      │  Denah dinding · Petugas · Buku katalog
      ▼
01 — Products & Systems
      │
      ▼
02 — Applied Experiments
      │
      ▼
03 — Web & Interface
      │
      ▼
04 — AI Product Visuals
      │  Rak pamer · Detail visual · Katalog eksternal
      ▼
Area penutup / portofolio & kontak
```

Lobby harus terbaca sebagai ruang pertama dengan fungsi penyambutan. Kamera tidak langsung melewati pintu masuk menuju bingkai proyek. Jalan masuk dari kota, pintu bangunan, lobby, dan ruang 01 harus tersambung secara fisik.

Nomor ruang yang sudah ada tetap 01–03; lobby memakai 00 dan ruang AI memakai 04. Halaman luar menggunakan identitas tersendiri tanpa nomor ruang pamer.

## 4. Lobby penyambutan

### 4.1 Komposisi ruang

```text
                 DINDING BELAKANG LOBBY
             Nama museum + kalimat sambutan
                    ┌───────────┐
                    │ Ke ruang 01│
                    └───────────┘

   ┌────────────────┐                  ┌────────────────┐
   │ Denah di dinding│                  │ Petugas        │
   │ + daftar ruang  │                  │ Meja resepsi   │
   └────────────────┘                  │ Buku katalog   │
                                       └────────────────┘
        Pengunjung
                     Area kamera / jalur masuk

                         PINTU MASUK
```

- Dinding depan pengunjung memuat identitas museum dan portal menuju ruang 01.
- Denah besar berada di dinding kiri dengan nomor, nama ruang, dan penanda posisi lobby.
- Meja resepsionis berada di sisi kanan, menyisakan jalur tengah yang lapang.
- Buku katalog berada di atas meja, dalam jangkauan pandang dan interaksi kamera.
- Petugas berdiri di belakang atau di samping meja, menghadap arah kedatangan.
- Satu pengunjung dapat berdiri dekat papan denah tanpa menutup tulisan.

### 4.2 Material dan pencahayaan

Lobby mengambil suasana hangat dari referensi terbaru: lantai kayu, dinding netral bertekstur halus, meja kayu, dan sorot cahaya pada identitas museum serta denah. Skylight tetap menjadi bagian bahasa arsitektur gallery.

Prioritas pencahayaan adalah membuat papan denah, wajah/siluet petugas, buku, dan pintu lanjutan mudah dikenali. Area gelap tidak boleh menyembunyikan objek interaktif. Penerapan material baru difokuskan terlebih dahulu pada lobby dan ruang AI agar perubahan terukur.

### 4.3 Perjalanan kamera

1. Dari halaman, kamera mendekati pintu masuk.
2. Kamera berhenti pada sudut lebar yang menunjukkan denah, meja, petugas, dan portal sekaligus.
3. Pengunjung dapat memilih denah, buku katalog, atau tombol Lanjut ke ruang 01.
4. Scroll/tombol berikutnya melanjutkan perjalanan ke ruang pamer pertama.

Titik pandang opsional di dalam lobby: pandangan denah dan pandangan meja katalog. Keduanya harus dapat dicapai melalui tombol, sehingga pengguna tidak wajib melakukan drag presisi.

## 5. Denah dinding dan denah layar

Denah dinding merupakan bagian fisik dari scene 3D. Minimap kanan bawah tetap berfungsi sebagai alat navigasi yang selalu mudah dijangkau.

- Keduanya bersumber dari satu data ruang yang sama.
- Menampilkan lobby dan empat ruang pamer dengan urutan serta hubungan pintu yang benar.
- Papan fisik memakai tulisan cukup besar, kontras, dan dapat dilihat dari titik pandang denah.
- Klik papan fisik membuka tampilan denah yang lebih mudah dibaca; daftar ruang HTML menyediakan navigasi keyboard dan mobile.
- Memilih ruang membawa kamera ke titik masuk ruang tersebut dan memperbarui panel informasi.
- Perpindahan antar lokasi jauh menggunakan lompatan terkontrol atau transisi singkat yang tidak memperlihatkan kamera menembus dinding.
- Jumlah ruang, label, posisi penanda, dan total titik perjalanan tidak lagi ditentukan oleh angka tetap di komponen UI.

## 6. Petugas dan pengunjung

### 6.1 Karakter visual

Gunakan karakter manusia sederhana dengan kepala, badan, lengan, dan kaki seperti siluet pada referensi. Warna pakaian netral, proporsi konsisten, dan skala sesuai tinggi pintu serta meja. Detail wajah tidak diperlukan untuk tahap ini.

Petugas memiliki pembeda kecil, misalnya lanyard atau warna pakaian yang sedikit berbeda. Karakter merupakan bagian dari pemandangan museum; mereka tidak mewakili jumlah pengunjung nyata website.

### 6.2 Penempatan yang diusulkan

| Karakter | Lokasi | Pose / perilaku |
| --- | --- | --- |
| Petugas | Meja resepsionis | Menghadap kedatangan; gestur menyambut satu kali ketika kamera masuk lobby |
| Pengunjung 1 | Dekat denah lobby | Memperhatikan papan denah |
| Pengunjung 2 | Ruang 01 | Berdiri menyamping mengamati salah satu karya |
| Pengunjung 3 | Ruang 02 atau 03 | Melihat karya dari jarak wajar |
| Pengunjung 4 | Ruang AI Product Visuals | Mengamati rak dari samping |

### 6.3 Batas gerak dan interaksi

- Posisi tubuh tetap pada titik yang sudah disiapkan; belum ada sistem berjalan bebas/pathfinding.
- Gerak kecil boleh berupa napas, sedikit menoleh, atau perpindahan berat badan.
- Petugas tidak memulai dialog otomatis yang menghalangi eksplorasi.
- Sapaan singkat dapat muncul saat petugas dipilih: “Selamat datang. Silakan lihat denah atau buka katalog museum.”
- Pengunjung tidak menghalangi bingkai, marker, papan, buku, pintu, atau lintasan kamera.
- Tidak ada hotspot pada pengunjung dekoratif agar mereka tidak disangka tombol.
- Reduced motion menghentikan gestur dan animasi idle. Mode ringan mengurangi animasi dan bayangan karakter.

## 7. Buku katalog interaktif

### 7.1 Objek di scene

- Buku diletakkan terbuka atau sedikit miring di meja resepsionis.
- Sampul/halaman bertuliskan “Katalog Ruang Karya”.
- Hover atau fokus menampilkan penanda Buka katalog; seluruh buku memiliki area klik yang cukup besar.
- Tersedia tombol HTML dengan aksi yang sama di panel lobby untuk keyboard dan mobile.
- Gerakan drag kamera tidak boleh dianggap sebagai klik buku ketika pointer dilepas.

### 7.2 Perilaku ketika dibuka

Klik buku membuka katalog museum yang sudah tersedia, dengan dua koleksi:

| Koleksi | Isi | Bentuk detail |
| --- | --- | --- |
| Proyek Software | 19 proyek yang sudah ada | Ringkasan, teknologi, status, gambar, dan tautan case study |
| AI Product Visuals | 8 visual dari portofolio | Gambar besar, judul/caption bila tersedia, label karya berbantuan AI, dan tautan katalog |

Pembukaan awal dari buku menampilkan pengantar singkat museum dan pilihan koleksi. Tombol katalog umum tetap dapat membuka koleksi yang terakhir digunakan.

Tidak diperlukan simulasi membalik halaman 3D pada tahap pertama. Buku merupakan pintu masuk visual; pembacaan isi menggunakan antarmuka HTML agar cepat dan nyaman.

Saat katalog terbuka, kamera berhenti menerima input. Tombol Tutup/Escape mengembalikan kamera ke posisi sebelumnya dan fokus ke pemicu yang relevan.

## 8. Ruang 04 — AI Product Visuals

### 8.1 Sumber konten yang telah diperiksa

Repository portofolio `C:\Belajar_Pemograman\Project\rofiull` memuat:

- `src/data/productAiData.js`: delapan entri gambar.
- `src/assets/portofolio/product-ai/product-ai-1.webp` hingga `product-ai-8.webp`: path aset yang diimpor oleh data.
- `src/components/ProductAiSection.jsx`: penyajian dua baris visual serta tautan katalog `https://lynk.id/rofiull`.

Data saat ini berupa daftar gambar, belum memuat judul individual, prompt, tanggal, harga, atau klien. Metadata tersebut tidak boleh diisi dengan klaim buatan. Pada implementasi, periksa keberadaan/resolusi gambar dan tautan katalog, lalu gunakan label sementara “AI Product Visual 01” sampai “08” jika judul editorial belum diberikan.

Delapan visual ini merupakan koleksi tambahan, bukan delapan proyek software baru. Jumlah proyek software tetap 19.

### 8.2 Susunan rak

```text
          AI PRODUCT VISUALS

       [ 01 ]     [ 02 ]     [ 03 ]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Rak atas

       [ 04 ]     [ 05 ]     [ 06 ]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Rak tengah

            [ 07 ]     [ 08 ]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Rak bawah

          Area melihat karya
                           Pengunjung
```

- Tiga rak kayu horizontal mengikuti referensi gambar 3.
- Visual berdiri sebagai cetakan berbingkai tipis atau papan display di atas rak.
- Rasio gambar asli dipertahankan; beri margin/bidang penyangga bila perlu, sehingga kemasan atau komposisi produk tidak terpotong.
- Jarak antarkarya memungkinkan tiap visual dikenali secara mandiri.
- Sorotan hangat diarahkan ke dinding rak. Intensitasnya tidak boleh membuat gambar putih berlebihan atau warna produk berubah jauh.
- Pengunjung ditempatkan di sisi rak, bukan tepat di depan karya.
- Semua delapan karya unik ditampilkan sekali; tidak menduplikasi gambar untuk mengisi rak.

### 8.3 Interaksi karya

1. Kamera masuk pada sudut lebar yang memperlihatkan ketiga rak.
2. Memilih gambar atau entri katalog membuka detail visual.
3. Detail menyediakan gambar besar, nomor/judul, caption yang terverifikasi, dan tombol Sebelumnya/Berikutnya.
4. Tombol Lihat katalog lengkap mengarah ke tautan eksternal dari sumber setelah diverifikasi.
5. Menutup detail mengembalikan posisi dan fokus ke karya yang dipilih.

Panel kiri memakai judul “AI Product Visuals” dengan deskripsi singkat tentang eksplorasi visual produk menggunakan AI. Ruang ini adalah ruang pamer; fitur pembayaran, keranjang, harga, dan transaksi toko tidak masuk cakupan tambahan ini.

## 9. Rencana perubahan teknis

Implementasi akan tetap menggunakan stack yang sudah dipakai. Tidak diperlukan backend atau engine karakter tambahan untuk cakupan ini.

| Bagian | Perubahan yang direncanakan |
| --- | --- |
| `src/content.ts` | Tambahkan ID stabil untuk halaman, lobby, dan ruang 01–04; pisahkan data ruang, titik kamera, dan koleksi |
| `src/Scene.tsx` | Integrasikan lobby, perpanjangan ruang AI, karakter, buku, papan denah, dan rak |
| Komponen scene baru | Usulan pemisahan `Lobby`, `Visitor`, `ReceptionDesk`, `CatalogBook`, `FloorPlanBoard`, dan `AiVisualRoom` agar scene mudah dirawat |
| Data AI baru | Manifest visual berisi ID, sumber gambar, alt text, caption opsional, urutan rak, dan tautan koleksi |
| Import aset | Tambahkan alur impor/optimasi AI visuals dari sumber lokal; build gallery tetap mandiri |
| `src/main.tsx` | Panel lobby/AI, katalog dua koleksi, detail visual AI, serta navigasi berdasarkan data ruang |
| Denah SVG | Bentuk dan penanda mengikuti data lobby + empat ruang; hapus pemetaan koordinat dan indeks ruang yang ditulis tetap |
| Kontrol perjalanan | Hitung total titik secara dinamis, sediakan titik lebar lobby/AI, jaga kembali ke lokasi setelah dialog |
| `src/style.css` | Penyesuaian tab koleksi, detail visual, petunjuk objek, serta panel mobile |
| Pengujian | Perbarui ekspektasi jumlah ruang/titik, tambah skenario buku, AI visuals, fokus, dan reduced motion |
| Dokumentasi | Selaraskan PRD, PRODUCT, DESIGN, dan README setelah implementasi benar-benar selesai |

Jumlah karakter dibatasi dan geometri/material dipakai bersama bila memungkinkan. Gambar AI memakai turunan tekstur sesuai ukuran tampilan; detail resolusi lebih tinggi baru dimuat saat dibuka. Lampu yang menghasilkan bayangan dipilih terbatas, bukan satu lampu bayangan untuk setiap visual.

## 10. Urutan pengerjaan

### Tahap 1 — Data dan susunan ruang

- [x] Periksa delapan file AI, rasio/resolusi, urutan, serta tautan katalog.
- [x] Tentukan denah lobby + empat ruang dan posisi meja/rak.
- [x] Ubah identitas ruang dan navigasi menjadi berbasis data.
- [x] Pertahankan akses ke seluruh proyek software yang sudah ada.

Hasil: denah dan titik kamera baru dapat diuji dengan geometri sederhana sebelum detail visual dibuat.

### Tahap 2 — Lobby dan katalog

- [x] Bangun lobby, portal, meja resepsionis, dan papan denah.
- [x] Pasang buku 3D yang dapat diklik.
- [x] Tambahkan koleksi Proyek Software dan AI Product Visuals ke katalog.
- [x] Pastikan buku, panel lobby, dan tombol katalog membuka pengalaman yang konsisten.

Hasil: perjalanan dari kota berhenti di lobby dan pengunjung dapat memilih cara menjelajah.

### Tahap 3 — Karakter

- [x] Buat satu model karakter sederhana yang dapat digunakan ulang.
- [x] Tempatkan satu petugas dan empat pengunjung sesuai denah.
- [x] Tambahkan gestur sambutan serta idle ringan.
- [x] Pastikan karakter tidak menutup karya atau menghalangi jalur kamera.

Hasil: museum terasa berpenghuni tanpa ramai dan tanpa sistem simulasi NPC yang kompleks.

### Tahap 4 — Ruang AI Product Visuals

- [x] Bangun ruang baru dan tiga rak kayu.
- [x] Tempatkan delapan visual dengan susunan awal 3–3–2.
- [x] Tambahkan titik pandang lebar, interaksi visual, dan panel detail.
- [x] Sambungkan ruang ke denah, navigasi, katalog, dan alur kembali.

Hasil: seluruh visual dapat dilihat dari scene 3D maupun katalog 2D.

### Tahap 5 — Material, pemeriksaan, dan dokumentasi

- [x] Rapikan kayu, tekstur dinding, sorotan lampu, dan skala karakter.
- [x] Periksa tampilan desktop/mobile dalam satu putaran screenshot.
- [x] Uji klik vs drag, keyboard, dialog, reduced motion, serta fallback renderer.
- [x] Bandingkan performa sebelum/sesudah pada profil pengujian yang sama.
- [x] Jalankan build dan smoke test yang diperbarui.
- [x] Perbarui dokumentasi dengan fitur yang sudah selesai dan batas validasinya.

## 11. Kriteria selesai

- [x] Pengunjung masuk ke lobby tersendiri sebelum ruang 01.
- [x] Lobby menampilkan papan denah, identitas museum, petugas, meja, dan buku katalog yang mudah ditemukan.
- [x] Buku dapat dibuka lewat klik/tap dan alternatif tombol keyboard; penutupan memulihkan fokus dan posisi kamera.
- [x] Denah fisik, minimap, daftar ruang, dan panel informasi konsisten.
- [x] Empat pengunjung dan satu petugas hadir pada lokasi yang direncanakan, dengan skala manusia yang masuk akal.
- [x] Karakter tidak menutup karya, objek interaktif, pintu, atau lintasan kamera.
- [x] Ruang AI memiliki delapan visual unik yang tersusun berjajar pada rak dan menjaga rasio gambar.
- [x] Katalog membedakan 19 proyek software dari 8 AI Product Visuals.
- [x] Visual AI dapat diperbesar dan dinavigasi tanpa metadata atau klaim komersial yang dibuat-buat.
- [x] Navigasi ke lobby/ruang AI dan perjalanan kembali tidak membuat kamera menembus geometri.
- [x] Mode ringan, reduced motion, mobile, dan katalog saat 3D gagal tetap bekerja.
- [x] Hasil build, uji browser, dan keterbatasan perangkat/performa dicatat sesuai bukti.

## 12. Batas pekerjaan

Rencana ini mencakup pengembangan lokal. Penentuan subdomain, deployment, transaksi katalog, chat dengan NPC, suara percakapan, multiplayer, serta simulasi pengunjung berjalan bebas tetap menjadi pekerjaan terpisah.

Permintaan terbaru pemilik adalah menyusun file rencana. Semua perubahan fitur pada dokumen ini menunggu instruksi implementasi berikutnya.
