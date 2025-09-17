#!/bin/bash

# Beermatik Keystore Generation Script

echo "🍺 Beermatik Android Keystore Oluşturuluyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Keystore bilgileri
KEYSTORE_PATH="android/app/beermatik-upload-key.keystore"
KEYSTORE_ALIAS="beermatik-upload-key"
KEYSTORE_PASSWORD="beermatik123"
KEY_ALIAS="beermatik-upload-key"
KEY_PASSWORD="beermatik123"

echo -e "${YELLOW}Keystore oluşturuluyor...${NC}"

# Keystore oluştur
keytool -genkeypair \
    -v \
    -storetype PKCS12 \
    -keystore $KEYSTORE_PATH \
    -alias $KEYSTORE_ALIAS \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass $KEYSTORE_PASSWORD \
    -keypass $KEY_PASSWORD \
    -dname "CN=Beermatik, OU=Development, O=Beermatik, L=Istanbul, ST=Istanbul, C=TR"

echo -e "${GREEN}✅ Keystore başarıyla oluşturuldu!${NC}"
echo -e "${GREEN}Dosya: $KEYSTORE_PATH${NC}"
echo -e "${GREEN}Alias: $KEYSTORE_ALIAS${NC}"
echo -e "${GREEN}Şifre: $KEYSTORE_PASSWORD${NC}"

echo -e "${YELLOW}gradle.properties dosyasına eklenecek:${NC}"
echo "MYAPP_UPLOAD_STORE_FILE=beermatik-upload-key.keystore"
echo "MYAPP_UPLOAD_KEY_ALIAS=$KEYSTORE_ALIAS"
echo "MYAPP_UPLOAD_STORE_PASSWORD=$KEYSTORE_PASSWORD"
echo "MYAPP_UPLOAD_KEY_PASSWORD=$KEY_PASSWORD"

echo -e "${RED}⚠️  ÖNEMLİ: Bu dosyaları güvenli bir yerde saklayın!${NC}"
echo -e "${RED}⚠️  Kaybederseniz uygulama güncellemeleri yapamazsınız!${NC}"
