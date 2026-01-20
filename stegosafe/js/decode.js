/**
 * Decode Module for StegoSafe
 * Extracts hidden messages from images using LSB steganography
 */

const DecodeModule = (() => {
  // Delimiter to mark end of message (16 ones in binary)
  const MESSAGE_DELIMITER = '1111111111111110';

  /**
   * Convert string to binary representation
   * @param {string} str - String to convert
   * @returns {string} Binary string
   */
  function stringToBinary(str) {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      binary += str.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
  }

  /**
   * Convert binary string to regular string
   * @param {string} binary - Binary string
   * @returns {string} Regular string
   */
  function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substring(i, i + 8);
      if (byte.length < 8) break;
      str += String.fromCharCode(parseInt(byte, 2));
    }
    return str;
  }

  /**
   * Extract a message from image using LSB steganography
   * @param {HTMLCanvasElement} canvas - Canvas with image
   * @param {string} password - Optional password for decryption
   * @returns {Promise<string>} Decoded message
   */
  /**
   * Decompress message using LZ-based algorithm
   * @param {string} str - Compressed string
   * @returns {string} Decompressed string
   */
  function decompress(str) {
    const result = [];
    let dict = {};
    for (let i = 0; i < 256; i++) dict[i] = String.fromCharCode(i);
    let dictSize = 256;
    let w = String.fromCharCode(str.charCodeAt(0));
    result.push(w);
    for (let i = 1; i < str.length; i++) {
      const c = str.charCodeAt(i);
      const entry = c < dictSize ? dict[c] : (dict[w] + w[0]);
      result.push(entry);
      dict[dictSize++] = w + entry[0];
      w = entry;
    }
    return result.join('');
  }

  async function decodeMessage(canvas, password) {
    try {
      if (!canvas) {
        throw new Error('Canvas is required');
      }

      // Get image data
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Extract LSB bits from RGB channels (1-bit depth)
      let binary = '';
      const delimiterBinary = MESSAGE_DELIMITER;
      let foundDelimiter = false;

      for (let i = 0; i < data.length && !foundDelimiter; i += 4) {
        // Extract from R channel (LSB only)
        binary += (data[i] & 1);
        if (binary.length >= delimiterBinary.length &&
            binary.slice(-delimiterBinary.length) === delimiterBinary) {
          foundDelimiter = true;
          binary = binary.slice(0, -delimiterBinary.length);
          break;
        }

        // Extract from G channel (LSB only)
        binary += (data[i + 1] & 1);
        if (binary.length >= delimiterBinary.length &&
            binary.slice(-delimiterBinary.length) === delimiterBinary) {
          foundDelimiter = true;
          binary = binary.slice(0, -delimiterBinary.length);
          break;
        }

        // Extract from B channel (LSB only)
        binary += (data[i + 2] & 1);
        if (binary.length >= delimiterBinary.length &&
            binary.slice(-delimiterBinary.length) === delimiterBinary) {
          foundDelimiter = true;
          binary = binary.slice(0, -delimiterBinary.length);
          break;
        }
      }

      if (!foundDelimiter) {
        throw new Error('No hidden message found in this image');
      }

      // Convert binary to string
      let message = binaryToString(binary);

      // Check if message is compressed (starts with null byte)
      if (message[0] === '\x00') {
        message = message.substring(1); // Remove marker
        message = decompress(message); // Decompress
      }

      // Check if encrypted and decrypt if needed
      if (password && password.trim() !== '') {
        try {
          message = await CryptoModule.decryptMessage(message, password);
        } catch (error) {
          throw new Error(`Decryption failed: ${error.message}`);
        }
      }

      return message;
    } catch (error) {
      throw new Error(`Decoding failed: ${error.message}`);
    }
  }

  /**
   * Load image from file input and return canvas
   * @param {File} file - Image file
   * @returns {Promise<HTMLCanvasElement>} Canvas with image
   */
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          resolve(canvas);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  // Public API
  return {
    decodeMessage,
    loadImage,
    copyToClipboard: (text) => navigator.clipboard.writeText(text),
    stringToBinary,
    binaryToString
  };
})();

// ============================================
// UI Initialization for Decode Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const dragZone = document.getElementById('dragZone');
  const imageInput = document.getElementById('imageInput');
  const passwordInput = document.getElementById('passwordInput');
  const decodeBtn = document.getElementById('decodeBtn');
  const copyBtn = document.getElementById('copyBtn');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const messageBox = document.getElementById('messageBox');
  const messageOutput = document.getElementById('messageOutput');
  const statusMessage = document.getElementById('statusMessage');
  const imageInfo = document.getElementById('imageInfo');
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');

  let decodedCanvas = null;
  let decodedMessage = '';

  // Drag & Drop Setup
  if (dragZone) {
    dragZone.addEventListener('click', () => imageInput.click());
    dragZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragZone.classList.add('drag-over');
    });
    dragZone.addEventListener('dragleave', () => {
      dragZone.classList.remove('drag-over');
    });
    dragZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dragZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) {
        imageInput.files = e.dataTransfer.files;
        imageInput.dispatchEvent(new Event('change'));
      }
    });
  }

  /**
   * Handle image selection
   */
  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      clearStatus();
      const canvas = await DecodeModule.loadImage(file);
      decodedCanvas = canvas;

      const previewUrl = canvas.toDataURL('image/png');
      previewImage.src = previewUrl;
      previewContainer.classList.remove('hidden');

      if (imageInfo) {
        document.getElementById('imageSize').textContent = `${canvas.width}×${canvas.height}`;
        document.getElementById('imageFormat').textContent = file.type.split('/')[1].toUpperCase();
        imageInfo.classList.remove('hidden');
      }

      showStatus(`Image loaded: ${canvas.width}×${canvas.height}`, 'success');
    } catch (error) {
      showStatus(`Error loading image: ${error.message}`, 'error');
    }
  });

  /**
   * Handle decoding
   */
  decodeBtn.addEventListener('click', async () => {
    try {
      clearStatus();

      if (!decodedCanvas) {
        showStatus('Please select an image first', 'error');
        return;
      }

      decodeBtn.disabled = true;
      decodeBtn.textContent = 'Decoding...';
      if (progressContainer) progressContainer.classList.remove('hidden');

      const password = passwordInput.value;

      decodedMessage = await DecodeModule.decodeMessage(
        decodedCanvas, 
        password,
        (progress) => {
          if (progressFill) {
            progressFill.style.width = progress + '%';
            progressPercent.textContent = Math.floor(progress) + '%';
          }
        }
      );

      messageOutput.textContent = decodedMessage;
      messageBox.classList.remove('hidden');
      copyBtn.classList.remove('hidden');

      showStatus('Message decoded successfully!', 'success');
    } catch (error) {
      showStatus(`Decoding error: ${error.message}`, 'error');
    } finally {
      decodeBtn.disabled = false;
      decodeBtn.textContent = '🔓 Decode Message';
      if (progressContainer) progressContainer.classList.add('hidden');
    }
  });

  /**
   * Handle copy button
   */
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await DecodeModule.copyToClipboard(decodedMessage);
        showStatus('Copied to clipboard!', 'success');
      } catch (error) {
        showStatus(`Copy failed: ${error.message}`, 'error');
      }
    });
  }

  /**
   * Show status message
   */
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type}`;
    statusMessage.classList.remove('hidden');
  }

  /**
   * Clear status message
   */
  function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'alert hidden';
  }

  // Allow Enter key to decode
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      decodeBtn.click();
    }
  });
});
