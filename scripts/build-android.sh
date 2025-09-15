#!/bin/bash

# Beermatik Android Build Script

echo "🍺 Beermatik Android Build Başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

echo -e "${YELLOW}1. Bağımlılıklar kontrol ediliyor...${NC}"
npm install

echo -e "${YELLOW}2. TypeScript kontrol ediliyor...${NC}"
npx tsc --noEmit

echo -e "${YELLOW}3. Android build başlatılıyor...${NC}"
npx expo build:android --type apk

echo -e "${GREEN}✅ Android build tamamlandı!${NC}"
echo -e "${GREEN}APK dosyası: android/app/build/outputs/apk/release/app-release.apk${NC}"
