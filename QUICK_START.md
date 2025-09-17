# 🚀 Beermatik - Hızlı Başlangıç Rehberi

## ⚠️ ÖNEMLİ: Expo Go Desteği Kaldırıldı!

Expo SDK 53+ ile birlikte `expo-notifications` paketinin push notification özelliği Expo Go'dan kaldırılmıştır. Bu nedenle **Development Build** kullanmanız gerekiyor.

## 🔧 Hızlı Kurulum

### 1. Gereksinimler
```bash
# Node.js 18+ kurulu olmalı
node --version

# EAS CLI'yi kurun
npm install -g eas-cli
```

### 2. Projeyi Hazırlayın
```bash
# Bağımlılıkları yükleyin
npm install

# EAS'e giriş yapın (Expo hesabı gerekli)
eas login
```

### 3. Development Build Oluşturun
```bash
# Android için development build
npm run eas:build:dev

# Veya doğrudan çalıştır (build + install)
npm run eas:run:android
```

## 📱 Test Etme

### Development Build ile Test
1. EAS build tamamlandıktan sonra APK'yı indirin
2. Android cihazınıza/emülatöre yükleyin
3. Uygulamayı açın ve bildirimleri test edin

### Bildirim Testi
1. Uygulamayı açın
2. Bir bira ekleyin
3. 30-45 dakika bekleyin (veya test bildirimi gönderin)
4. Bildirim gelmeli!

## 🛠️ Geliştirme

### Geliştirme Sunucusu
```bash
# Metro bundler'ı başlatın
npm start

# Development build ile bağlanın
# QR kodu tarayın veya URL'yi kullanın
```

### Kod Değişiklikleri
- Development build ile kod değişiklikleri otomatik yansır
- Hot reload çalışır
- Sadece native değişiklikler için yeniden build gerekir

## 📦 Build Türleri

### Development Build
- **Kullanım**: Geliştirme ve test
- **Özellikler**: Hot reload, debugging, tam özellik desteği
- **Format**: APK

### Preview Build
- **Kullanım**: Beta test, paylaşım
- **Özellikler**: Production benzeri, APK format
- **Format**: APK

### Production Build
- **Kullanım**: Store'a yükleme
- **Özellikler**: Optimize edilmiş, küçültülmüş
- **Format**: AAB (Android), IPA (iOS)

## 🚨 Sorun Giderme

### "expo-notifications hatası" alıyorsanız
- ✅ Development Build kullanın
- ❌ Expo Go kullanmayın

### Build başarısız oluyorsa
```bash
# EAS'e giriş yaptığınızdan emin olun
eas whoami

# Proje yapılandırmasını kontrol edin
eas build:configure
```

### Bildirimler gelmiyorsa
1. Cihaz bildirim izinlerini kontrol edin
2. Uygulama arka planda çalışıyor mu?
3. Test bildirimi göndermeyi deneyin

## 📞 Yardım

- **Dokümantasyon**: [README.md](./README.md)
- **EAS Docs**: https://docs.expo.dev/build/introduction/
- **Expo Notifications**: https://docs.expo.dev/versions/latest/sdk/notifications/

---

**Not**: Bu rehber Expo SDK 54+ için geçerlidir. Eski sürümler için farklı adımlar gerekebilir.
