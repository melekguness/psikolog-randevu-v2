# Atakum Belediyesi Sağlık Portalı

Atakum Belediyesi Sağlık İşleri Müdürlüğü için vatandaş odaklı online randevu portalı. Ücretsiz psikolog ve diyetisyen randevusu; **vatandaş hesabı olmadan**, telefon + SMS doğrulamasıyla.

> Bu sürüm staj / portföy sunumu içindir. Gerçek SMS sağlayıcısı ve belediye production kimlik doğrulaması bağlı değildir.

## Özellikler

- Psikolog ve diyetisyen hizmet seçimi
- Uzman kadro listesi ve filtreleme
- Uygun tarih / saat seçimi (API + SQLite)
- Kişisel bilgi formu ve SMS doğrulama (mock)
- KVKK aydınlatma metni onayı
- Randevu özeti, onay ve başarı ekranı 
- Randevularımı Gör (telefon + SMS)
- Uzman paneli: kendi randevuları, durum güncelleme, saat kapatma
- İletişim bilgileri ve harita
- Erişilebilirlik: yazı boyutu, isteğe bağlı koyu tema

## Teknolojiler

- React 19 + TypeScript 5 + Vite
- Tailwind CSS 4, React Router 7, TanStack Query 5
- Express API + Node.js built-in SQLite (`node:sqlite`, `--experimental-sqlite`)

## Kurulum

```bash
npm install
npm run dev
```

- Web: [http://127.0.0.1:3030](http://127.0.0.1:3030)
- API: [http://127.0.0.1:3031](http://127.0.0.1:3031) 

## Sunum kimlik bilgileri

| Rol | Bilgi |
| --- | --- |
| SMS OTP | `123456` (gerçek SMS gönderilmez) |
| Örnek vatandaş telefonu | `0532 123 45 67` (API açılışında örnek randevular eklenir) |
| Uzman (psikolog) | `demo.psikolog@atakum.bel.tr` / `123456` |
| Uzman (diyetisyen) | `demo.diyetisyen@atakum.bel.tr` / `123456` |
| Uzman PIN (alternatif) | Birim → uzman seç → güvenlik kodu `1234` |

Geliştirme ortamında (`npm run dev`) formlarda **Örnek … doldur** yardımcıları görünür; üretim derlemesinde kapalıdır.

Uzman paneli: Header’daki **Uzman Girişi** → `/doktor` → `/doktor/panel`

## Mimari

```
Vatandaş / Uzman UI (Vite :3030)
        │  /api proxy
        ▼
   Express API (:3031)
        │
        ▼
   SQLite (appointments, blocked_slots, otp…)
```

Randevu ve kapalı saatler veritabanında tutulur. Mock SMS (`server/sms.ts`) ileride Twilio / Netgsm / İleti Merkezi ile değiştirilebilir.

## Sunumda 2 dakikalık sıra

1. Ana sayfa → **Randevu Al** → psikolog → uzman → saat → telefon → SMS `123456` → `ATK-…` kodu
2. Sayfayı yenile → randevunun kalıcı olduğunu göster (SQLite)
3. **Uzman Girişi** → psikolog demo hesabı → yalnızca kendi randevuları
4. **Müsaitlik Yönetimi** → bir saati kapat → vatandaş ekranında o saat yok
5. Aynı saate ikinci randevu denenemez (backend engeli)

## Build

```bash
npm run build
npm run preview
# Preview sırasında API de açık olmalı:
npm run start:api
```

## Notlar

- Gerçek SMS / belediye production API’si bağlı değildir; OTP sabittir (`123456`).
- Ortam değişkenleri için `.env.example` dosyasına bakın.
- `server/data/*.sqlite` git’e eklenmez.
- KVKK ve gizlilik metinleri kurumsal hukuk birimi onayı gerektirir.

## Teslim zip önerisi

Zip’e koymayın: `node_modules/`, `dist/`, `server/data/*.sqlite`. Alıcıda `npm install && npm run dev` yeterlidir.
