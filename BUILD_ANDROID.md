# Building the vmail Android app (APK)

The Android project lives in `android/` and is generated with Capacitor.
The APK itself has to be built on your own computer — it needs Android Studio
and the Android SDK, which are not available here.

## One-time setup on your machine

1. Install [Android Studio](https://developer.android.com/studio) (includes the SDK and JDK 21).
2. Export this project to GitHub and clone it locally.
3. Install dependencies: `bun install` (or `npm install`).

## Build

```bash
bun run build:mobile      # builds the web app into dist-mobile/
bunx cap sync android     # copies the web build + plugins into android/
bunx cap open android     # opens Android Studio
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
The debug APK lands in:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Or from the command line:

```bash
cd android && ./gradlew assembleDebug
```

For a Play Store release, use `./gradlew bundleRelease` with a signing key
configured in `android/app/build.gradle`.

## App identity

- App name: **vmail**
- Package id: `app.vmail.mobile` (change in `capacitor.config.ts` **and**
  `android/app/build.gradle` before publishing)
- Icon/splash source: `resources/icon.png`, `resources/splash.png`.
  Regenerate the Android assets with `bunx capacitor-assets generate --android`.

## Live reload during development

Add a `server` block to `capacitor.config.ts` pointing at your dev machine's
LAN address, then `bunx cap sync android`:

```ts
server: { url: "http://192.168.1.10:8080", cleartext: true }
```

Remove it before shipping a release build.
