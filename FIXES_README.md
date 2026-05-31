# BillSplit Pro — PWABuilder Fixes

## Kya kya fix kiya gaya hai

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Icons PNG nahi the (sirf SVG) | 🔴 Critical | ✅ Fixed |
| 2 | `start_url` aur `scope` relative the (`./`) | 🔴 Critical | ✅ Fixed |
| 3 | Screenshots SVG the (PNG chahiye) | 🟠 High | ✅ Fixed |
| 4 | `apple-touch-icon` SVG tha (iOS PNG nahi support karta) | 🟠 High | ✅ Fixed |
| 5 | Maskable icon proper safe-zone ke saath nahi tha | 🟠 High | ✅ Fixed |
| 6 | Manifest mein `id` field missing tha | 🟡 Medium | ✅ Fixed |
| 7 | Service Worker mein cross-origin requests cache ho rahi thi | 🟡 Medium | ✅ Fixed |
| 8 | SW scope `/` nahi tha, relative path `./` tha | 🟡 Medium | ✅ Fixed |
| 9 | Shortcut URLs relative the | 🟡 Medium | ✅ Fixed |
| 10 | `theme_color` in HTML mein alag tha manifest se | 🟢 Low | ✅ Fixed |

---

## Files jo aapko Vercel mein dalni hain

Ye saari files apni project root mein copy karo:

```
icon-192.png          ← 192×192 PNG icon (any purpose)
icon-512.png          ← 512×512 PNG icon (any purpose)
icon-maskable-192.png ← 192×192 maskable icon (10% safe zone)
icon-maskable-512.png ← 512×512 maskable icon (10% safe zone)
apple-touch-icon.png  ← 180×180 iOS home screen icon
screenshot-narrow.png ← 540×720 mobile screenshot
screenshot-wide.png   ← 1280×720 desktop screenshot
manifest.json         ← REPLACE your existing manifest.json
sw.js                 ← REPLACE your existing sw.js
```

Aur `HEAD_CHANGES.html` file dekho — usme bataya gaya hai `index.html` mein kya changes karni hain.

---

## index.html mein changes (short version)

### 1. `<link rel="manifest">` — absolute path use karo:
```html
<!-- OLD -->
<link rel="manifest" href="./manifest.json">

<!-- NEW -->
<link rel="manifest" href="/manifest.json">
```

### 2. `apple-touch-icon` — PNG use karo SVG nahi:
```html
<!-- OLD -->
<link rel="apple-touch-icon" href="./icon.svg">

<!-- NEW -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
```

### 3. `theme-color` meta — manifest se match karo:
```html
<!-- OLD -->
<meta name="theme-color" content="#0f0f14">

<!-- NEW -->
<meta name="theme-color" content="#c8f135">
```

### 4. Service Worker registration — scope fix:
```html
<!-- OLD -->
navigator.serviceWorker.register('./sw.js')

<!-- NEW -->
navigator.serviceWorker.register('/sw.js', { scope: '/' })
```

---

## PWABuilder score kyu improve hoga

1. **PNG icons** — Google Play, Microsoft Store, Apple App Store sab PNG maangti hain
2. **Maskable icons** — Android adaptive icons ke liye zaroori hain (safe zone 10%)
3. **Absolute URLs** — `/` se start karne wale URLs scope issues se bachate hain
4. **Screenshots** — Play Store listing mein screenshots SVG support nahi hoti
5. **`id` field** — PWA identity uniquely identify karta hai, required in newer spec
6. **iOS icon** — Safari aur iOS SVG ko apple-touch-icon mein support nahi karta
