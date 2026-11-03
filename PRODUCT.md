# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, Vite, Three.js melalui React Three Fiber, Drei, CSS, dan SVG. Pemilik menyetujui eksekusi setelah rekomendasi stack. Scene awal memakai geometri prosedural; Blender/GLB merupakan opsi pengembangan aset berikutnya. Hosting belum diputuskan final.

## Product Purpose

Website showcase portofolio Muhammad Rofi'ul Arham sekaligus eksperimen proyek 3D. Direncanakan berada di subdomain tersendiri. Portofolio utama tetap menjadi rujukan detail proyek.

## Users

Pengunjung portofolio. Rekruter, calon klien, dan sesama developer merupakan hipotesis audiens untuk perencanaan, belum merupakan hasil riset pengguna.

## Operating Context

Workspace: `C:\Belajar_Pemograman\Project\3d-gallery`. Sumber konten dan aset: `C:\Belajar_Pemograman\Project\rofiull`.

## Capabilities and Constraints

- Pengunjung menjelajahi gallery 3D yang memamerkan proyek portofolio pemilik melalui `00 — Lobby & Reception`, tiga ruang proyek software (`01–03`), serta `04 — AI Product Visuals`.
- Lobby menampilkan papan denah dinding 3D di kiri, meja resepsionis kayu di kanan, buku katalog 3D interaktif (`Katalog Ruang Karya`), petugas resepsi, dan empat pengunjung museum tersebar di area pamer.
- Ruang 04 menyajikan 8 karya unik `AI Product Visuals` pada rak kayu tiga tingkat (susunan 3–3–2) yang menjaga rasio asli gambar, terhubung dengan katalog dua koleksi (19 Proyek Software & 8 AI Product Visuals).
- Gallery berada dalam konteks lingkungan kota, dengan Jakarta sebagai acuan yang diberikan pemilik.
- Layout antarmuka mengikuti referensi Framer: identitas/navigasi, informasi ruang, informasi karya, denah, dan kontrol pendukung di atas dunia 3D.
- Interior mengacu pada gambar gallery yang diberikan pemilik: ruang terbuka, skylight, dinding netral, bangku tengah, serta karya berbingkai.
- Nama kerja implementasi adalah Ruang Karya. Subdomain, fidelity final kota, dan perluasan eksplorasi kota belum diputuskan. Kebutuhan produk tercantum dalam `PRD.md`; cakupan implementasi lokal tercantum dalam `README.md`.

## Brand Commitments

Tambahan kebutuhan pemilik: aktivitas warga dan lalu lintas sederhana di lingkungan Jakarta; kamera dapat menoleh horizontal 360°; Monas dipindah ke seberang depan museum (di belakang arah pandangan awal); taman Monas menjadi acuan lingkungannya. Suasana dapat dipilih dari pagi ke malam dengan slider. Batas kota disamarkan kabut halus, dan langit menampilkan matahari, bulan, bintang, serta awan. Implementasi tetap berupa showcase ilustratif dengan jalur kamera terarah.


- Referensi pengalaman dan layout: https://3d-gallery.framer.website/.
- Referensi interior dari pemilik: `docs/references/user-gallery-interior.png`.
- Referensi posisi informasi dan denah: `docs/references/framer-interior-desktop.png`.
- Kota dan interior merupakan bagian dunia 3D; antarmuka informasi tetap mengikuti komposisi referensi Framer.

## Evidence on Hand

Peninjauan sumber lokal pada 3 November 2026 menemukan 19 proyek dalam `rofiull/src/data/portofolioData.js` serta 71 import gambar yang seluruh path-nya tersedia. Ini membuktikan ketersediaan materi portofolio, bukan status operasional atau hasil pengujian masing-masing produk. OCS EDU dicatat sedang diuji; Veyra Vision dicatat sebagai prototipe dengan visual demo.

## Product Principles

- Dunia 3D dan karya menjadi pusat pengalaman; navigasi dan informasi mendukung eksplorasi.
- Isi gallery bersumber dari proyek nyata pemilik, dengan status dan label demo yang jujur.
- Portofolio utama dan showcase 3D memiliki fungsi yang saling melengkapi.
- Keputusan yang belum disepakati tetap dinyatakan sebagai usulan.
