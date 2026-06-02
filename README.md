# DailyQuest

DailyQuest adalah aplikasi produktivitas bergaya RPG berbasis Next.js.
Project ini sudah disiapkan untuk:

- berjalan di web (deploy di Vercel),
- installable sebagai PWA di HP/desktop,
- dan bisa dilanjutkan ke APK/iOS app via Capacitor.

## 1) Jalankan Lokal

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## 2) Deploy Web ke Vercel

1. Push project ke GitHub.
2. Import repository di [Vercel](https://vercel.com/new).
3. Set Environment Variables di Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (isi URL production, contoh `https://dailyquest.vercel.app`)
4. Deploy.

Setelah deploy sukses, app otomatis bisa diakses dari web.

## 3) Install sebagai Aplikasi di HP (PWA)

PWA sudah aktif di project ini (manifest + service worker).

- **Android (Chrome)**: buka website > menu > `Add to Home screen`.
- **iPhone (Safari)**: buka website > Share > `Add to Home Screen`.

App akan tampil seperti aplikasi native (standalone mode).

## 4) Publish ke Play Store / App Store (opsional)

Karena app ini Next.js (SSR + API), mobile build memuat **URL production** di WebView native:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
set CAPACITOR_SERVER_URL=https://YOUR-APP.vercel.app
npx cap add android
npx cap add ios
npx cap sync
npx cap open android
```

Lanjutkan signing di Android Studio (`.aab`) / Xcode untuk iOS.

## Catatan Penting Production

- Gunakan database production (PostgreSQL) yang stabil.
- Pastikan URL callback auth mengarah ke domain production.
- Jalankan migration sebelum go-live.
