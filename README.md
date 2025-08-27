# Fertility Service and Cryobank Management System - Mobile App / Ứng dụng di động quản lý dịch vụ hiếm muộn

A comprehensive fertility clinic and cryobank management system designed to streamline patient care, sample tracking, and clinical workflows.

Hệ thống quản lý phòng khám hiếm muộn và ngân hàng trữ đông toàn diện, được thiết kế để tối ưu hóa việc chăm sóc bệnh nhân, theo dõi mẫu vật và quy trình lâm sàng.

This mobile version is designed specifically for patient use.  
Phiên bản di động này được thiết kế đặc biệt cho bệnh nhân sử dụng.


### Other Project Components / Các thành phần khác của dự án

- **Web App:**
- **Backend:**


## Development Setup / Cài đặt môi trường phát triển

### Prerequisites / Yêu cầu trước khi cài đặt

1. Install Android Studio and create a virtual device (note down the device name).  
   Cài đặt Android Studio và tạo thiết bị ảo (ghi nhớ tên thiết bị).

2. Add Android SDK emulator path to system PATH:  
   Thêm đường dẫn đến thư mục emulator của Android SDK vào biến môi trường "Path":
   ```
   [Your Android SDK path]/emulator
   ```

### Running the Project / Chạy dự án

1. Start the Android emulator without Android Studio:  
   Khởi động thiết bị ảo Android mà không cần mở Android Studio:
   ```bash
   emulator -avd [your-device-name]
   ```

2. Run the app on the virtual device:  
   Chạy ứng dụng trên thiết bị ảo:
   ```bash
   ionic cap run android
   ```
   A list of available devices will be shown. Note down your device ID for faster deployment next time:  
   Danh sách các thiết bị khả dụng sẽ hiển thị. Ghi nhớ device ID để lần sau chạy tiện hơn:
   ```bash
   ionic cap run android --target=[device-id]
   ```

3. For development with hot reload:  
   Để phát triển với hot reload:
   ```bash
   ionic cap run android --target=[device-id] --livereload --external
   ```

#### Optional: NPM Scripts / Tùy chọn: Các lệnh NPM

For convenience, you can add these commands to your `package.json` (replace [device-id] with your actual device ID):  
Để thuận tiện, bạn có thể thêm các lệnh sau vào `package.json` (thay [device-id] bằng ID thiết bị của bạn):
```json
{
  "scripts": {
    "android": "ionic cap run android",
    "android:dev": "ionic cap run android --target=[device-id] --livereload --external"
  }
}