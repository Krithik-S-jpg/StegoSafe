/**
 * Advanced Features Module for StegoSafe
 * Includes message history, batch operations, and utility functions
 */

const FeaturesModule = (() => {
  // ============================================
  // MESSAGE HISTORY MANAGEMENT
  // ============================================

  const MAX_HISTORY = 20;
  const HISTORY_STORAGE_KEY = 'stegosafe_history';

  /**
   * Add message to history
   */
  function addToHistory(message, type = 'encode', metadata = {}) {
    try {
      let history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
      
      const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        preview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        type: type,
        length: message.length,
        metadata: metadata
      };

      history.unshift(entry);
      if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
      }

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      return entry;
    } catch (error) {
      console.warn('Failed to add to history:', error);
    }
  }

  /**
   * Get message history
   */
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    } catch (error) {
      console.warn('Failed to get history:', error);
      return [];
    }
  }

  /**
   * Clear message history
   */
  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear history:', error);
      return false;
    }
  }

  /**
   * Format timestamp to readable format
   */
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  // ============================================
  // MESSAGE ANALYSIS
  // ============================================

  /**
   * Analyze message quality/complexity
   */
  function analyzeMessage(message) {
    const analysis = {
      length: message.length,
      complexity: 0,
      characterTypes: {
        uppercase: 0,
        lowercase: 0,
        numbers: 0,
        special: 0,
        spaces: 0
      },
      entropy: 0,
      rating: 0
    };

    for (let char of message) {
      if (/[A-Z]/.test(char)) analysis.characterTypes.uppercase++;
      else if (/[a-z]/.test(char)) analysis.characterTypes.lowercase++;
      else if (/[0-9]/.test(char)) analysis.characterTypes.numbers++;
      else if (/\s/.test(char)) analysis.characterTypes.spaces++;
      else analysis.characterTypes.special++;
    }

    // Calculate complexity score (0-100)
    let complexityScore = 0;
    if (analysis.characterTypes.uppercase > 0) complexityScore += 20;
    if (analysis.characterTypes.lowercase > 0) complexityScore += 20;
    if (analysis.characterTypes.numbers > 0) complexityScore += 20;
    if (analysis.characterTypes.special > 0) complexityScore += 20;
    if (analysis.length > 100) complexityScore += 20;

    analysis.complexity = Math.min(complexityScore, 100);

    // Calculate entropy
    const freq = {};
    for (let char of message) {
      freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    for (let char in freq) {
      const p = freq[char] / message.length;
      entropy -= p * Math.log2(p);
    }
    analysis.entropy = entropy;

    // Rating based on entropy
    analysis.rating = Math.min((entropy / 8) * 100, 100);

    return analysis;
  }

  /**
   * Estimate compression ratio
   */
  function estimateCompression(message) {
    // Simple LZ estimation
    const compressedLength = message.length * 0.6; // Rough estimate
    const ratio = ((message.length - compressedLength) / message.length) * 100;
    return Math.max(0, Math.min(ratio, 100));
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Generate QR code text representation
   */
  function generateQRText(data) {
    // Simplified QR representation (actual QR would need a library)
    const lines = [];
    const size = 21;
    for (let i = 0; i < size; i++) {
      let line = '';
      for (let j = 0; j < size; j++) {
        line += ((i + j) % 2 === 0) ? '█' : ' ';
      }
      lines.push(line);
    }
    return lines.join('\n');
  }

  /**
   * Calculate file integrity hash (simple checksum)
   */
  function calculateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }

  /**
   * Format bytes to human readable
   */
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate statistics summary
   */
  function generateStatsSummary(imageWidth, imageHeight, messageLength, lsbDepth = 1) {
    const capacity = (imageWidth * imageHeight * 3 * lsbDepth) / 8;
    const efficiency = (messageLength / capacity) * 100;
    const remaining = capacity - messageLength;

    return {
      capacity: capacity,
      used: messageLength,
      remaining: remaining,
      efficiency: efficiency,
      imagePixels: imageWidth * imageHeight,
      lsbBits: imageWidth * imageHeight * 3 * lsbDepth
    };
  }

  /**
   * Batch encode multiple messages
   */
  async function batchEncode(messages, image, password, options = {}) {
    const results = [];
    const totalMessages = messages.length;

    for (let i = 0; i < totalMessages; i++) {
      try {
        const result = await EncodeModule.encodeMessage(
          image,
          messages[i],
          password,
          {
            ...options,
            onProgress: (progress) => {
              const totalProgress = ((i + (progress / 100)) / totalMessages) * 100;
              if (options.onBatchProgress) {
                options.onBatchProgress(totalProgress, i + 1, totalMessages);
              }
            }
          }
        );
        
        results.push({
          index: i,
          message: messages[i],
          success: true,
          data: result
        });
      } catch (error) {
        results.push({
          index: i,
          message: messages[i],
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Batch decode multiple images
   */
  async function batchDecode(images, password, options = {}) {
    const results = [];
    const totalImages = images.length;

    for (let i = 0; i < totalImages; i++) {
      try {
        const canvas = await EncodeModule.loadImage(images[i]);
        const message = await DecodeModule.decodeMessage(canvas, password);
        
        results.push({
          index: i,
          file: images[i].name,
          success: true,
          message: message
        });

        if (options.onBatchProgress) {
          options.onBatchProgress(((i + 1) / totalImages) * 100, i + 1, totalImages);
        }
      } catch (error) {
        results.push({
          index: i,
          file: images[i].name,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // ============================================
  // EXPORT UTILITIES
  // ============================================

  /**
   * Export history as JSON
   */
  function exportHistory() {
    const history = getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    return dataBlob;
  }

  /**
   * Export message as text file
   */
  function exportAsText(message, filename = 'message.txt') {
    const blob = new Blob([message], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export statistics as JSON
   */
  function exportStats(stats, filename = 'stats.json') {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================
  // NOTIFICATION SYSTEM
  // ============================================

  /**
   * Show notification toast
   */
  function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.maxWidth = '300px';
    toast.style.zIndex = '10000';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
  }

  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================

  /**
   * Register keyboard shortcuts
   */
  function registerShortcuts(callbacks = {}) {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter = Encode/Decode
      if (e.ctrlKey && e.key === 'Enter') {
        if (callbacks.encode) callbacks.encode();
      }
      
      // Ctrl+D = Decode
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (callbacks.decode) callbacks.decode();
      }
      
      // Ctrl+Shift+H = Show history
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        if (callbacks.history) callbacks.history();
      }
      
      // Ctrl+C = Copy (handled by browser)
      // Ctrl+V = Paste (handled by browser)
    });
  }

  // Public API
  return {
    // History
    addToHistory,
    getHistory,
    clearHistory,
    formatTime,

    // Analysis
    analyzeMessage,
    estimateCompression,
    generateStatsSummary,

    // Utilities
    generateQRText,
    calculateChecksum,
    formatBytes,

    // Batch Operations
    batchEncode,
    batchDecode,

    // Export
    exportHistory,
    exportAsText,
    exportStats,

    // Notifications
    showNotification,

    // Shortcuts
    registerShortcuts
  };
})();
