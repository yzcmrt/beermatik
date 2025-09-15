#!/bin/bash

# Beermatik Deploy Script

echo "🍺 Beermatik Deploy Başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

# Platform seçimi
echo -e "${BLUE}Hangi platform için build yapmak istiyorsunuz?${NC}"
echo "1) Android APK"
echo "2) iOS IPA"
echo "3) Her ikisi"
read -p "Seçiminiz (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}Android APK build başlatılıyor...${NC}"
        ./scripts/build-android.sh
        ;;
    2)
        echo -e "${YELLOW}iOS IPA build başlatılıyor...${NC}"
        ./scripts/build-ios.sh
        ;;
    3)
        echo -e "${YELLOW}Her iki platform için build başlatılıyor...${NC}"
        ./scripts/build-android.sh
        ./scripts/build-ios.sh
        ;;
    *)
        echo -e "${RED}Geçersiz seçim!${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Build işlemi tamamlandı!${NC}"

# Store metadata kontrolü
echo -e "${YELLOW}Store metadata dosyaları kontrol ediliyor...${NC}"
if [ -f "store-metadata/app-store.md" ] && [ -f "store-metadata/google-play.md" ]; then
    echo -e "${GREEN}✅ Store metadata dosyaları mevcut${NC}"
else
    echo -e "${RED}❌ Store metadata dosyaları bulunamadı${NC}"
    exit 1
fi

# Son kontroller
echo -e "${YELLOW}Son kontroller yapılıyor...${NC}"

# TypeScript kontrolü
echo "TypeScript kontrol ediliyor..."
npx tsc --noEmit

# Lint kontrolü
echo "Lint kontrol ediliyor..."
npx eslint src/ --ext .ts,.tsx || true

# Test kontrolü (varsa)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "Testler çalıştırılıyor..."
    npm test || true
fi

echo -e "${GREEN}🎉 Beermatik deploy hazır!${NC}"
echo -e "${BLUE}Store'lara yüklemek için:${NC}"
echo "1. App Store Connect'e gidin"
echo "2. Google Play Console'a gidin"
echo "3. Metadata dosyalarını kullanın"
echo "4. Build dosyalarını yükleyin"

echo -e "${YELLOW}Build dosyaları:${NC}"
if [ -d "android/app/build/outputs/apk/release" ]; then
    echo "Android APK: android/app/build/outputs/apk/release/app-release.apk"
fi
if [ -d "ios/build" ]; then
    echo "iOS IPA: Expo dashboard'da hazır"
fi
