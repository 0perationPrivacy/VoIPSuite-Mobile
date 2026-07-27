# Linphone SDK: 16KB-page build, bytecode-patched for this project's toolchain

`android/app/libs/linphone-sdk-android-5.4.30-16kb-patched.aar` is a modified
`org.linphone:linphone-sdk-android:5.4.30` (fetched from
`https://download.linphone.org/maven_repository/`), not the stock artifact.
One thing is changed: every `.class` file inside `classes.jar` has its class
file major version rewritten from 61 (Java 17) to 52 (Java 8). No bytecode
instructions are touched — see `patch_linphone_sdk.py` in this directory.

## Why

Two constraints collided:

- **16KB memory page size.** Current Android hardware (confirmed on a real
  Pixel 9a) can run with 16KB memory pages, not just the traditional 4KB.
  Native libraries built before the industry-wide 16KB migration (roughly
  2024 onward) have `PT_LOAD` ELF segments aligned to only 4096 bytes, and
  loading them on a 16KB-page device fails with a nonsensical-looking
  `UnsatisfiedLinkError: dlopen failed: cannot locate symbol
  "__emutls_get_address"` — a real, confirmed, reproducible crash (not
  emulator-specific — it hit real hardware). `linphone-sdk-android:5.2.112`
  (Dec 2023), used earlier in this project, predates the fix. Verified
  directly by parsing every `.so`'s ELF program headers: 5.2.112's are all
  4096-byte aligned; `5.4.30`'s are all 16384-byte aligned (the alignment
  fix landed somewhere between `5.3.110`, Apr 2025, and `5.4.30`, Jul 2025).
- **This project's build toolchain.** `android/build.gradle` is still on AGP
  7.0.3 / Gradle 7.2 (a React Native 0.67-era project). Every
  linphone-sdk-android release with 16KB-aligned native libraries also
  ships a `classes.jar` compiled to Java 17 bytecode, which this AGP
  version's D8 dexer flatly refuses ("Unsupported class file major version
  61"). D8 gaining reliable Java 17 support requires AGP 8.0+, which in
  turn requires Gradle 8, mandatory `android.namespace` declarations in
  every module (including several old, unmaintained third-party React
  Native native modules that don't have one), and possibly a React Native
  upgrade — a much larger, riskier change than justified here.

## Why patching the version marker is safe here

A blind version-marker rewrite would be dangerous if the actual bytecode
used real Java 9+ *instructions* or attributes D8 can't interpret. Checked
directly: 264 of the SDK's classes (all in `LinphoneTombstoneProtos`, an
internal crash-report protobuf schema — not core SIP/media code) use the
`NestHost`/`NestMembers` attributes (Java 11+, added automatically by
`javac` for nested-class private member access). Rather than reason about
whether D8 handles that gracefully, it was tested empirically: patched,
built, and installed — `./gradlew assembleDebug` succeeded, `CallEngine.kt`
compiled clean against the real API with zero unresolved references (which
also confirms the calling-relevant API — `Factory`, `Core`, `Account`,
`Call`, including the ZRTP `authenticationToken`/`authenticationTokenVerified`
fields — is unchanged from 5.2.112), and the app ran on a real 16KB-page
device without the `NestHost` classes causing any issue (they're never
exercised in normal calling operation regardless).

## The other half of the fix: libc++_shared.so

Getting past the alignment crash surfaced a second one: `libbctoolbox.so`
(built with a newer NDK for this SDK version) failed to `dlopen` with
`cannot locate symbol "_ZTVNSt6__ndk119basic_ostringstreamIcNS_...`. Both
react-native's prebuilt native libs and linphone-sdk-android bundle their
own copy of `libc++_shared.so`; `android/app/build.gradle`'s
`packagingOptions { pickFirst "**/libc++_shared.so" }` (added earlier to
resolve a merge conflict) picks one arbitrarily, and for this SDK version it
was picking react-native's older, ABI-incompatible copy. Fixed by placing
Linphone's newer `libc++_shared.so` directly under
`android/app/src/main/jniLibs/<abi>/` for all four ABIs — an app module's
own `jniLibs` take priority over any AAR-provided copy at the same path, so
this is deterministic rather than relying on `pickFirst`'s unspecified
tie-breaking. (Newer NDK-built `libc++_shared.so` is designed to be
backward-compatible with code built by older NDKs, so this is safe for
react-native's own native code too — verified: the app runs fine.)

## Wiring

`android/build.gradle` adds a `flatDir { dirs "${rootDir}/app/libs" }`
repository; `android/app/build.gradle` depends on
`(name: 'linphone-sdk-android-5.4.30-16kb-patched', ext: 'aar')` instead of
the Maven coordinate.

## Regenerating / updating to a newer SDK version later

```
curl -o linphone-sdk-android-X.Y.Z.aar \
  https://download.linphone.org/maven_repository/org/linphone/linphone-sdk-android/X.Y.Z/linphone-sdk-android-X.Y.Z.aar
python3 patch_linphone_sdk.py linphone-sdk-android-X.Y.Z.aar \
  ../linphone-sdk-android-X.Y.Z-16kb-patched.aar
```

Before trusting a new version, re-verify both things this README documents:
native lib `PT_LOAD` alignment (parse the ELF headers directly — an ELF
parsing snippet identical to the one used here is trivial to write with
Python's `struct` module) and that `./gradlew assembleDebug` still succeeds
with `CallEngine.kt` compiling against the real API with no unresolved
references.

## If this project's AGP is ever upgraded to 8.0+

This entire patch becomes unnecessary — switch back to the plain Maven
coordinate (`implementation "org.linphone:linphone-sdk-android:X.Y.Z"`),
remove the `flatDir` repository, delete this directory and the
`jniLibs/*/libc++_shared.so` override (a stock AGP 8 build's `pickFirst`
would need re-verifying, but by then both copies would likely be
NDK-version-matched again anyway).
