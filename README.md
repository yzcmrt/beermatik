# Beermatik 🍺

**React Native Bira Sayacı Uygulaması**

Beermatik, kullanıcıların bira tüketimini takip etmeleri ve unutmamaları için tasarlanmış profesyonel bir React Native uygulamasıdır.

## 🚀 Özellikler

### ✨ Ana Özellikler
- **Akıllı Bira Sayacı**: Gerçek zamanlı bira tüketim takibi
- **Çoklu Boyut Desteği**: 20cl'den 1L'ye kadar 6 farklı bira boyutu
- **Adaptif Bildirim Sistemi**: Kullanıcı alışkanlıklarına göre özelleşen hatırlatmalar
- **Veri Kalıcılığı**: Uygulama kapatılsa bile veriler korunur
- **Haptic Feedback**: Dokunsal geri bildirimler
- **Modern UI/UX**: Siyah tema üzerine altın sarısı vurgular

### 🎯 Bira Boyutları
- 20cl (Küçük bardak)
- 25cl (Standart küçük)
- 33cl (Şişe/kutu) - Varsayılan
- 50cl (Büyük bardak)
- 75cl (Büyük şişe)
- 1L (Litre bardak)

### 🔔 Bildirim Sistemi
- İlk bira sonrası 30-45 dakika hatırlatma
- Adaptif aralık hesaplama (15dk - 2saat)
- 5 farklı motivasyon mesajı
- Test bildirimi özelliği

### 📊 İstatistikler
- Toplam bira sayısı
- Toplam alkol hacmi (cl/ml)
- Oturum süresi takibi
- Gerçek zamanlı güncellemeler

## 🛠️ Teknoloji Stack

- **Framework**: React Native
- **Dil**: TypeScript
- **State Management**: React Hooks
- **Veri Depolama**: AsyncStorage
- **Bildirimler**: React Native Push Notification
- **Animasyonlar**: React Native Animated API
- **Haptic Feedback**: React Native Haptic Feedback

## 📱 Platform Desteği

- ✅ iOS 13.0+
- ✅ Android 8.0+ (API 26+)
- ✅ **Pure React Native** (Expo bağımlılığı yok)

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- React Native CLI
- iOS Simulator (macOS) veya Android Studio
- Xcode (iOS için)
- Android Studio (Android için)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd beermatik
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **iOS için pod'ları yükleyin** (macOS)
```bash
cd ios && pod install && cd ..
```

4. **Uygulamayı çalıştırın**
```bash
# Metro bundler'ı başlat
npm start

# Android'de çalıştır
npm run android

# iOS'ta çalıştır (macOS)
npm run ios
```

## 📦 Build ve Deploy

### Android Build
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease

# Release AAB (Google Play Store)
cd android && ./gradlew bundleRelease
```

### iOS Build
```bash
# Xcode ile build
# ios/Beermatik.xcworkspace dosyasını Xcode'da açın
# Product > Archive ile build alın
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Arka Plan**: #000000 (Siyah)
- **Ana Renk**: #FFD700 (Altın Sarısı)
- **İkincil Renk**: #FFA500 (Turuncu)
- **Vurgu Rengi**: #8B4513 (Koyu Kahverengi)
- **Metin**: #FFFFFF (Beyaz)

### Tipografi
- **Başlık**: 32px, Bold
- **Alt Başlık**: 18px, Regular
- **Sayaç**: 64px, Bold
- **İstatistik**: 18px, Bold

## 🔧 Konfigürasyon

### Bildirim Ayarları
```typescript
// src/utils/constants.ts
export const NOTIFICATION_TIMING = {
  FIRST_BEER_DELAY: 30, // dakika
  MAX_INTERVAL: 120,    // maksimum 2 saat
  MIN_INTERVAL: 15,     // minimum 15 dakika
};
```

### Bira Boyutları
```typescript
export const BEER_SIZES = [
  { id: '20cl', label: '20cl', volume: 20, icon: '🍺' },
  { id: '25cl', label: '25cl', volume: 25, icon: '🍺' },
  // ... diğer boyutlar
];
```

## 📁 Proje Yapısı

```
src/
├── components/          # UI Komponentleri
│   ├── BeerCounter.tsx
│   ├── SizeSelector.tsx
│   ├── ResetButton.tsx
│   └── NotificationManager.tsx
├── screens/            # Ekranlar
│   └── HomeScreen.tsx
├── services/           # Servisler
│   ├── StorageService.ts
│   └── NotificationService.ts
├── utils/              # Yardımcı Fonksiyonlar
│   ├── constants.ts
│   └── helpers.ts
└── styles/             # Stil Tanımları
    └── globalStyles.ts
```

## 🧪 Test

### Fonksiyonel Testler
- [x] Bira sayacı artışı
- [x] Boyut değişimi hesaplamaları
- [x] Bildirim zamanlaması
- [x] Veri kalıcılığı
- [x] Reset fonksiyonu

### Performans Testleri
- [x] Uygulama açılış hızı
- [x] Memory usage kontrolü
- [x] Battery drain analizi

## 📈 Başarı Metrikleri

- **User Retention**: %70+ 7-günlük retention
- **Engagement**: Günlük ortalama 3+ session
- **Notification CTR**: %40+ bildirime tıklama oranı
- **App Store Rating**: 4.5+ yıldız ortalama
- **Crash Rate**: %1'in altında

## 🔒 Gizlilik ve Güvenlik

- ✅ Tüm veriler lokal olarak saklanır
- ✅ İnternet bağlantısı gerektirmez
- ✅ Kullanıcı verisi üçüncü taraflarla paylaşılmaz
- ✅ Bildirim izinleri şeffaf şekilde istenir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 Ekip

- **Geliştirici**: Beermatik Team
- **Tasarım**: Beermatik Design Team
- **Test**: Beermatik QA Team

## 📞 İletişim

- **Email**: info@beermatik.com
- **Website**: https://beermatik.com
- **Support**: support@beermatik.com

## 🙏 Teşekkürler

- React Native ekibine
- Expo ekibine
- Açık kaynak topluluğuna

---

**Beermatik ile bira tüketimini takip et, unutma! 🍺**
