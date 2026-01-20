# 🚀 StegoSafe Quick Start Guide

## ⚡ 60-Second Setup

### Windows Users
1. **Open PowerShell** in the stegosafe folder
2. **Run**: `powershell -ExecutionPolicy Bypass -File start-server.ps1`
3. **Open browser**: http://localhost:8000/stegosafe/
4. **Done!** Start encoding/decoding messages

### macOS/Linux Users
```bash
cd stegosafe
python3 -m http.server 8000
# Open: http://localhost:8000/stegosafe/
```

---

## 📝 How to Use

### 1️⃣ Encoding a Message (Hide a Secret)

```
1. Click "Encode Message" on home page
2. Upload an image (PNG recommended)
3. Type your secret message
4. (Optional) Enter a password for encryption
5. Click "Encode Message" button
6. Click "Download Encoded Image"
7. Share the image! 🎯
```

**Example**:
- Message: "Meet me tomorrow at 3 PM"
- Password: "SecretPass123"
- Result: Image that looks normal but contains your secret!

### 2️⃣ Decoding a Message (Read a Secret)

```
1. Click "Decode Message" on home page
2. Upload the encoded image
3. (If password was used) Enter the password
4. Click "Decode Message" button
5. Read your secret message! ✅
```

---

## 🔒 Password-Protected Messages

### Encoding with Password
```
Message: "This is my secret"
Password: "MyPassword123"
Result: Message encrypted with AES-256-GCM before encoding
```

### Why Use Passwords?
- ✅ Military-grade AES-256 encryption
- ✅ PBKDF2 with 100,000 iterations
- ✅ Random salt prevents rainbow tables
- ✅ Recipient must know password to decrypt

---

## 📁 Project Files Explained

| File | Purpose |
|------|---------|
| **index.html** | Home page with navigation |
| **encode.html** | Hide messages in images |
| **decode.html** | Extract hidden messages |
| **css/style.css** | Modern dark UI design |
| **js/crypto.js** | Encryption/decryption |
| **js/encode.js** | Message hiding logic |
| **js/decode.js** | Message extraction logic |
| **pwa/manifest.json** | PWA app settings |
| **pwa/service-worker.js** | Offline support |

---

## 💡 Tips & Tricks

### Best Practices

✅ **Use PNG images** - No compression, preserves steganography
✅ **Larger images** - More capacity for messages (192x192 ≈ 14KB max)
✅ **Set passwords** - Extra security layer for important messages
✅ **Test first** - Encode test message before sharing

### Common Issues

❌ **Service Worker not working?**
- Must use HTTP/HTTPS, not `file://`
- Ensure server is running on localhost:8000

❌ **Image too small?**
- Use larger image (at least 256x256 recommended)
- Or split message across multiple images

❌ **Can't decode message?**
- Verify password is correct
- Image may have been re-compressed (use PNG)
- Image must be original encoded version

---

## 📊 Message Capacity

| Image Size | Max Message |
|-----------|------------|
| 100x100   | ~4 KB     |
| 256x256   | ~24 KB    |
| 512x512   | ~98 KB    |
| 1024x1024 | ~393 KB   |
| 2048x2048 | ~1.5 MB   |

---

## 🔐 Security Features

✅ **AES-256-GCM** - Military-grade encryption  
✅ **PBKDF2** - Secure password hashing  
✅ **Random Salt** - Prevents pre-computed attacks  
✅ **Random IV** - Prevents pattern analysis  
✅ **No Upload** - Everything stays on your computer  
✅ **Offline** - Works without internet  

---

## 📱 Install as App

### Desktop (Chrome/Edge)
1. Visit http://localhost:8000/stegosafe/
2. Click install button in address bar
3. Choose "Install StegoSafe"
4. App launches in standalone window

### Mobile (Android)
1. Open in Chrome
2. Tap ⋮ (three dots)
3. Select "Add to Home screen"
4. Tap on your home screen

### iOS/Safari
1. Open in Safari
2. Tap Share
3. Select "Add to Home Screen"
4. Name and confirm

---

## 🎮 Quick Test

### Test Without Password
```
1. Encode: "Hello, World!"
2. Leave password empty
3. Download image
4. Upload that image
5. Should show: "Hello, World!"
```

### Test With Password
```
1. Encode: "Secret message!"
2. Password: "test123"
3. Download image
4. Upload image
5. Password: "test123"
6. Should show: "Secret message!"
7. Try wrong password: "test456"
8. Should show: "Decryption failed"
```

---

## 🌐 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅      | ✅     | Best support |
| Edge    | ✅      | ✅     | Best support |
| Firefox | ✅      | ✅     | Good support |
| Safari  | ✅      | ✅     | Good support |

---

## ⚙️ Advanced Configuration

### Change App Name
Edit `pwa/manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Custom"
}
```

### Change Colors
Edit `css/style.css` at top:
```css
:root {
  --primary: #0f172a;
  --accent: #3b82f6;
}
```

### Change Icons
Replace images in `assets/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

---

## 🆘 Support

### Debugging
1. **Check console**: Press F12 → Console tab
2. **Check Service Worker**: DevTools → Application → Service Workers
3. **Clear cache**: DevTools → Application → Clear storage

### Common Errors

**"No hidden message found"**
- Image doesn't contain encoded message
- Try with different image

**"Decryption failed"**
- Wrong password entered
- Image has been modified/corrupted
- Try original image

**"Message too large"**
- Image too small for message
- Use larger image or shorter message

---

## 📚 Learn More

### How LSB Steganography Works
LSB = Least Significant Bit (the rightmost bit in binary)

```
RGB values: R=255 (11111111), G=200 (11001000), B=100 (01100100)
Message bit: 1
New RGB: R=11111111 (255), G=11001001 (201), B=01100100 (100)

Result: Virtually imperceptible! Only LSB changes.
```

### How AES-GCM Works
- Encrypts message before hiding in image
- Only encrypted binary visible
- Can't read message without password
- Detects if image is tampered with

---

## 🎯 Use Cases

- 📬 **Private Messages**: Send to friends securely
- 🤫 **Secret Notes**: Hide in cloud photos
- 🔒 **Sensitive Data**: Protect documents in images
- 🕵️ **Covert Communication**: Hide in plain sight
- 📸 **Digital Watermarking**: Mark photos as yours
- 🎓 **Learning**: Understand cryptography

---

## ⚠️ Legal Notice

Use StegoSafe responsibly. Comply with local laws regarding:
- Encryption regulations
- Data privacy
- Intellectual property
- Communication security

The author assumes no liability for misuse.

---

## 🎉 You're All Set!

Start encoding secrets into images now:

1. **Encode**: Hide a message in an image
2. **Download**: Save the image
3. **Share**: Send to anyone
4. **Decode**: They retrieve the message (with password!)

**Happy encrypting! 🔐**

---

**StegoSafe** - Hide secrets. Keep them safe.  
Version 1.0 | January 2026
