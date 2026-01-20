# StegoSafe - Project Setup & Launch Guide

## ✅ Project Status: COMPLETE

All files have been created and the PWA is ready for use!

## 📦 Project Structure Verification

```
stegosafe/
├── 📄 index.html                 ✓ Home page
├── 📄 encode.html                ✓ Message encoding interface
├── 📄 decode.html                ✓ Message decoding interface
├── 📄 README.md                  ✓ Documentation
├── 🚀 start-server.bat           ✓ Windows batch launcher
├── 🚀 start-server.ps1           ✓ PowerShell launcher
├── 🧹 generate_icons.py          ✓ Icon generator script
│
├── 📁 css/
│   └── style.css                 ✓ Modern dark UI (glassmorphism, responsive)
│
├── 📁 js/
│   ├── crypto.js                 ✓ AES-GCM encryption (PBKDF2 key derivation)
│   ├── encode.js                 ✓ LSB steganography encoding
│   └── decode.js                 ✓ LSB steganography decoding
│
├── 📁 pwa/
│   ├── manifest.json             ✓ PWA web app manifest
│   └── service-worker.js         ✓ Service worker (offline support, caching)
│
└── 📁 assets/
    └── icons/
        ├── icon-192.png          ✓ PWA icon (192x192)
        └── icon-512.png          ✓ PWA icon (512x512)
```

## 🚀 Quick Start

### Option 1: Using Batch Script (Windows)
```batch
cd stegosafe
start-server.bat
```

### Option 2: Using PowerShell (Windows)
```powershell
cd stegosafe
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

### Option 3: Manual Python 3
```bash
cd stegosafe
python -m http.server 8000 --directory ..
```

### Option 4: Manual Python 2
```bash
cd stegosafe
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000/stegosafe/**

## ✨ Features Implemented

### Home Page (index.html)
- ✅ App title and description
- ✅ "Encode Message" button
- ✅ "Decode Message" button
- ✅ Service worker registration
- ✅ Feature showcase section
- ✅ Responsive design

### Encode Page (encode.html)
- ✅ Image upload input (accepts all image formats)
- ✅ Message textarea for secret content
- ✅ Optional password input
- ✅ Real-time image preview
- ✅ Encode button with visual feedback
- ✅ Download encoded image button
- ✅ Status messages and error handling

### Decode Page (decode.html)
- ✅ Image upload input
- ✅ Optional password input
- ✅ Decode button with loading state
- ✅ Decoded message display
- ✅ Status messages and error handling

### CSS Styling (css/style.css)
- ✅ Dark mode (primary: #0f172a, secondary: #1e293b)
- ✅ Glassmorphism cards with blur effects
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern button styles with hover effects
- ✅ Form inputs with focus states
- ✅ Alert messages (success, error, info)
- ✅ Loading spinner animation
- ✅ Accessibility considerations

### Crypto Module (js/crypto.js)
- ✅ AES-GCM encryption
- ✅ PBKDF2 key derivation (100,000 iterations)
- ✅ Random salt generation (16 bytes)
- ✅ Random IV generation (12 bytes)
- ✅ encryptMessage(message, password)
- ✅ decryptMessage(encryptedData, password)
- ✅ Base64 encoding for transmission
- ✅ Error handling and validation

### Encode Module (js/encode.js)
- ✅ LSB steganography implementation
- ✅ Message delimiter (1111111111111110)
- ✅ Binary string conversion
- ✅ Image loading from file
- ✅ Canvas pixel manipulation
- ✅ Message capacity calculation
- ✅ Error handling for oversized messages
- ✅ PNG export with proper blob handling
- ✅ Download functionality
- ✅ UI integration with real-time feedback

### Decode Module (js/decode.js)
- ✅ LSB extraction from pixels
- ✅ Delimiter detection
- ✅ Binary to text conversion
- ✅ Optional decryption support
- ✅ Image loading from file
- ✅ Error handling for invalid images
- ✅ UI integration
- ✅ Status messages

### PWA Support (pwa/manifest.json)
- ✅ App name: "StegoSafe"
- ✅ Short name: "StegoSafe"
- ✅ Theme color: #0f172a
- ✅ Background color: #020617
- ✅ Display mode: standalone
- ✅ Icons: 192x192 and 512x512
- ✅ Start URL: /stegosafe/
- ✅ Scope: /stegosafe/

### Service Worker (pwa/service-worker.js)
- ✅ Static asset caching
- ✅ Cache versioning (stegosafe-v1)
- ✅ Install event with app shell caching
- ✅ Activate event with old cache cleanup
- ✅ Fetch event with network-first strategy
- ✅ Fallback for offline support
- ✅ Proper error handling

## 🔐 Security Features

✅ **End-to-End Encryption**: Messages encrypted before encoding
✅ **AES-GCM**: Industry-standard authenticated encryption
✅ **PBKDF2**: Secure password-to-key derivation (100,000 iterations)
✅ **Salted Hashing**: Random 16-byte salt per encryption
✅ **Random IV**: 12-byte random initialization vector
✅ **No Network**: All processing happens locally
✅ **Web Crypto API**: Uses browser's native cryptographic functions
✅ **Offline Support**: Full functionality without internet

## 🧪 Testing

### Test Encoding:
1. Open http://localhost:8000/stegosafe/encode.html
2. Upload any image
3. Enter message: "Hello, this is a secret message!"
4. Leave password empty
5. Click "Encode Message"
6. Click "Download Encoded Image"
7. Save the image

### Test Encoding with Password:
1. Repeat steps 1-2
2. Enter message: "This is encrypted!"
3. Enter password: "MyPassword123"
4. Click "Encode Message"
5. Download the image

### Test Decoding:
1. Open http://localhost:8000/stegosafe/decode.html
2. Upload the encoded image (from earlier test)
3. If password was used, enter it
4. Click "Decode Message"
5. Verify the message appears correctly

### Test PWA Installation:
1. Open the app in Chrome/Edge
2. Look for install button in address bar or menu
3. Click to install as app
4. App should launch as standalone window
5. Test offline: disconnect internet and verify app still works

## 📊 Message Capacity Examples

| Image Size | RGB Pixels | Bits Available | Bytes Available |
|-----------|-----------|----------------|-----------------|
| 192x192   | 36,864    | 110,592        | 13.8 KB         |
| 512x512   | 262,144   | 786,432        | 98.3 KB         |
| 1920x1080 | 2,073,600 | 6,220,800      | 777.6 KB        |

Note: Actual capacity may be reduced if image is compressed after encoding.

## 🐛 Troubleshooting

### Issue: Service Worker not registering
**Solution**: Must be served via HTTP/HTTPS, not file://
- Ensure you're accessing via http://localhost:8000

### Issue: Message not found when decoding
**Solution**: 
- Verify correct password if encryption was used
- Image may have been modified after encoding
- Use PNG format for best results

### Issue: "Message too large" error
**Solution**:
- Use a larger image
- Compress your message text
- Split into multiple images

### Issue: Cannot install as PWA
**Solution**:
- Must be served over HTTPS (or localhost for testing)
- Must have valid manifest.json
- Must have valid icons
- Use Chrome, Edge, or other Chromium browsers

## 📱 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅      | ✅     | Full support including PWA |
| Edge    | ✅      | ✅     | Full support including PWA |
| Firefox | ✅      | ✅     | Web Crypto API support required |
| Safari  | ✅      | ✅     | Web Crypto API support, limited PWA |

## 🔧 Customization

### Change App Colors
Edit `/stegosafe/css/style.css` at the top:
```css
:root {
  --primary: #0f172a;        /* Main background */
  --accent: #3b82f6;         /* Primary color */
  --accent-light: #60a5fa;   /* Light accent */
  /* ... */
}
```

### Change App Name
Edit `/stegosafe/pwa/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Your Name",
  /* ... */
}
```

### Update Icons
Replace `/stegosafe/assets/icons/icon-192.png` and `icon-512.png` with your own images.

## 📝 File Sizes

- **crypto.js**: ~8 KB (with comments)
- **encode.js**: ~13 KB (with comments)
- **decode.js**: ~11 KB (with comments)
- **style.css**: ~15 KB (with comments)
- **Total JS**: ~32 KB
- **Total CSS**: ~15 KB
- **Total Size** (without images): ~60 KB

All files are production-ready and well-commented.

## 🎓 Learning Resources

This project demonstrates:
- HTML5 Canvas API for pixel manipulation
- Web Crypto API for encryption
- Service Workers for offline functionality
- PWA manifest and installation
- Responsive web design
- Modern CSS with glassmorphism
- Vanilla JavaScript (no frameworks)
- Binary data manipulation
- Cryptographic concepts

## 📄 License & Legal

This is provided for educational and personal use. Users are responsible for compliance with local laws regarding encryption and data privacy.

## 🎉 You're Ready!

The application is fully functional and ready to use. Start the server and begin hiding secret messages in images!

**Happy encrypting! 🔐**

---

Generated: January 20, 2026
StegoSafe PWA - Complete Steganography Application
