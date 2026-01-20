import base64
import struct
import zlib

def create_png(width, height, color_data):
    """Create a simple PNG file with solid color and text overlay"""
    
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk (image header)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (image data) - solid color gradient background
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter type for each scanline
        for x in range(width):
            # Gradient effect
            r = int(15 + (x / width) * 50)  # 0f to ~3f
            g = int(23 + (y / height) * 40)  # 17 to ~35
            b = int(42 + ((x + y) / (width + height)) * 30)  # 2a to ~50
            raw_data += bytes([r, g, b])
    
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk (end)
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

# Create 192x192 icon
icon_192 = create_png(192, 192, None)
with open(r'd:\VS project\image msg\stegosafe\assets\icons\icon-192.png', 'wb') as f:
    f.write(icon_192)

# Create 512x512 icon
icon_512 = create_png(512, 512, None)
with open(r'd:\VS project\image msg\stegosafe\assets\icons\icon-512.png', 'wb') as f:
    f.write(icon_512)

print("Icons created successfully!")
