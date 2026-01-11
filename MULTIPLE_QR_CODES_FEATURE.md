# Multiple QR Codes Detection Feature

## Overview
The QR code scanner has been enhanced to detect and handle multiple QR codes within a single image. When multiple QR codes are found, users can select which one to open.

## Changes Made

### 1. Enhanced QR Scanner (`src/utils/enhancedQrScanner.js`)

#### Updated Functions:
- **`tryJsQR(imageData, findMultiple)`**: Now accepts a `findMultiple` parameter to scan for multiple QR codes
  - When `findMultiple = true`, scans the image in a grid pattern to detect multiple codes
  - Returns an array of unique QR codes found
  
- **`enhancedQrScan(imageSource, onProgress, findMultiple)`**: Main scanning function
  - New `findMultiple` parameter (default: `false`)
  - Returns either a single string or array of strings depending on mode
  - Uses a Set to avoid duplicate QR codes
  - Scans through all image variations to maximize detection

- **`scanQrCodeWithProgress(imageSource, callbacks, findMultiple)`**: Updated to support multiple detection

### 2. UI Component (`src/FlexibleScrollDemo.jsx`)

#### New State Variables:
```javascript
const [scannedUrls, setScannedUrls] = useState([]); // Store multiple scanned URLs
const [qrSelectionDialogVisible, setQrSelectionDialogVisible] = useState(false); // Multiple QR selection dialog
```

#### Updated `handleScanQrCode` Function:
- Now calls `enhancedQrScan` with `findMultiple = true`
- Processes results as an array
- Shows selection dialog if multiple QR codes found
- Shows single result dialog if only one QR code found

#### New Dialog Component:
**QR Code Selection Dialog** - Displays when multiple QR codes are detected:
- Shows a numbered list of all detected QR codes
- Each item is clickable with hover effects
- Displays the full URL for each QR code
- Provides visual feedback with icons and styling
- Responsive design for mobile and desktop

## User Experience Flow

### Single QR Code:
1. User uploads/scans QR code image
2. Scanner detects one QR code
3. Result dialog shows immediately with the URL
4. User clicks "Open Link" to visit the URL

### Multiple QR Codes:
1. User uploads/scans image with multiple QR codes
2. Scanner detects multiple QR codes (e.g., 2-5 codes)
3. **Selection dialog appears** showing all detected codes
4. User clicks on their preferred QR code
5. Result dialog shows with the selected URL
6. User clicks "Open Link" to visit the URL

## Features

### Selection Dialog UI:
- **Header**: "Multiple QR Codes Found" with count
- **List Items**: Numbered cards (1, 2, 3...) for each QR code
- **Hover Effects**: Cards highlight on hover for better UX
- **Clickable**: Each card opens the respective URL
- **Scrollable**: Handles many QR codes with vertical scroll
- **Dark Mode Support**: Adapts colors for light/dark themes
- **Mobile Responsive**: Adjusts width for mobile devices

### Visual Elements:
- Blue theme color (#3b82f6) for multi-selection
- Numbered badges for easy identification
- External link icons for clarity
- Info messages and instructions
- Smooth transitions and animations

## Technical Details

### QR Code Detection Strategy:
1. Quick scan with original image
2. If `findMultiple = true`, create image variations:
   - High contrast
   - Brightened
   - Black & white threshold
   - Inverted colors
   - Sharpened
   - Adaptive threshold
3. Scan each variation with jsQR and qr-scanner libraries
4. Collect all unique results in a Set
5. Return as array

### URL Processing:
- Detects if text is already a URL (`http://` or `https://`)
- Auto-adds `https://` for domain-like text
- Creates Google search URL for plain text
- Handles all results uniformly

## Usage Example

```javascript
// Scan for multiple QR codes
const results = await enhancedQrScan(imageBlob, null, true);

// Results can be:
// Single code: "https://example.com"
// Multiple codes: ["https://example1.com", "https://example2.com", "https://example3.com"]
```

## Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-friendly (iOS Safari, Android Chrome)
- Progressive Web App (PWA) compatible

## Future Enhancements
- Show QR code preview thumbnails in selection dialog
- Add ability to copy URLs without opening
- Batch open multiple QR codes
- Export detected QR codes list
- Support for different QR code types (vCard, WiFi, etc.)

## Testing
To test the feature:
1. Create an image with multiple QR codes (use online QR generator)
2. Upload the image in the app
3. Observe the selection dialog appearing
4. Click on different QR codes to test selection
5. Verify each URL opens correctly

---

**Version**: 1.0
**Date**: January 11, 2026
**Author**: GitHub Copilot
