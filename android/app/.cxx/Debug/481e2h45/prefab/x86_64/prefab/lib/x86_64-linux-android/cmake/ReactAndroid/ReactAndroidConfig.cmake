if(NOT TARGET ReactAndroid::hermestooling)
add_library(ReactAndroid::hermestooling SHARED IMPORTED)
set_target_properties(ReactAndroid::hermestooling PROPERTIES
    IMPORTED_LOCATION "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/hermestooling/libs/android.x86_64/libhermestooling.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/hermestooling/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::jsi)
add_library(ReactAndroid::jsi SHARED IMPORTED)
set_target_properties(ReactAndroid::jsi PROPERTIES
    IMPORTED_LOCATION "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/jsi/libs/android.x86_64/libjsi.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/jsi/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::reactnative)
add_library(ReactAndroid::reactnative SHARED IMPORTED)
set_target_properties(ReactAndroid::reactnative PROPERTIES
    IMPORTED_LOCATION "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/libs/android.x86_64/libreactnative.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mert/.gradle/caches/8.13/transforms/b38fec5f2835cdf0adc4cdc55e8eea42/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

