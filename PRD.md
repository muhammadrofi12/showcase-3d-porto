# PRD — 3D Portfolio Gallery

| Atribut | Nilai |
| --- | --- |
| Versi | 0.1 |
| Tanggal | 3 November 2026 |
| Status | Draft kebutuhan produk; siap menjadi dasar desain dan prototipe |
| Pemilik | Muhammad Rofi'ul Arham |
| Workspace | `C:\Belajar_Pemograman\Project\3d-gallery` |
| Sumber portofolio | `C:\Belajar_Pemograman\Project\rofiull` |
| Kanal publikasi | Subdomain tersendiri; alamat final belum ditentukan |

## 1. Ringkasan produk

Website ini merupakan showcase portofolio berbentuk gallery 3D dan eksperimen pengembangan pengalaman spasial di browser. Pengunjung mendekati bangunan gallery di lingkungan kota yang terinspirasi Jakarta, masuk ke ruang pamer, melihat screenshot atau mockup proyek sebagai karya berbingkai, lalu membuka informasi dan tautan detail proyek.

Pengalaman menggabungkan tiga acuan yang berbeda fungsi:

1. **Dunia luar:** gallery berada di tengah lingkungan kota Jakarta.
2. **Arsitektur interior:** ruang pamer terbuka dengan skylight, dinding netral, bangku panjang, dan karya di dinding, mengikuti gambar interior dari pemilik.
3. **Komposisi antarmuka:** identitas, navigasi, informasi ruang, informasi karya, denah, serta kontrol pendukung mengikuti referensi Framer.

Portofolio utama tetap menjadi sumber case study lengkap. Showcase ini menambah cara baru untuk menikmati karya dan menunjukkan eksperimen teknis 3D.

### 1.1 Kebutuhan yang sudah dikonfirmasi

- Website merupakan showcase sekaligus eksperimen proyek 3D.
- Rencana publikasi berada di subdomain tersendiri.
- Isi awal berasal dari portofolio lokal `rofiull`.
- Gallery ditempatkan dalam konteks kota, dengan Jakarta sebagai acuan.
- Gambar interior yang diberikan pemilik menjadi referensi desain ruang pamer.
- Layout informasi, denah, dan bagian antarmuka tetap mengikuti screenshot referensi Framer terbaru.

### 1.2 Asumsi perencanaan

Hal berikut merupakan usulan draft, dapat disesuaikan sebelum implementasi:

- Eksplorasi awal mencakup satu blok kota, area masuk, lobby, dan tiga zona pamer dalam satu bangunan.
- Navigasi utama memakai jalur kamera terarah dengan scroll, drag untuk menoleh, tombol perpindahan, dan denah interaktif.
- Delapan proyek unggulan dipamerkan di ruang 3D; seluruh 19 proyek tersedia melalui katalog.
- Bahasa awal antarmuka adalah Indonesia, dengan judul proyek mengikuti sumber.
- Kota memakai pendekatan arsitektural semi-realistis yang dioptimalkan; akurasi geografis penuh belum menjadi kebutuhan.

## 2. Masalah dan tujuan

Daftar proyek konvensional sudah tersedia pada portofolio utama. Peluang produk ini adalah menyajikan karya tersebut melalui perjalanan ruang yang berkesan, sekaligus menjadi hasil eksperimen teknologi 3D yang dapat dibuka langsung melalui browser.

Tujuan MVP:

- Menghasilkan pengalaman kota → bangunan gallery → ruang pamer yang terasa menyambung.
- Membantu pengunjung memahami proyek dan membuka case study tanpa kehilangan orientasi.
- Menjaga komposisi informasi dan denah seperti referensi meskipun lingkungan 3D berbeda.
- Menyediakan cara mengakses konten ketika 3D tidak tersedia atau tidak nyaman digunakan.
- Memungkinkan pembaruan karya melalui data terstruktur tanpa menata ulang seluruh scene.

Ukuran keberhasilan yang diusulkan: dalam uji tugas terhadap lima pengunjung baru, sedikitnya empat orang dapat masuk ke gallery, memilih karya, membuka detail, dan kembali menjelajah tanpa bantuan. Angka ini merupakan target validasi, belum hasil pengujian.

## 3. Audiens dan kebutuhan utama

| Audiens yang dihipotesiskan | Kebutuhan |
| --- | --- |
| Pengunjung portofolio umum | Menikmati pengalaman dan memahami karya yang dipamerkan |
| Rekruter atau calon klien | Cepat menemukan proyek, peran pemilik, teknologi, dan case study |
| Developer atau desainer | Melihat eksperimen interaksi, ruang, serta penyajian karya |
| Pemilik gallery | Memperbarui gambar, ringkasan, urutan, dan status proyek |

Prioritas pengalaman adalah eksplorasi karya. Informasi teknis tetap mudah ditemukan melalui panel dan tautan portofolio utama.

## 4. Referensi dan arahan desain

### 4.1 Bukti referensi

- [Website Framer](https://3d-gallery.framer.website/): ditinjau melalui browser desktop pada 3 November 2026. Teramati tampilan luar bangunan, perpindahan melalui scroll, petunjuk drag untuk menoleh, informasi ruang/karya, denah, navigasi atas, dan kontrol suara.
- [Tangkapan eksterior Framer](docs/references/framer-exterior-desktop.png).
- [Tangkapan interior dan layout Framer](docs/references/framer-interior-desktop.png): juga ditegaskan pemilik sebagai acuan layout informasi dan denah.
- [Gambar interior dari pemilik](docs/references/user-gallery-interior.png): acuan arsitektur dan suasana interior.

Peninjauan ini menjadi bukti komposisi desktop dan pengalaman yang teramati. Perilaku mobile, fungsi seluruh menu, dan teknologi renderer internal referensi belum diverifikasi.

### 4.2 Dunia luar: gallery di Jakarta

Gallery menjadi bangunan utama dalam potongan lingkungan kota. Jalan, trotoar, vegetasi, dan massa gedung memberi konteks urban; fasad gallery serta pintu masuk tetap mudah dikenali.

Usulan adegan pembuka: kamera dari sudut agak tinggi memperlihatkan gallery dan lingkungan sekitarnya, kemudian bergerak mendekati plaza dan pintu masuk. Transisi berikutnya membawa pengunjung ke lobby dan ruang pamer tanpa pergantian gaya visual yang mendadak.

Ciri Jakarta dapat disampaikan melalui skyline, karakter jalan/trotoar, vegetasi tropis, dan elemen transportasi sebagai latar. Pemilihan kawasan atau landmark spesifik masih terbuka. Jika landmark digunakan, penempatannya harus konsisten dengan konsep lokasi yang dipilih. Scene tidak boleh menyiratkan gallery memiliki alamat fisik nyata.

MVP yang diusulkan membatasi kota sebagai konteks dan area kedatangan. Simulasi lalu lintas kompleks serta eksplorasi seluruh kota berada di luar cakupan awal.

### 4.3 Interior: ruang pamer arsitektural

- Ruang memiliki dinding netral hangat, struktur plafon yang terbaca, dan skylight besar.
- Cahaya siang, bayangan lembut, serta variasi material memberi kedalaman tanpa membuat karya sulit dilihat.
- Bangku panjang menjadi elemen penanda ruang; penempatannya menyisakan jalur kamera yang lapang.
- Screenshot dan mockup proyek ditempatkan pada bingkai di dinding atau bidang pamer yang sesuai proporsinya.
- Skala manusia ditunjukkan melalui tinggi pintu, bingkai, bangku, dan posisi kamera.
- Marker bernomor menghubungkan karya dengan panel informasi. Marker yang tertutup dinding atau terlalu jauh tidak boleh tetap melayang di depan layar.
- Jumlah karya tidak dibuat padat semata-mata untuk memenuhi dinding. Jarak dan sudut pandang harus memungkinkan karya dikenali.

Target visual adalah arsitektur yang meyakinkan dengan material dan cahaya yang efisien untuk web. Fidelity final ditetapkan setelah prototipe performa.

### 4.4 Layout antarmuka: mengikuti Framer

Bagian di bawah merupakan lapisan antarmuka yang tetap terbaca di atas scene 3D. Posisi dapat beradaptasi pada mobile, dengan fungsi yang sama.

| Bagian | Posisi desktop | Isi dan perilaku |
| --- | --- | --- |
| Identitas | Kiri atas | Nama/wordmark pemilik; tombol kembali ke tampilan awal |
| Navigasi utama | Kanan atas | Usulan menu: Ruang, Tentang, Portofolio, Kontak |
| Informasi ruang | Kiri atas, di bawah identitas | Nomor/nama ruang, kategori karya, rentang tahun bila relevan, tombol Katalog |
| Informasi karya aktif | Tengah bawah | Judul proyek, tahun, kategori/status, tindakan Lihat proyek |
| Denah gallery | Kanan bawah | Bentuk ruang, ruang aktif, posisi kamera secara sederhana, titik perpindahan |
| Petunjuk interaksi | Bawah tengah, saat dibutuhkan | Scroll untuk menjelajah; drag untuk menoleh; menghilang setelah dipahami |
| Kontrol suara | Kiri bawah | Opsional pada tahap lanjutan; jika tersedia, kondisi awal mati |
| Akses katalog/versi 2D | Terlihat dalam navigasi/kontrol | Dapat dibuka tanpa menunggu perjalanan kamera selesai |

Informasi karya dan petunjuk bawah tidak boleh saling menutupi. Saat karya aktif, petunjuk dipindahkan atau disembunyikan. Denah dan panel informasi merupakan kebutuhan inti MVP, bukan dekorasi tambahan.

Menu toko dan guestbook dari referensi tidak diperlukan untuk fungsi portofolio saat ini. Kebutuhan yang dipertahankan adalah struktur komposisinya, lalu label dan tujuan menu disesuaikan dengan konten pemilik.

## 5. Struktur ruang dan kurasi konten

### 5.1 Urutan pengalaman

`Kota / plaza → pintu masuk → 00 Lobby & Reception → ruang 01 → ruang 02 → ruang 03 → ruang 04 (AI Product Visuals) → area penutup`

Semua ruang dapat dipilih langsung dari menu atau denah. Pengunjung tidak wajib menyelesaikan seluruh rute untuk menemukan satu proyek.

| Area usulan | Fungsi | Konten awal usulan |
| --- | --- | --- |
| Kota dan plaza | Memperkenalkan tempat dan bangunan | Identitas gallery, aksi Masuk gallery |
| 00 — Lobby & Reception | Orientasi, sambutan petugas, denah fisik, buku katalog | Papan denah 3D, meja resepsi, buku katalog 2 koleksi, petugas & pengunjung |
| 01 — Products & Systems | Menampilkan proyek aplikasi dan sistem | OCS EDU, Rekyndness, BangunKarya Pro |
| 02 — Applied Experiments | Menampilkan AI, IoT, dan simulasi | Veyra Vision, TalkBuddy AI, VOLTX |
| 03 — Web & Interface | Menampilkan pengalaman web dan UI | Our Creative Solution, Blade & Crown |
| 04 — AI Product Visuals | Menampilkan eksplorasi visual produk berbantuan AI | 8 visual unik pada rak tiga tingkat (susunan 3–3–2) & tautan katalog |
| Area penutup | Menghubungkan eksperimen dengan profil pemilik | Portofolio lengkap, GitHub, LinkedIn, email |

Nama ruang dan delapan proyek tersebut merupakan usulan kurasi. Satu proyek dapat memiliki beberapa kategori, tetapi hanya satu penempatan utama di rute MVP.

### 5.2 Inventaris sumber yang tersedia

Sumber lokal memuat **19 proyek**: OCS EDU; Rekyndness; TalkBuddy AI; Veyra Vision; Our Creative Solution; FAWRA Cloth; Agrofy; Web Wimala; Warung Bude App; DevMaps; Wipala App; GreenSort Platform; BangunKarya Pro; Blade & Crown; VOLTX; Movie App; IoT Attendance System; Landing Page Sport Store; dan Web Covid.

Terdapat 71 import gambar pada data portofolio, seluruh path ditemukan saat peninjauan, dengan total ukuran file sekitar 8,91 MB desimal sebelum optimasi. Jumlah ini bukan ukuran paket gallery yang sudah jadi; beberapa gambar lebih besar dari 1 MB sehingga perlu turunan berukuran sesuai pemakaian.

### 5.3 Aturan isi dan kejujuran visual

- Ambil judul, tahun, teknologi, ringkasan, gambar, dan tautan dari sumber portofolio.
- Ringkas teks untuk kebutuhan gallery tanpa mengubah arti atau menambah klaim hasil.
- OCS EDU diberi konteks proyek mandiri yang masih dalam pengujian sesuai sumber saat ini.
- Veyra Vision mempertahankan status prototipe dan label data demo/mockup yang disunting dengan AI untuk gambar terkait. Gambar manajemen kameranya dijelaskan sebagai screenshot lingkungan pengujian.
- Our Creative Solution sebagai proyek company profile tetap terpisah dari OCS EDU.
- VOLTX diberi konteks simulator; prototype Figma ditautkan sebagai prototype, bukan aplikasi produksi.
- Tautan yang tercantum di sumber belum berarti tujuan masih aktif. Verifikasi URL sebelum publikasi.
- Gambar dipasang dengan rasio asli atau turunan yang disiapkan; tangkapan layar penting tidak diregangkan atau dipotong sampai fitur utamanya hilang.

## 6. Alur pengguna

### 6.1 Kunjungan pertama

1. Halaman menampilkan identitas, preview lingkungan kota, serta pilihan Masuk gallery dan Buka katalog.
2. Proses pemuatan menginformasikan status secara jujur; konten dasar tetap dapat dibuka.
3. Pengunjung memilih Masuk gallery atau mulai scroll setelah scene siap.
4. Kamera mendekati bangunan dan lobby. Denah memperlihatkan lokasi dan ruang aktif.
5. Pengunjung mengikuti rute atau memilih ruang langsung.

### 6.2 Menjelajahi dan membuka karya

1. Scroll memajukan atau memundurkan posisi kamera pada jalur yang disiapkan.
2. Drag mengubah arah pandang dalam batas aman; tidak menggeser posisi bebas menembus geometri.
3. Marker, bingkai, atau entri katalog dapat dipilih untuk membuka detail proyek.
4. Panel detail memperlihatkan gambar, ringkasan, peran bila tersedia, teknologi, tahun, status, serta tautan.
5. Pengunjung membuka case study di portofolio utama atau menutup detail.
6. Setelah detail ditutup, posisi kamera, ruang, karya aktif, dan fokus kembali ke titik sebelumnya.

### 6.3 Navigasi lewat denah

Denah menunjukkan lobby dan ruang pamer dengan hubungan yang masuk akal terhadap bangunan. Memilih ruang mengaktifkan titik pandang awal ruang tersebut. Penanda aktif diperbarui saat pengunjung bergerak. Label dan daftar ruang dalam HTML menyediakan fungsi setara bagi pengguna keyboard dan pembaca layar.

### 6.4 Mode katalog dan perangkat terbatas

Katalog menampilkan seluruh proyek dalam layout 2D dengan kategori dan detail yang sama. Saat memilih karya unggulan, pengguna dapat membuka detail langsung atau menuju lokasinya di gallery bila 3D tersedia. Proyek di luar kurasi ruang hanya membuka detail.

MVP mobile menggunakan katalog sebagai tampilan awal yang ringan, dengan pilihan eksplisit Masuk 3D. Ini merupakan usulan yang perlu dibuktikan saat uji perangkat. Ketika reduced motion aktif, katalog menjadi tampilan awal pada semua perangkat; jika pengguna memilih 3D, perpindahan antartitik dilakukan tanpa perjalanan kamera panjang.

## 7. Kebutuhan fungsional

Prioritas: **P0** wajib MVP; **P1** peningkatan setelah MVP; **P2** eksplorasi lanjutan.

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-01 | Scene kota dan bangunan gallery | P0 | Lingkungan urban terinspirasi Jakarta terbaca; pintu masuk dan gallery menjadi fokus |
| FR-02 | Ruang pamer 3D | P0 | Ada kedalaman, geometri ruang, bingkai, skylight, dan pencahayaan; karya terbaca dari titik pandang yang disiapkan |
| FR-03 | Navigasi terarah | P0 | Scroll, drag, tombol ruang, dan input keyboard dapat dipakai; kamera tetap dalam jalur/batas yang ditentukan |
| FR-04 | Denah interaktif | P0 | Ruang aktif dan lokasi diperbarui; setiap ruang bisa dipilih melalui denah atau daftar HTML setara |
| FR-05 | Informasi ruang | P0 | Panel kiri sesuai ruang aktif; informasi tidak tertinggal ketika berpindah lewat denah |
| FR-06 | Karya dan marker | P0 | Delapan karya unggulan mempunyai gambar, label, serta target pilih yang jelas dan tidak menembus dinding secara visual |
| FR-07 | Panel detail proyek | P0 | Dapat dibuka dari scene maupun katalog; penutupan mengembalikan lokasi dan fokus |
| FR-08 | Katalog seluruh proyek | P0 | Seluruh 19 entri tersedia tanpa perjalanan 3D; kategori berasal dari data yang dinormalisasi |
| FR-09 | Tautan portofolio dan kontak | P0 | Case study, profil, dan kontak menggunakan URL terverifikasi; aksi menuju situs lain diberi label jelas |
| FR-10 | Loading dan pemulihan gagal | P0 | Kegagalan renderer/aset tidak memblokir katalog; ada pesan, pilihan coba lagi, serta akses mode 2D |
| FR-11 | Mobile dan reduced motion | P0 | Konten, denah/daftar ruang, dan detail dapat digunakan pada layar kecil tanpa drag wajib |
| FR-12 | URL karya yang dapat dibagikan | P1 | URL membuka detail karya yang sama setelah refresh; slug stabil tidak berubah hanya karena judul diperbarui |
| FR-13 | Audio suasana kota/gallery | P1 | Mulai dalam kondisi mati; hanya diputar setelah tindakan pengguna; kontrol dapat diakses keyboard |
| FR-14 | Bahasa Indonesia/Inggris | P1 | Bahasa informasi dan label konsisten; terjemahan sumber digunakan jika tersedia |
| FR-15 | Jalan bebas di area kota | P2 | Memerlukan rancangan kontrol, collision, dan pengujian performa tersendiri |

Navigasi wajib menyediakan alternatif selain gesture: tombol Ruang sebelumnya/berikutnya dan daftar ruang. Shortcut panah hanya aktif ketika area scene memiliki fokus; tidak mengambil alih input di panel detail atau kontrol lain.

### 7.1 Panel detail

Desktop dapat memakai panel samping atau dialog yang memberi ruang cukup untuk gambar. Mobile memakai panel penuh dengan scroll konten. Pilihan bentuk final ditentukan saat desain, dengan perilaku wajib berikut:

- Judul, tahun, kategori, ringkasan, gambar, teknologi, dan status proyek dapat dibaca.
- Tombol Tutup selalu mudah ditemukan; Escape menutup dialog.
- Fokus tetap di dalam dialog selama terbuka, lalu kembali ke pemicu.
- Input pada panel tidak menggerakkan kamera. Latar tidak ikut scroll ketika dialog mengambil alih layar.
- URL demo/repository yang tidak tersedia tidak menghasilkan tombol kosong.

### 7.2 Keadaan khusus

| Keadaan | Perilaku yang diharapkan |
| --- | --- |
| Scene/aset sedang dimuat | Preview atau latar ringan, teks status, akses katalog tetap tersedia; jangan menampilkan persentase fiktif |
| Salah satu gambar gagal | Placeholder berlabel dan informasi proyek tetap tampil; proyek lain tetap dapat dibuka |
| Renderer tidak tersedia atau gagal dibuat | Beralih ke katalog dengan pesan singkat dan pilihan mencoba 3D lagi |
| Context grafis hilang saat menjelajah | Hentikan scene, simpan karya/ruang aktif bila mungkin, tawarkan pemulihan atau katalog |
| Pemuatan lama | Setelah ambang usulan 10 detik, perjelas pilihan lanjut ke katalog; konten tidak dipaksa menunggu |
| Filter katalog tanpa hasil | Pesan tidak ada hasil dan tombol reset filter |
| Kumpulan data kosong | Tampilkan informasi gallery dan pesan belum ada karya; hindari ruang tanpa penjelasan |
| Resize/orientasi berubah | Panel menata ulang; kamera dan karya aktif tidak ter-reset tanpa alasan |
| Tab tidak aktif | Hentikan rendering kontinu dan audio bila kelak tersedia; lanjutkan tanpa lonjakan kamera |

## 8. Kebutuhan nonfungsional

### 8.1 Performa

Budget berikut adalah target rancangan yang harus diukur pada prototipe, bukan klaim performa saat ini:

- Kontrol dasar dan jalur katalog dapat dipakai dalam sekitar 3 detik pada simulasi koneksi Fast 4G dengan cache kosong.
- Unduhan awal menuju scene pertama ditargetkan maksimal 5 MB terkompresi; hindari memuat seluruh gambar resolusi penuh sekaligus.
- Target gerak kamera: median sekitar 50–60 FPS di laptop dengan GPU terintegrasi; minimal sekitar 30 FPS di Android kelas menengah pada kualitas rendah.
- Profil perangkat, browser, viewport, kondisi jaringan, FPS, dan ukuran transfer dicatat saat pengujian agar angka dapat diulang.
- Tekstur detail dimuat saat diperlukan. Ruang terdekat diprioritaskan; kota jauh memakai geometri sederhana.
- Bayangan, resolusi render, dan efek pascaproses dibatasi oleh preset kualitas. Render berhenti atau dikurangi ketika tidak ada perubahan.
- Pencahayaan prahitung atau pendekatan setara diprioritaskan jika bayangan dinamis mengganggu budget.

Jika prototipe tidak mencapai budget, sederhanakan kota, material, atau resolusi sebelum memperluas ruang dan efek. Hindari efek grain berat sebagai syarat visual awal; tekstur dan cahaya harus tetap baik tanpa efek tersebut.

### 8.2 Aksesibilitas dan responsivitas

- Semua fungsi utama memiliki kontrol HTML dengan nama yang jelas dan fokus terlihat.
- Isi proyek tersedia di DOM; teks penting tidak hanya dirender sebagai tekstur atau berada di canvas.
- Hormati [preferensi reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). Perpindahan kamera otomatis panjang dihindari ketika preferensi tersebut aktif.
- Teks antarmuka memiliki kontras yang memadai; panel informasi diberi permukaan yang menjaga keterbacaan di atas scene terang maupun gelap.
- Target interaksi sentuh diusulkan minimal 44 × 44 CSS px; angka marker dapat tampil lebih kecil dengan area tekan yang cukup.
- Layout diuji pada lebar 360, 390, 768, 1366, dan 1920 CSS px serta zoom 200% untuk antarmuka.
- Pada mobile, panel kiri menjadi panel ringkas; denah menjadi tombol yang membuka panel denah/daftar ruang. Identitas, aksi katalog, dan Tutup tetap mudah dijangkau.
- Jika 3D mobile diaktifkan, satu jari dipakai untuk scroll perjalanan dan gesture menoleh harus memiliki area/modus eksplisit agar kedua aksi tidak bertabrakan. Tombol navigasi tetap menjadi alternatif.

### 8.3 Konten publik, SEO, dan privasi

- Judul, deskripsi, preview sosial, identitas pemilik, dan tautan portofolio tersedia sebagai HTML awal.
- Katalog sebaiknya dapat diprarender sehingga konten inti tetap terbaca ketika renderer 3D gagal. Pilihan tooling ditetapkan setelah stack dipilih.
- Domain gallery memiliki canonical sesuai URL gallery, sementara tautan case study tetap mengarah ke portofolio utama.
- MVP tidak membutuhkan akun pengunjung, upload publik, database pengguna, atau formulir kontak server.
- Kontak memakai tautan email/LinkedIn yang sudah tersedia. Analytics belum menjadi kebutuhan; bila ditambahkan, tujuan pengukuran dan konfigurasi privasinya ditentukan tersendiri.
- Aset publik tidak memuat data pribadi klien atau kredensial. Label demo yang ada dipertahankan.

## 9. Pengelolaan konten dan arah teknis

Stack implementasi awal telah dipilih setelah diskusi dan instruksi eksekusi pemilik. Cakupan hasil lokal serta cara menjalankan tercantum pada `README.md`.

### 9.1 Rekomendasi awal

Stack implementasi awal adalah React dan Vite untuk antarmuka, TypeScript untuk kontrak konten, serta Three.js melalui React Three Fiber dan Drei untuk dunia 3D. CSS mengatur overlay, SVG mengatur denah. React Three Fiber merupakan renderer React untuk Three.js sebagaimana dijelaskan pada [dokumentasi resminya](https://r3f.docs.pmnd.rs/getting-started/introduction). Versi dependency dikunci dalam `package-lock.json`.

Penggunaan Framer tidak diwajibkan oleh referensi. Persyaratan produknya adalah pengalaman spasial dan komposisi antarmuka yang disepakati. Rendering scene dan lapisan informasi perlu dipisahkan agar katalog, denah, dan dialog tetap berfungsi secara mandiri.

MVP diusulkan sebagai situs statis tanpa backend. Lingkungan kota dan ruang awal dapat dibangun dengan geometri sederhana dan model teroptimasi; pipeline model/material ditentukan pada prototipe visual.

### 9.2 Sumber dan alur pembaruan

1. Inventaris konten dari `rofiull/src/data/portofolioData.js` dan gambar terkait.
2. Kurasi proyek, ringkas teks, verifikasi status/tautan, lalu simpan snapshot data dan aset yang diperlukan di repository gallery.
3. Buat turunan gambar untuk thumbnail, bingkai 3D, dan panel detail.
4. Kaitkan proyek ke ruang melalui data penempatan terpisah dari metadata proyek.
5. Preview lokal, cek kualitas gambar/tautan/status, lalu bangun ulang situs.

Build gallery harus mandiri: tidak membaca path absolut komputer pemilik dan tidak membutuhkan folder `rofiull` pada hosting. Pembaruan awal dilakukan secara manual terkontrol; sinkronisasi otomatis dan CMS dapat dirancang kemudian.

| Entitas | Data minimum |
| --- | --- |
| Project | ID/slug stabil, judul, ringkasan, kategori, tahun, teknologi, status, cover, gambar, alt text, caption/label demo, URL case study, tautan opsional, featured |
| Room | ID, nomor/nama, deskripsi, urutan, daftar penempatan karya, titik masuk, koordinat denah |
| Placement | ID proyek, ID ruang, posisi/orientasi bingkai, rasio gambar, titik pandang, nomor marker |
| Site | Identitas pemilik, tautan portofolio/kontak, bahasa awal, konfigurasi kualitas, metadata |

Data yang tidak tersedia tetap opsional atau ditandai perlu editorial; jangan mengisi status, peran, atau hasil proyek dengan asumsi. Slug case study lama mengikuti utilitas sumber saat migrasi dan disimpan eksplisit agar tautan tidak berubah karena judul gallery disingkat.

## 10. Batas cakupan

### Termasuk MVP

Satu lingkungan kota terbatas, satu bangunan gallery, lobby, tiga zona pamer, delapan karya unggulan, katalog seluruh proyek, denah interaktif, informasi ruang/karya, panel detail, tautan portofolio/kontak, dukungan keyboard/mobile, reduced motion, serta pemulihan ketika 3D gagal.

### Setelah MVP

Audio suasana, bahasa kedua, URL karya yang dapat dibagikan, lebih banyak karya/ruang, penyesuaian kualitas lebih lanjut, dan alat pembaruan konten yang lebih nyaman.

### Di luar cakupan awal

Open world Jakarta, pemetaan kota akurat, kendaraan/NPC kompleks, multiplayer, avatar pengguna, login, VR, e-commerce, gift shop, guestbook publik, backend CMS, serta pembangunan ulang seluruh fitur portofolio utama.

## 11. Tahap pengerjaan dan gerbang validasi

| Tahap | Hasil yang dibuat | Syarat lanjut |
| --- | --- | --- |
| 1. Kurasi dan konsep | Pilihan proyek/aset, sketsa blok kota, layout ruang, komposisi overlay | Acuan kota, interior, panel informasi, dan denah terwakili dengan jelas |
| 2. Prototipe teknis | Satu potongan kota, satu ruang, satu karya, kamera, panel informasi, denah minimum | Gerak, pembacaan karya, dan budget perangkat terukur; pendekatan render layak |
| 3. Dunia dan navigasi | Kota/plaza, lobby, tiga zona, rute kamera, denah aktif, daftar ruang | Semua lokasi dapat dicapai tanpa tersesat atau menembus geometri |
| 4. Konten dan ketahanan | Delapan karya, katalog 19 proyek, detail, fallback, keyboard/mobile | Alur utama dan keadaan gagal dapat diselesaikan |
| 5. Validasi dan publikasi | Hasil uji perangkat/tugas, build produksi, metadata, konfigurasi domain | Kriteria penerimaan lulus; URL final dan kesiapan publikasi ditetapkan |

Estimasi waktu ditentukan setelah tahap prototipe mengukur kebutuhan aset kota, pencahayaan, dan performa. Publikasi serta pengaturan DNS belum dilakukan dalam pekerjaan PRD ini.

## 12. Kriteria penerimaan rilis awal

- [ ] Dunia 3D menampilkan gallery dalam konteks kota yang terinspirasi Jakarta.
- [ ] Interior membawa ciri referensi: ruang terbuka, skylight, material netral, bangku tengah, dan karya berbingkai.
- [ ] Komposisi desktop memuat identitas kiri atas, navigasi kanan atas, informasi ruang di kiri, informasi karya di bawah, serta denah kanan bawah.
- [ ] Denah menunjukkan ruang aktif dan dapat digunakan untuk berpindah; daftar ruang memberi fungsi setara.
- [ ] Pengunjung dapat masuk, menjelajah, memilih karya, membuka detail, dan kembali dengan posisi serta fokus terjaga.
- [ ] Delapan karya unggulan terpasang dan seluruh 19 proyek tersedia di katalog; semua aset/tautan yang dipublikasikan sudah diperiksa.
- [ ] Status OCS EDU, prototipe Veyra Vision, label demo, dan konteks simulator/prototype dipertahankan.
- [ ] Keyboard, mobile, dialog, dan reduced motion diuji; gesture bukan satu-satunya cara navigasi.
- [ ] Renderer gagal, context hilang, dan gambar gagal ditangani tanpa menghilangkan akses ke konten.
- [ ] Target performa diuji dengan profil perangkat dan hasil dicatat; gap yang masih terbuka dinyatakan jelas.
- [ ] Build berjalan tanpa ketergantungan ke path lokal repository portofolio.
- [ ] Kunjungan ke subdomain final menggunakan HTTPS dan metadata/tautan sesuai; bukti lokal dibedakan dari hasil hosting publik.

## 13. Risiko dan keputusan terbuka

| Risiko / keputusan | Penanganan atau pilihan berikutnya |
| --- | --- |
| Kota dan pencahayaan terlalu berat | Buktikan satu blok dan satu ruang lebih dahulu; sederhanakan geometri/tekstur sebelum menambah efek |
| Pengunjung bingung mengendalikan kamera | Petunjuk singkat, tombol perpindahan, denah, daftar ruang, dan katalog yang selalu terjangkau |
| Overlay memenuhi layar kecil | Panel ringkas, denah dalam panel terpisah, detail penuh, dan prioritas informasi berdasarkan konteks |
| Isi gallery berbeda dari portofolio utama | Snapshot sumber diberi tanggal; status, caption, dan tautan diperiksa pada setiap pembaruan |
| Fidelity gambar interior terlalu mahal untuk web | Gunakan referensi untuk bentuk, material, cahaya, dan komposisi; ukur hasil renderer pada perangkat sasaran |
| Nama gallery dan subdomain | Belum ditetapkan; nama dokumen adalah judul kerja |
| Kawasan Jakarta dan landmark | Belum ditetapkan; usulan awal satu blok urban fiktif yang terinspirasi Jakarta |
| Cakupan kota | Usulan MVP sebagai konteks/area kedatangan; jalan bebas memerlukan perluasan cakupan |
| Kurasi, nama ruang, dan bahasa awal | Usulan draft pada bagian 5 dan 1.2; diselesaikan sebelum produksi konten |
| Hosting dan perangkat uji fisik | Belum dipilih final; stack aplikasi telah diimplementasikan dan pemeriksaan browser lokal tercatat di README |

## 14. Catatan sumber

Dokumen disusun dari arahan pemilik, observasi browser atas referensi Framer, gambar interior yang diberikan pemilik, serta sumber lokal portofolio pada 3 November 2026. File utama yang diperiksa: `src/data/portofolioData.js`, `src/constants/index.js`, `src/App.jsx`, `src/services/portfolioService.js`, `src/utils/slug.js`, `src/pages/PortofolioDetailPage.jsx`, `src/index.css`, `index.html`, dan `package.json` di repository `rofiull`.

Status proyek dan jumlah aset di sini berasal dari materi portofolio yang tersedia. Dokumen ini belum menjadi bukti bahwa produk-produk tersebut diuji ulang, link eksternal aktif, performa gallery tercapai, atau website gallery sudah diimplementasikan.
