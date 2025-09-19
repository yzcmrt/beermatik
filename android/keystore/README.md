# Android Release Keystore Setup

1. Generate a keystore (run inside `android/app`):
   ```bash
   keytool -genkey -v -keystore beermatik-release.keystore -alias beermatik \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Move the generated `beermatik-release.keystore` file into this folder (or another secure location).
3. Add the following entries to `android/gradle.properties` (create if necessary):
   ```properties
   BEERMATIK_STORE_FILE=../keystore/beermatik-release.keystore
   BEERMATIK_KEY_ALIAS=beermatik
   BEERMATIK_STORE_PASSWORD=your-store-password
   BEERMATIK_KEY_PASSWORD=your-key-password
   ```
4. In `android/app/build.gradle`, update the `signingConfigs` section to reference these properties under the `release` config before building:
   ```groovy
   signingConfigs {
       release {
           storeFile file(project.property('BEERMATIK_STORE_FILE'))
           storePassword project.property('BEERMATIK_STORE_PASSWORD')
           keyAlias project.property('BEERMATIK_KEY_ALIAS')
           keyPassword project.property('BEERMATIK_KEY_PASSWORD')
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled false
           shrinkResources false
       }
   }
   ```
5. Keep the passwords outside of source control (CI environments should inject them as secrets).
