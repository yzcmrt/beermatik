#!/bin/bash

# Beermatik Android Build Script (Native)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

printf "${BLUE}🍺 Beermatik Android Build Başlatılıyor...${NC}\n"

printf "${YELLOW}1. TypeScript kontrol ediliyor...${NC}\n"
(cd "$ROOT_DIR" && npx tsc --noEmit)

printf "${YELLOW}2. Lint kontrolü (opsiyonel) için: npx eslint src --ext .ts,.tsx${NC}\n"

printf "${YELLOW}3. Build tipini seçin:${NC}\n"
printf "   1) assembleDebug\n"
printf "   2) assembleRelease\n"
printf "   3) bundleRelease (AAB)\n"
read -rp "Seçiminiz (1-3): " BUILD_CHOICE

case "$BUILD_CHOICE" in
  1)
    GRADLE_TASK="assembleDebug"
    ;;
  2)
    GRADLE_TASK="assembleRelease"
    ;;
  3)
    GRADLE_TASK="bundleRelease"
    ;;
  *)
    printf "${RED}Geçersiz seçim, varsayılan olarak assembleDebug çalıştırılıyor.${NC}\n"
    GRADLE_TASK="assembleDebug"
    ;;
 esac

printf "${YELLOW}4. Gradle build başlatılıyor: ${GRADLE_TASK}${NC}\n"
(cd "$ANDROID_DIR" && ./gradlew clean "$GRADLE_TASK")

printf "${GREEN}✅ Android build tamamlandı!${NC}\n"
case "$GRADLE_TASK" in
  assembleRelease)
    printf "${GREEN}APK: android/app/build/outputs/apk/release/app-release.apk${NC}\n"
    ;;
  bundleRelease)
    printf "${GREEN}AAB: android/app/build/outputs/bundle/release/app-release.aab${NC}\n"
    ;;
  *)
    printf "${GREEN}APK: android/app/build/outputs/apk/debug/app-debug.apk${NC}\n"
    ;;
 esac
