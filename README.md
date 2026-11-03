# Ruang Karya

Showcase portofolio 3D Muhammad Rofi'ul Arham, dengan kota ilustratif terinspirasi Jakarta, ruang penyambutan (`00 — Lobby & Reception`), tiga ruang pamer proyek software (`01–03`), ruang khusus `04 — AI Product Visuals`, karakter petugas dan pengunjung museum, serta antarmuka informasi/denah mengikuti referensi pada `docs/references/`.

## Menjalankan

```sh
npm ci
npm run dev
```

Buka URL yang ditampilkan Vite. Untuk build produksi: `npm run build`, lalu `npm run preview`.

## Yang tersedia

- Lingkungan kota, bangunan dengan skylight, `00 — Lobby & Reception`, tiga ruang proyek software (`01–03`), `04 — AI Product Visuals`, serta ruang penutup `05 — Guestbook`.
- Lobby penyambutan dengan papan denah dinding 3D di sisi kiri, meja resepsionis kayu di sisi kanan, buku katalog 3D interaktif (`Katalog Ruang Karya`), petugas resepsi dengan gestur sambutan, serta sudut pandang cepat (`Pandangan denah`, `Meja katalog`).
- Lima karakter manusia berskala proporsional (1 petugas resepsi berlanyard + 4 pengunjung di Lobby, Ruang 01, Ruang 02, dan Ruang 04) dengan arah pandang akurat (`lookAtTarget`) menghadap karya/denah masing-masing, menghormati mode ringan dan `prefers-reduced-motion`.
- Musik latar ambient museum prosedural dan efek suara interaksi (`src/audio.ts`) dengan kontrol tombol `SOUND ON` / `SOUND OFF` di kiri bawah.
- Transisi mata berkedip (`blink-overlay`) saat melompat antarruang melalui denah atau menu navigasi.
- Ruang penutup `05 — Guestbook` dengan sorot lampu hangat pada tulisan dinding `"Thank you for visiting"`, buku tamu 3D terbuka lengkap dengan pena di bagian depan, serta formulir `Sign the guestbook` di panel kiri yang menambahkan catatan pengunjung ke halaman buku 3D.
- Delapan karya software unggulan di Ruang 01–03 dengan marker, serta delapan karya unik `AI Product Visuals` pada rak kayu tiga tingkat (susunan 3–3–2) di Ruang 04 yang mempertahankan rasio asli gambar.
- Katalog dua koleksi: **Proyek Software (19 proyek)** dengan filter/pencarian dan **AI Product Visuals (8 visual)** beserta tautan katalog eksternal (`https://lynk.id/rofiull`).
- Scroll atau tombol untuk berpindah titik (`01 / 10`), drag untuk menoleh (dengan pelindung klik-vs-drag sehingga geseran kamera tidak memicu klik objek 3D). Tombol panah bekerja ketika area gallery mendapat fokus. Di layar sentuh, swipe vertikal berpindah titik; drag horizontal menoleh.
- Mode ringan, katalog awal pada mobile/reduced motion, pemuatan 3D setelah masuk pada mobile, penghentian rendering di belakang dialog/tab tidak aktif, pemulihan fokus saat dialog ditutup, serta fallback jika renderer gagal.

## Stack dan konten

React 19, TypeScript, Vite, Three.js, React Three Fiber, Drei, Lucide, CSS, dan SVG untuk denah. Scene diorganisasikan ke dalam modul `src/Scene.tsx` serta komponen `src/components/Lobby.tsx`, `FloorPlanBoard.tsx`, `ReceptionDesk.tsx`, `CatalogBook.tsx`, `Visitor.tsx`, dan `AiVisualRoom.tsx`.

`src/content.ts` mengatur data ruang (`plaza`, `00`–`04`), penempatan karya, titik kamera, dan koleksi secara terpusat. `src/data/projects.json` dan `src/data/ai-visuals.json` merupakan snapshot portofolio lokal; `public/artworks/` dan `public/ai-visuals/` berisi gambar WebP hasil optimasi (termasuk turunan tekstur rak `*-shelf.webp` dan gambar detail resolusi lebih tinggi). Website dapat dibangun mandiri tanpa repository portofolio asli.

Untuk memperbarui snapshot secara sengaja:

```powershell
node scripts/import-portfolio.mjs 'C:\Belajar_Pemograman\Project\rofiull'
```

Periksa perubahan teks, status, gambar demo, dan URL sebelum publikasi. Status OCS EDU, konteks visual demo Veyra, dan label karya berbantuan AI dipertahankan pada antarmuka.

## Pemeriksaan

Jalankan dev server pada port 5173, kemudian `node scripts/smoke.mjs`. Skrip memakai Chrome lokal melalui Playwright, menguji masuk lobby (`00`), sudut pandang papan denah & meja katalog, sapaan petugas, pelindung drag-vs-klik, pembukaan buku katalog dua koleksi (19 proyek software + 8 visual AI), navigasi ruang `01–04`, detail proyek & detail visual AI beserta pemulihan fokus, empty state, context-loss fallback, mobile (`390×844`), dan reduced motion. Screenshot dan hasil tersimpan di `output/` (diabaikan Git).

Build TypeScript/produksi (`npm run build`) dan smoke test terverifikasi secara lokal. Performa pada perangkat fisik, angka FPS/budget PRD pada berbagai hardware, serta subdomain produksi belum diverifikasi.

## Cakupan versi saat ini

Ruang Karya adalah nama kerja. Kota dan karakter memakai geometri prosedural sederhana yang efisien untuk web. Audio, berbagi URL per proyek, bahasa kedua, CMS, chat NPC interaktif, transaksi toko, dan eksplorasi kota bebas belum termasuk implementasi ini.
