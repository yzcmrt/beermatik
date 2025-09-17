#!/bin/bash

# Beermatik Android Build Script (EAS Build)

echo "🍺 Beermatik Android Build Başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

echo -e "${YELLOW}1. Bağımlılıklar kontrol ediliyor...${NC}"
npm install

echo -e "${YELLOW}2. TypeScript kontrol ediliyor...${NC}"
npx tsc --noEmit

echo -e "${BLUE}3. EAS Build ile Android build başlatılıyor...${NC}"
echo -e "${YELLOW}   Not: Expo Go artık push notification desteklemiyor!${NC}"
echo -e "${YELLOW}   Development Build kullanmanız gerekiyor.${NC}"

# Build tipini seç
echo -e "${BLUE}Build tipini seçin:${NC}"
echo "1) Development Build (Önerilen)"
echo "2) Preview Build (APK)"
echo "3) Production Build (AAB)"

read -p "Seçiminiz (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}Development Build başlatılıyor...${NC}"
        eas build --profile development --platform android
        ;;
    2)
        echo -e "${YELLOW}Preview Build başlatılıyor...${NC}"
        eas build --profile preview --platform android
        ;;
    3)
        echo -e "${YELLOW}Production Build başlatılıyor...${NC}"
        eas build --profile production --platform android
        ;;
    *)
        echo -e "${RED}Geçersiz seçim! Development Build kullanılıyor...${NC}"
        eas build --profile development --platform android
        ;;
esac

echo -e "${GREEN}✅ Android build tamamlandı!${NC}"
echo -e "${GREEN}Build detayları: https://expo.dev/accounts/[username]/projects/beermatik/builds${NC}"
