# FOXY — Mobile App

Ứng dụng đặt lịch sửa chữa thiết bị di động tại nhà, xây dựng bằng **React Native + Expo**.

---

## Yêu cầu hệ thống

| Công cụ | Phiên bản khuyến nghị |
|---|---|
| Node.js | >= 18 |
| npm | >= 9 |
| Expo CLI | `npm install -g expo-cli` |
| EAS CLI | `npm install -g eas-cli` |
| Android Studio | Để chạy Android Emulator |
| Xcode | Để chạy iOS Simulator (macOS only) |

---

## Cài đặt dependencies

```bash
npm install
```

---

## Chạy dev (debug / chỉnh sửa)

### Khởi động Metro bundler

```bash
npx expo start
```

Sau khi chạy, bạn có các lựa chọn:

| Phím | Hành động |
|---|---|
| `a` | Mở Android Emulator |
| `i` | Mở iOS Simulator (macOS) |
| `w` | Mở trên trình duyệt web |
| `r` | Reload app |
| `m` | Mở Dev Menu |

### Chạy thẳng trên thiết bị thật

Cài app **Expo Go** trên điện thoại, rồi quét QR code hiển thị sau khi chạy `npx expo start`.

### Chạy riêng từng nền tảng

```bash
npx expo start --android   # Android Emulator
npx expo start --ios       # iOS Simulator (macOS)
npx expo start --web       # Web browser
```

### Debug

- **React Native Debugger**: Mở Dev Menu → "Open JS Debugger"
- **Flipper**: Kết nối tự động khi app chạy trên emulator
- **Console log**: Hiển thị trực tiếp trong terminal Metro

---

## Build APK (Android) với EAS

### 1. Đăng nhập EAS

```bash
eas login
```

### 2. Cấu hình project (chạy một lần)

```bash
eas build:configure
```

### 3. Build APK debug (để test nhanh)

```bash
eas build --platform android --profile preview
```

> File APK được upload lên EAS cloud, tải về qua link được cung cấp sau khi build xong.

### 4. Build APK release (production)

```bash
eas build --platform android --profile production
```

### 5. Build local (không dùng cloud EAS)

Yêu cầu Android Studio đã cài đầy đủ SDK:

```bash
npx expo run:android --variant release
```

APK xuất ra tại: `android/app/build/outputs/apk/release/app-release.apk`

---

## Build Web & Deploy lên Netlify

### 1. Build web

```bash
npx expo export --platform web
```

Output nằm trong thư mục `dist/`.

### 2. Deploy lên Netlify (CLI)

```bash
# Cài Netlify CLI (nếu chưa có)
npm install -g netlify-cli

# Đăng nhập
netlify login

# Deploy preview
netlify deploy --dir dist

# Deploy production
netlify deploy --dir dist --prod
```

### 3. Deploy qua Netlify Drop (không cần CLI)

1. Truy cập [app.netlify.com](https://app.netlify.com)
2. Kéo thả thư mục `dist/` vào trang **"Add new site"**
3. Netlify tự động deploy và cấp URL dạng `https://xxx.netlify.app`

### 4. Deploy tự động qua Git

1. Push code lên GitHub/GitLab
2. Vào Netlify → **Add new site** → **Import from Git**
3. Cấu hình:
   - **Build command**: `npx expo export --platform web`
   - **Publish directory**: `dist`
4. Netlify tự động build & deploy mỗi khi push code.

---

## Cấu trúc project

```
src/
├── components/       # UI components dùng chung
├── screens/          # Các màn hình
├── navigation/       # Cấu hình điều hướng
├── store/            # State management (Zustand)
├── services/         # Business logic
├── database/         # SQLite schema & seed
├── constants/        # Colors, devices data
└── types/            # TypeScript interfaces
```

---

## Các lệnh thường dùng

```bash
npm install              # Cài dependencies
npx expo start           # Chạy dev server
npx expo start --web     # Chạy web
npx expo export --platform web  # Build web
eas build --platform android --profile preview  # Build APK
```
