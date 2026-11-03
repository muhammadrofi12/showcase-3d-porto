---
name: Ruang Karya
description: Gallery portofolio berskylight dengan overlay editorial dan kota Jakarta ilustratif.
colors:
  paper: "#f7f5eeef"
  ink: "#33372e"
  muted: "#6e7265"
  rust: "#a34c34"
  sky: "#d7d9cf"
  dialog: "#f5f3eb"
  control: "#e8e7dc"
  primary-text: "#fffdf3"
  primary-hover: "#484f3f"
  selected-text: "#fffdf2"
  divider: "#d8d9cd"
  image-bed: "#deddd2"
  gallery-wall: "#e5dfd1"
  gallery-floor: "#c9c2b2"
  gallery-roof: "#c6bfb0"
  skylight: "#f3f2e8"
  artwork-frame: "#49493f"
typography:
  display:
    fontFamily: "Georgia, serif"
    fontSize: "58px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-1.7px"
  headline:
    fontFamily: "Georgia, serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-1.5px"
  room-title:
    fontFamily: "Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.8px"
  card-title:
    fontFamily: "Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    lineHeight: 1.9
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 600
    letterSpacing: "1.7px"
rounded:
  paper: "2px"
  square: "0px"
  marker: "50%"
spacing:
  mobile-inset: "16px"
  desktop-inset: "30px"
  wide-inset: "40px"
  room-padding: "25px"
  catalog-gap-row: "36px"
  catalog-gap-column: "25px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.square}"
    padding: "15px 19px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#fff"
  paper-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
  icon-button:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    width: "44px"
    height: "44px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.selected-text}"
    padding: "9px 12px"
---

# Design System: Ruang Karya

## Overview

**Acuan visual: gallery netral berskylight, overlay Framer, kota Jakarta.** Ini merangkum keputusan pemilik yang sudah mengikat, bukan identitas baru. Karya dan ruang 3D menjadi pusat pengalaman; informasi hadir sebagai kertas hangat dengan tipografi editorial. Komposisi overlay mengikuti referensi Framer di `PRODUCT.md`; interior mengikuti `docs/references/user-gallery-interior.png`.

Dokumen merekam `src/style.css`, `src/main.tsx`, dan `src/Scene.tsx` pada 3 November 2026. Screenshot lokal yang ditinjau: `output/desktop-city.png`, `output/desktop-room.png`, dan `output/mobile-catalog.png`. Kota masih berupa geometri prosedural ilustratif. Acuan fotografis interior bukan klaim fidelity yang sudah tercapai; screenshot bukan sertifikasi FPS perangkat fisik.

**Karakter utama:**

- Kertas hangat, tinta hijau gelap, dan aksen bata.
- Serif editorial pada judul, sans serif pada informasi ringkas.
- Dinding krem, lantai netral serta aksen kayu hangat pada Lobby (`00`) dan Ruang AI (`04`), portal antarruang, bangku tengah, rak kayu tiga tingkat (3–3–2), meja resepsi, papan denah dinding 3D, buku katalog 3D, serta lima siluet karakter manusia (1 petugas berlanyard dan 4 pengunjung).
- Bingkai gelap dan bidang penyangga netral dengan warna serta rasio gambar karya yang tetap terbaca.

## Colors

Palet antarmuka mengikuti material interior yang hangat. Nilai frontmatter merupakan hasil ekstraksi, bukan pengganti variabel CSS sumber.

### Primary

- **Rust:** aksen bata pada label, posisi aktif denah, status, hover, fokus, dan seleksi teks. Tombol utama memakai tinta gelap.

### Neutral

- **Paper:** overlay transparan tipis; pertahankan kanal alpha variabel `--paper`.
- **Ink / muted:** teks utama dan pendukung, dengan variasi hijau abu lokal untuk metadata.
- **Dialog / control / image-bed:** latar modal, tombol ikon, dan bidang screenshot.
- **Sky:** warna dasar canvas sekaligus kabut kota.
- **Gallery-wall / gallery-floor / gallery-roof / skylight:** material ruang netral; pencahayaan memengaruhi warna hasil render.
- **Artwork-frame:** pemisah gelap antara gambar dan dinding.

**Aturan warna karya.** Tekstur karya memakai sRGB dan material tanpa tone mapping; pertahankan warna gambar, bukan menyamakannya dengan material bangunan.

## Typography

**Judul:** Georgia, serif. **Informasi dan kontrol:** Inter lokal, Arial, sans-serif. **Tulisan dunia 3D:** Syne Regular lokal, ditetapkan di scene. Georgia memberi karakter editorial melalui bobot normal dan italic; Inter menjaga pemisahan navigasi dan metadata dari karya.

- **Display:** token display menjadi 64px mulai 1700px, 48px sampai 900px, dan 43px sampai 600px.
- **Headline:** judul dialog memakai token headline; katalog mobile 35px, detail 38px/34px, tentang 55px/43px.
- **Room title:** token room-title menjadi 28px pada mobile.
- **Card title:** token card-title menjadi 18px pada mobile; caption karya memakai 23px/19px.
- **Body:** token body untuk deskripsi detail. Informasi ruang memakai 12px, line-height 1.75, maksimum lebar 230px; mobile 11px.
- **Label:** token label untuk eyebrow. Navigasi memakai 10px, tracking 1.4px, huruf kapital. Metadata lain berkisar 8–11px; ini catatan implementasi, bukan sertifikasi keterbacaan universal.

## Layout

Canvas mengisi 100dvh, minimum tinggi 450px atau 400px pada mobile. Desktop menempatkan identitas kiri atas, navigasi kanan atas, informasi ruang kiri, caption karya bawah tengah, denah kanan bawah, dan kontrol perjalanan di bawah. Komposisi ini mengikuti referensi pemilik.

Inset desktop memakai desktop-inset, berubah ke wide-inset mulai 1700px dan mobile-inset sampai 600px. Panel ruang selebar 280px, panel masuk 310px, dan mobile 215px. Denah awal 151px, dapat diperluas menjadi 250px; mobile merangkumnya sebagai tombol dan membuka panel 240px.

Katalog desktop memiliki ruang luar 32px, maksimum lebar 1450px, padding 42px 48px, dan grid tiga kolom. Sampai 900px grid menjadi dua kolom. Mobile tetap dua kolom dengan jarak 27px 14px, padding 25px 20px, dan modal memenuhi layar. Gambar memakai object-fit contain; rasio bidang 1.45 pada desktop dan 1.2 pada mobile. Detail memiliki dua kolom (1.15fr / 1fr), menjadi satu kolom sampai 900px.

Ambang perilaku berbeda dari CSS: lebar awal di bawah 768px atau preferensi reduced motion membuka katalog terlebih dahulu, kemudian pengunjung memilih masuk 3D. Navigasi desktop disembunyikan sampai 600px.

## Elevation & Depth

Kedalaman utama berasal dari perspektif 3D, bayangan bangunan, bingkai, portal, dan kabut. Kertas hampir datar; modal memiliki pemisahan lebih kuat. Blur hanya dipakai pada backdrop dialog.

- **Kertas:** `0 6px 24px #33372e0a`.
- **Dialog:** `0 22px 100px #17201440`, backdrop `#262e26a6`, blur 5px.
- **Marker karya:** `0 2px 10px #0002`.

Scene memakai ambient, hemisphere, directional, serta titik cahaya hangat di interior. Mode ringan menonaktifkan bayangan dan memakai DPR 1; mode tinggi membatasi DPR sampai 1.5. Ini konfigurasi yang diterapkan, belum pengukuran perangkat fisik.

## Shapes

Panel kertas bersudut hampir siku, sesuai token paper. Tombol utama, filter, input, dan bidang gambar berbentuk persegi. Lingkaran digunakan untuk marker karya dan indikator kecil. Divider tipis memisahkan tindakan dan metadata tanpa membingkai setiap blok.

Bangunan memakai bidang datar dan portal persegi. Kota memakai blok gedung, jalan, zebra cross, pepohonan, kendaraan sederhana, dan penanda skyline bergaya Monas. Ini komposisi Jakarta ilustratif, bukan replika geografis.

## Components

### Buttons

Tombol utama memakai tinta gelap, teks terang, dan panah. Hover mengganti latar ke primary-hover dan teks putih. Tautan serta tombol teks berubah ke rust saat hover. Fokus memakai outline rust 2px dengan offset 5px; disabled memakai opacity 0.3. Tombol ikon dialog berukuran 44px persegi.

### Paper panels and navigation

Identitas, navigasi, informasi ruang, caption karya, denah, dan kontrol perjalanan memakai material kertas bersama. Navigasi desktop berupa label kapital; mobile menyediakan tombol katalog. Caption karya dan marker bernomor membuka detail yang sama. Status karya serta label demo tetap terlihat ketika relevan.

### Catalog cards and filters

Kartu berupa gambar, judul serif, metadata, dan panah, tanpa panel bertingkat. Hover gambar memakai skala 1.025 dalam 0.4s. Filter aktif memakai tinta dengan teks terang; filter mobile memiliki tinggi minimum 44px. Pencarian memakai garis bawah, latar transparan, sudut siku, dan caret rust. Hasil kosong menyediakan reset.

### Dialogs

Katalog, detail, dan tentang memakai dialog HTML dengan tombol tutup. Detail menggabungkan screenshot utuh, navigasi gambar, deskripsi, status, teknologi, dan tautan case study. Catatan demo dan visual AI adalah informasi konten.

### Spatial navigation

Kamera mengikuti titik pandang terarah, tersinkron dengan ruang, caption, dan denah. Tombol perjalanan, wheel, swipe vertikal, dan keyboard pada area pengalaman mengubah titik pandang; drag membatasi pandangan sekitar. Interpolasi kamera memakai `1 - exp(-delta * 3.2)`, dihilangkan pada reduced motion. Animasi dan transisi CSS juga dihentikan pada reduced motion. Render dijeda ketika dialog terbuka atau dokumen tersembunyi.

## Do's and Don'ts

- **Do** pertahankan overlay Framer, interior netral berskylight, serta konteks Jakarta yang telah dipilih pemilik.
- **Do** gunakan gambar karya dengan proporsi utuh dan warna asli.
- **Do** pertahankan sinkronisasi ruang, caption karya, dan denah.
- **Do** sediakan katalog dan detail HTML ketika scene gagal atau pengunjung memilih reduced motion.
- **Don't** menyebut kota prosedural sebagai replika geografis atau hasil fotorealistis.
- **Don't** menghapus label prototipe, pengujian, data demo, atau keterangan visual AI untuk kepentingan tampilan.
- **Don't** mengubah screenshot lokal menjadi klaim FPS, kesiapan perangkat fisik, atau fidelity acuan fotografis.
