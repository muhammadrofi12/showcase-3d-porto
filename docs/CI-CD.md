# CI & CD Pipeline — Ruang Karya 3D Gallery

Repositori ini menggunakan arsitektur pipeline terpisah (**Separation of Concerns**) dengan dua GitHub Actions workflow:
1. **`.github/workflows/ci.yml`**: Khusus pengujian & penjaminan mutu (**Continuous Integration**).
2. **`.github/workflows/deploy.yml`**: Khusus deployment ke Vercel (**Continuous Deployment**).

---

## 🔄 Pembagian Workflow

### 1. `ci.yml` — Continuous Integration (Build & Test)
* **Trigger**: Berjalan otomatis pada setiap `push` dan `pull_request` ke branch `main`.
* **Tahapan**:
  1. `actions/checkout@v4` & `actions/setup-node@v4` (Node 20 dengan caching npm).
  2. `npm ci` (Instalasi dependensi bersih).
  3. `npm run build` (Validasi tipe TypeScript dan build Vite).
  4. `npx playwright install --with-deps chromium` (Instalasi headless browser).
  5. `npm test` (Menjalankan E2E smoke test Playwright).
  6. `actions/upload-artifact@v4` (Menyimpan tangkapan layar pengujian desktop, mobile, katalog, dan transisi ke tab Artifacts selama 14 hari).

---

### 2. `deploy.yml` — Continuous Deployment (Vercel)
* **Trigger**: Berjalan pada `push` ke branch `main` (untuk Production) dan `pull_request` (untuk Preview).
* **Tahapan**:
  - **Pull Request**: Menghasilkan *preview deployment* dan otomatis mengirim komentar URL preview di PR.
  - **Push ke `main`**: Men-deploy *prebuilt artifact* ke domain produksi Vercel.

---

## 🔑 Konfigurasi Deployment Vercel

### Opsi A: Vercel GitHub App (Otomatis & Praktis)
Jika repositori GitHub Anda sudah dihubungkan saat membuat project di Vercel:
* `ci.yml` bertindak sebagai **Quality Gate** di GitHub.
* Vercel akan otomatis men-deploy setiap commit yang lolos uji CI.

### Opsi B: Vercel CLI via GitHub Secrets (Full Control di Actions)
Jika ingin deployment dikontrol langsung dari tab GitHub Actions:
1. Buat token di [Vercel Account Tokens](https://vercel.com/account/tokens).
2. Ambil `ORG_ID` dan `PROJECT_ID` dari dashboard Vercel (**Project Settings > General**) atau jalankan `npx vercel link`.
3. Buka GitHub: **Settings > Secrets and variables > Actions > New repository secret**:
   - `VERCEL_TOKEN`: Token API Vercel.
   - `VERCEL_ORG_ID`: User/Team ID Vercel.
   - `VERCEL_PROJECT_ID`: Project ID Vercel.

---

## 🧪 Pengujian Lokal
Untuk menguji hal yang sama di komputer lokal sebelum melakukan git push:
```bash
# Validasi build
npm run build

# Menjalankan pengujian E2E smoke test
npm test
```
