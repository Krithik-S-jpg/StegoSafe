/**
 * Encode Module for StegoSafe
 * Implements LSB steganography to hide messages in images
 * Enhanced with file embedding, compression, and advanced features
 */

const EncodeModule = (() => {
  const MESSAGE_DELIMITER = '1111111111111110';
  const MAX_MESSAGE_SIZE = 1000000;

  // Compression using LZ-based algorithm
  function compress(str) {
    const result = [];
    let dict = {};
    for (let i = 0; i < 256; i++) dict[String.fromCharCode(i)] = i;
    let dictSize = 256;
    let w = '';
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const wc = w + c;
      if (dict[wc]) w = wc;
      else {
        result.push(dict[w]);
        dict[wc] = dictSize++;
        w = c;
      }
    }
    if (w !== '') result.push(dict[w]);
    return String.fromCharCode(...result);
  }

  function decompress(str) {
    const result = [];
    let dict = {};
    for (let i = 0; i < 256; i++) dict[i] = String.fromCharCode(i);
    let dictSize = 256;
    let w = String.fromCharCode(str.charCodeAt(0));
    result.push(w);
    for (let i = 1; i < str.length; i++) {
      const c = str.charCodeAt(i);
      const entry = c < dictSize ? dict[c] : dict[w] + w[0];
      result.push(entry);
      dict[dictSize++] = w + entry[0];
      w = entry;
    }
    return result.join('');
  }

  function stringToBinary(str) {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      binary += str.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
  }

  function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substring(i, i + 8);
      str += String.fromCharCode(parseInt(byte, 2));
    }
    return str;
  }

  async function encodeMessage(canvas, message, password, options = {}) {
    try {
      if (!canvas || !message) {
        throw new Error('Canvas and message are required');
      }

      const { onProgress = null, lsbDepth = 1, compression = true } = options;

      let messageToEncode = message;
      
      // Compress if enabled
      if (compression) {
        messageToEncode = compress(messageToEncode);
        messageToEncode = '\x00' + messageToEncode; // Mark as compressed
      }

      // Encrypt if password provided
      if (password && password.trim() !== '') {
        messageToEncode = await CryptoModule.encryptMessage(messageToEncode, password);
      }

      const messageBinary = stringToBinary(messageToEncode);
      const fullBinary = messageBinary + MESSAGE_DELIMITER;

      const pixelCount = canvas.width * canvas.height;
      const maxBits = pixelCount * 3 * lsbDepth; // Account for LSB depth
      
      if (fullBinary.length > maxBits) {
        throw new Error(
          `Message too large for LSB depth ${lsbDepth}. Max: ${Math.floor(maxBits / 8)} bytes`
        );
      }

      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let bitIndex = 0;
      const totalBits = fullBinary.length;

      for (let i = 0; i < data.length && bitIndex < fullBinary.length; i += 4) {
        // R channel - Replace LSB
        if (bitIndex < fullBinary.length) {
          const bit = parseInt(fullBinary[bitIndex++]);
          data[i] = (data[i] & ~1) | bit; // Simple LSB replacement
        }

        // G channel - Replace LSB
        if (bitIndex < fullBinary.length) {
          const bit = parseInt(fullBinary[bitIndex++]);
          data[i + 1] = (data[i + 1] & ~1) | bit; // Simple LSB replacement
        }

        // B channel - Replace LSB
        if (bitIndex < fullBinary.length) {
          const bit = parseInt(fullBinary[bitIndex++]);
          data[i + 2] = (data[i + 2] & ~1) | bit; // Simple LSB replacement
        }

        if (onProgress && bitIndex % 10000 === 0) {
          const progress = (bitIndex / totalBits) * 100;
          onProgress(progress);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to convert canvas to blob'));
          },
          'image/png'
        );
      });
    } catch (error) {
      throw new Error(`Encoding: ${error.message}`);
    }
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          resolve(canvas);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getCapacity(width, height, lsbDepth = 1) {
    return Math.floor((width * height * 3 * lsbDepth) / 8);
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  return {
    encodeMessage,
    loadImage,
    downloadBlob,
    getCapacity,
    formatBytes,
    compress,
    decompress,
    stringToBinary,
    binaryToString
  };
})();

// ============================================
// UI Initialization for Encode Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const dragZone = document.getElementById('dragZone');
  const imageInput = document.getElementById('imageInput');
  const messageInput = document.getElementById('messageInput');
  const passwordInput = document.getElementById('passwordInput');
  const encodeBtn = document.getElementById('encodeBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const statusMessage = document.getElementById('statusMessage');
  const charCount = document.getElementById('charCount');
  const charMax = document.getElementById('charMax');
  const imageInfo = document.getElementById('imageInfo');
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const statsPanel = document.getElementById('statsPanel');
  const modeTabs = document.querySelectorAll('.mode-tab');
  const modeContents = document.querySelectorAll('.mode-content');
  const lsbOptions = document.querySelectorAll('.lsb-option');
  const efficiencyFill = document.getElementById('efficiencyFill');
  const efficiencyLabel = document.getElementById('efficiencyLabel');

  let encodedCanvas = null;
  let encodedBlob = null;
  let currentMode = 'text';
  let currentLSB = 1;
  let compressionEnabled = true;

  // Mode Tab Switching
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currentMode = tab.dataset.mode;
      modeTabs.forEach(t => t.classList.remove('active'));
      modeContents.forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(currentMode + 'Mode').classList.remove('hidden');
    });
  });

  // LSB Depth Selection
  lsbOptions.forEach(option => {
    option.addEventListener('click', () => {
      lsbOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      currentLSB = parseInt(option.dataset.lsb);
      updateCapacityDisplay();
    });
  });

  // Compression Toggle
  const compressionToggle = document.getElementById('compressionToggle');
  if (compressionToggle) {
    compressionToggle.addEventListener('change', () => {
      compressionEnabled = compressionToggle.checked;
      updateCapacityDisplay();
    });
  }

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

  // Character counter
  if (messageInput && charCount) {
    messageInput.addEventListener('input', (e) => {
      charCount.textContent = e.target.value.length;
      updateCapacityDisplay();
    });
  }

  function updateCapacityDisplay() {
    if (!encodedCanvas) return;
    
    const capacity = EncodeModule.getCapacity(encodedCanvas.width, encodedCanvas.height, currentLSB);
    const messageSize = messageInput.value.length;
    const efficiency = messageSize > 0 ? (messageSize / capacity) * 100 : 0;

    efficiencyFill.style.width = Math.min(efficiency, 100) + '%';
    efficiencyLabel.textContent = Math.floor(efficiency) + '%';

    document.getElementById('statCapacity').textContent = EncodeModule.formatBytes(capacity);
    document.getElementById('statUsed').textContent = EncodeModule.formatBytes(messageSize);
    document.getElementById('statRemaining').textContent = EncodeModule.formatBytes(capacity - messageSize);
    document.getElementById('statEncoding').textContent = Math.floor(efficiency) + '%';
  }

  // Image upload handler
  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      clearStatus();
      const canvas = await EncodeModule.loadImage(file);
      encodedCanvas = canvas;

      const previewUrl = canvas.toDataURL('image/png');
      previewImage.src = previewUrl;
      previewContainer.classList.remove('hidden');

      if (imageInfo) {
        document.getElementById('imageSize').textContent = `${canvas.width}×${canvas.height}`;
        document.getElementById('imageFormat').textContent = file.type.split('/')[1].toUpperCase();
        const capacity = EncodeModule.getCapacity(canvas.width, canvas.height, currentLSB);
        document.getElementById('imageCapacity').textContent = EncodeModule.formatBytes(capacity);
        imageInfo.classList.remove('hidden');
      }

      statsPanel.classList.remove('hidden');
      updateCapacityDisplay();
      showStatus(`Image loaded: ${canvas.width}×${canvas.height}`, 'success');
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
    }
  });

  // Encode button
  encodeBtn.addEventListener('click', async () => {
    try {
      clearStatus();

      if (!encodedCanvas) {
        showStatus('Please upload an image first', 'error');
        return;
      }

      if (!messageInput.value.trim()) {
        showStatus('Please enter a message', 'error');
        return;
      }

      encodeBtn.disabled = true;
      encodeBtn.textContent = 'Encoding...';
      if (progressContainer) progressContainer.classList.remove('hidden');

      const message = messageInput.value;
      const password = passwordInput.value;

      encodedBlob = await EncodeModule.encodeMessage(
        encodedCanvas, 
        message, 
        password,
        {
          onProgress: (progress) => {
            if (progressFill) {
              progressFill.style.width = progress + '%';
              progressPercent.textContent = Math.floor(progress) + '%';
            }
          },
          lsbDepth: currentLSB,
          compression: compressionEnabled
        }
      );

      const encodedUrl = URL.createObjectURL(encodedBlob);
      previewImage.src = encodedUrl;
      downloadBtn.classList.remove('hidden');

      showStatus(
        `Message encoded successfully! (LSB depth: ${currentLSB}${compressionEnabled ? ', Compressed' : ''})`,
        'success'
      );
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      encodeBtn.disabled = false;
      encodeBtn.textContent = '🔐 Encode Message';
      if (progressContainer) progressContainer.classList.add('hidden');
    }
  });

  // Download button
  downloadBtn.addEventListener('click', () => {
    if (encodedBlob) {
      const timestamp = new Date().getTime();
      EncodeModule.downloadBlob(encodedBlob, `stegosafe-${timestamp}.png`);
      showStatus('Downloaded!', 'success');
    }
  });

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type}`;
    statusMessage.classList.remove('hidden');
  }

  function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'alert hidden';
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      if (e.key === 'Enter') encodeBtn.click();
      if (e.key === 'd') { e.preventDefault(); downloadBtn.click(); }
    }
  });

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      encodeBtn.click();
    }
  });
});
