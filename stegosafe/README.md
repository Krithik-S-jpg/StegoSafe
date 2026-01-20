# StegoSafe - Image Steganography PWA

A complete, production-ready Progressive Web Application for hiding secret messages inside images using LSB (Least Significant Bit) steganography with optional AES-GCM encryption.

## 🚀 Features

- **LSB Steganography**: Hide messages in the least significant bits of image pixels
- **AES-GCM Encryption**: Optional password-based encryption using Web Crypto API
- **PBKDF2 Key Derivation**: Secure password-to-key derivation with 100,000 iterations
- **PWA Support**: Installable on mobile and desktop with offline support
- **Dark Modern UI**: Glassmorphism design with smooth animations
- **No External Dependencies**: Pure HTML5, CSS3, and Vanilla JavaScript
- **100% Offline**: All processing happens in the browser, no server required
- **Responsive Design**: Works perfectly on all device sizes

## 📁 Project Structure

```
stegosafe/
├── index.html              # Home page
├── encode.html             # Message encoding page
├── decode.html             # Message decoding page
├── css/
│   └── style.css          # Modern dark UI with glassmorphism
├── js/
│   ├── crypto.js          # AES-GCM encryption/decryption
│   ├── encode.js          # LSB encoding logic
│   └── decode.js          # LSB decoding logic
├── pwa/
│   ├── manifest.json      # PWA manifest
│   └── service-worker.js  # Service worker for offline support
├── assets/
│   └── icons/
│       ├── icon-192.png   # PWA icon (192x192)
│       └── icon-512.png   # PWA icon (512x512)
└── README.md              # This file
```

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Canvas API**: For pixel manipulation
- **Web Crypto API**: For AES-GCM encryption
- **PWA**: Web App Manifest + Service Worker
- **No External Libraries**: Everything built from scratch

## 🚀 Getting Started

### Quick Start with Python HTTP Server

```bash
cd stegosafe
python -m http.server 8000
```

Then open `http://localhost:8000/stegosafe/` in your browser.

### Quick Start with Node.js

```bash
npx http-server stegosafe -p 8000
```

### Running with any HTTP Server

You can use any HTTP server to serve the files:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000

# Using Ruby
ruby -run -ehttpd . -p8000
```

**Important**: Must be served over HTTP(S), not `file://` protocol for Service Worker to work.

## 📱 Installation as PWA

### On Desktop (Chrome/Edge)
1. Click the install button in the address bar or browser menu
2. Follow the prompts to install the app

### On Mobile (Android)
1. Open in Chrome
2. Tap the three-dot menu
3. Select "Add to Home screen"

### On iOS
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🔐 How It Works

### Encoding (Hiding a Message)

1. **Image Loading**: Load image onto HTML5 Canvas
2. **Message Encryption**: If password provided, encrypt using AES-GCM
3. **Binary Conversion**: Convert message to binary string
4. **LSB Modification**: Replace the least significant bit of each RGB pixel component
5. **Delimiter**: Add binary delimiter `1111111111111110` to mark message end
6. **Export**: Save as PNG image

### Decoding (Extracting a Message)

1. **Image Loading**: Load image onto HTML5 Canvas
2. **LSB Extraction**: Read the LSB from each pixel RGB component
3. **Delimiter Detection**: Stop reading at delimiter
4. **Binary to Text**: Convert binary back to text
5. **Decryption**: If password provided, decrypt using AES-GCM
6. **Display**: Show the recovered message

## 🛡️ Security

### Encryption Details

- **Algorithm**: AES-GCM (authenticated encryption)
- **Key Size**: 256-bit
- **Key Derivation**: PBKDF2-SHA256 with 100,000 iterations
- **Salt**: 16 random bytes
- **IV**: 12 random bytes
- **Authentication Tag**: 128-bit

### Security Best Practices

- Messages are encrypted client-side before encoding
- Service Worker cached files are versioned
- No data is ever transmitted to any server
- All processing happens locally in the browser
- Uses Web Crypto API (constant-time operations)

## 📊 Capacity

Message capacity depends on image size and compression:

- **192x192 image**: ~13.8 KB (uncompressed)
- **512x512 image**: ~98 KB (uncompressed)
- **1920x1080 image**: ~777 KB (uncompressed)

Each pixel stores 3 bits (one per RGB channel). Capacity = (width × height × 3) / 8 bytes

## 🐛 Troubleshooting

### Service Worker Not Registering

- Must be served over HTTPS or localhost
- Check browser console for registration errors
- Clear browser cache and reload

### Message Not Found When Decoding

- Verify the image contains an encoded message
- Check password is correct if encryption was used
- Image may have been compressed after encoding (use PNG to preserve)

### Message Too Large Error

- Use a larger image
- Try compressing the message text
- Split very long messages into multiple images

## 📝 Example Usage

### Encode a Secret Message

1. Go to "Encode Message" page
2. Upload a PNG image
3. Enter: `Meet me at the coffee shop tomorrow at 3 PM`
4. Enter password: `MySecretPass123`
5. Click "Encode Message"
6. Download the encoded image
7. Share the image - no one can tell it contains a message!

### Decode the Message

1. Go to "Decode Message" page
2. Upload the encoded image
3. Enter password: `MySecretPass123`
4. Click "Decode Message"
5. See the recovered message

## 🎨 Customization

### Change Theme Colors

Edit `css/style.css` CSS variables:

```css
:root {
  --primary: #0f172a;
  --accent: #3b82f6;
  /* ... */
}
```

### Modify Icon

Replace `assets/icons/icon-192.png` and `icon-512.png` with your own 192x192 and 512x512 PNG files.

## 📄 License

This project is provided as-is for educational and personal use.

## ⚖️ Legal Notice

Users are responsible for complying with local laws and regulations regarding encryption, steganography, and data privacy. The author assumes no liability for misuse.

## 🤝 Contributing

Feel free to fork, modify, and improve this project.

## 📞 Support

For issues or questions, open an issue or submit a pull request.

---

**Made with ❤️ for privacy and security.**
