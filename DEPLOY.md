# Deploy DailyQuest (Web + HP)

Repo: https://github.com/Retsudent/DailyQuest

## A. Deploy Web (Vercel) — 5 menit

1. Buka https://vercel.com/new
2. Import GitHub repo **Retsudent/DailyQuest**
3. Framework: **Next.js** (auto-detect)
4. Tambahkan **Environment Variables**:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Connection string PostgreSQL (Neon/Supabase/Railway) |
| `NEXTAUTH_SECRET` | Random string (min 32 char) |
| `NEXTAUTH_URL` | URL production, contoh `https://daily-quest-xxx.vercel.app` |

5. Klik **Deploy**
6. Setelah deploy, buka **Settings → Environment Variables** dan pastikan `NEXTAUTH_URL` sama persis dengan domain final (termasuk `https://`).
7. **Redeploy** sekali setelah env benar.

### Database (wajib)

Gunakan PostgreSQL cloud gratis, misalnya:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)

Jalankan migration (dari komputer lokal):

```bash
# set DATABASE_URL di .env ke DB production
npx prisma migrate deploy
```

Opsional seed:

```bash
node prisma/seed.js
```

---

## B. Install di HP (PWA)

1. Buka URL production di **Chrome (Android)** atau **Safari (iOS)**
2. Login / register
3. **Android**: Menu ⋮ → *Install app* / *Add to Home screen*
4. **iOS**: Share → *Add to Home Screen*

---

## C. APK Android (Capacitor)

Setelah web live, update `capacitor.config.json` → `server.url` ke URL Vercel kamu.

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```

Di Android Studio: **Build → Generate Signed Bundle / APK** untuk upload Play Store.

---

## Troubleshooting

- **Login gagal di production**: `NEXTAUTH_URL` harus match domain Vercel.
- **Build gagal Prisma**: pastikan `DATABASE_URL` sudah di-set di Vercel sebelum build.
- **PWA tidak muncul install**: harus HTTPS (Vercel otomatis) dan buka dari browser, bukan iframe.
