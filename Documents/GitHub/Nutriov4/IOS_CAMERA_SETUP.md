# iOS Camera Permission Setup

## Required for Barcode Scanner

The barcode scanner feature requires camera access. Follow these steps:

### 1. Add Camera Permission to Info.plist

After running `npx cap add ios`, open:
```
ios/App/App/Info.plist
```

Add the following before the closing `</dict>` tag:

```xml
<key>NSCameraUsageDescription</key>
<string>This app requires camera access to scan barcodes for nutrition information.</string>
```

### 2. Full Info.plist Example

Your Info.plist should look something like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>Nutrio</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$(MARKETING_VERSION)</string>
    <key>CFBundleVersion</key>
    <string>$(CURRENT_PROJECT_VERSION)</string>
    
    <!-- CAMERA PERMISSION - ADD THIS -->
    <key>NSCameraUsageDescription</key>
    <string>This app requires camera access to scan barcodes for nutrition information.</string>
    
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
```

### 3. Verify Permission

1. Build and run the app in Xcode
2. Navigate to the "Analyze Meal" page
3. Tap "Scan Barcode"
4. iOS will show a permission dialog
5. Grant camera access

### 4. Testing on Simulator

**Note**: The camera does not work on iOS Simulator. To test the barcode scanner:
- Use a physical iOS device
- Connect via cable to your Mac
- Select the device in Xcode
- Build and run

### 5. Permission Dialog Customization

You can customize the permission message by changing the `<string>` value:

```xml
<key>NSCameraUsageDescription</key>
<string>Your custom message here</string>
```

Examples:
- "Scan product barcodes to instantly get nutritional information"
- "Access your camera to scan food labels and track nutrition"
- "We need camera access to scan barcodes"

### Troubleshooting

**Permission denied:**
- Go to iOS Settings → Nutrio → Camera → Enable

**Permission not showing:**
- Check that Info.plist was saved correctly
- Clean build folder in Xcode (Product → Clean Build Folder)
- Reinstall the app

**Scanner not working:**
- Ensure you're testing on a real device, not simulator
- Check that camera permission was granted
- Try scanning a clear, well-lit barcode
