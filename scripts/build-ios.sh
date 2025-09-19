#!/bin/bash

# Beermatik iOS Build Script (Native)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$ROOT_DIR/ios"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

printf "${BLUE}🍺 Beermatik iOS Build Başlatılıyor...${NC}\n"

printf "${YELLOW}1. TypeScript kontrol ediliyor...${NC}\n"
(cd "$ROOT_DIR" && npx tsc --noEmit)

printf "${YELLOW}2. CocoaPods bağımlılıkları güncelleniyor...${NC}\n"
(cd "$IOS_DIR" && pod install)

printf "${YELLOW}3. Build tipini seçin:${NC}\n"
printf "   1) Debug (Simülatör)\n"
printf "   2) Release (Cihaz)\n"
read -rp "Seçiminiz (1-2): " BUILD_CHOICE

run_xcodebuild() {
  if command -v xcpretty >/dev/null 2>&1; then
    "$@" | xcpretty
  else
    "$@"
  fi
}

SCHEME="Beermatik"

if [[ "$BUILD_CHOICE" == "1" ]]; then
  printf "${YELLOW}Simülatör build'i başlatılıyor...${NC}\n"
  run_xcodebuild xcodebuild \
    -workspace "$IOS_DIR/Beermatik.xcworkspace" \
    -scheme "$SCHEME" \
    -configuration Debug \
    -destination "platform=iOS Simulator,name=iPhone 15" \
    -derivedDataPath "$IOS_DIR/build" build
else
  printf "${YELLOW}Release archive oluşturuluyor...${NC}\n"
  ARCHIVE_PATH="$IOS_DIR/build/Beermatik.xcarchive"
  run_xcodebuild xcodebuild \
    -workspace "$IOS_DIR/Beermatik.xcworkspace" \
    -scheme "$SCHEME" \
    -configuration Release \
    -sdk iphoneos \
    -archivePath "$ARCHIVE_PATH" archive

  if [[ -f "$IOS_DIR/ExportOptions.plist" ]]; then
    printf "${YELLOW}IPA paketleniyor...${NC}\n"
    run_xcodebuild xcodebuild \
      -exportArchive \
      -archivePath "$ARCHIVE_PATH" \
      -exportOptionsPlist "$IOS_DIR/ExportOptions.plist" \
      -exportPath "$IOS_DIR/build/ipa"
  else
    printf "${YELLOW}ExportOptions.plist bulunamadı. IPA oluşturmak için kendi plist dosyanızı oluşturun.${NC}\n"
  fi
fi

printf "${GREEN}✅ iOS build tamamlandı!${NC}\n"
printf "${GREEN}Çıktılar ios/build klasöründe.${NC}\n"
