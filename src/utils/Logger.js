// src/utils/Logger.js

// Cek apakah sedang di mode Development (Localhost)
const IS_DEV = import.meta.env.DEV; 

export const Logger = {
  // 1. Log INFO (Warna Biru/Hijau) - Untuk tracking biasa
  info: (componentName, action, data = null) => {
    if (!IS_DEV) return; // Jangan tampil di production
    
    const timestamp = new Date().toLocaleTimeString();
    console.groupCollapsed(`%c[${timestamp}] ℹ️ ${componentName}: ${action}`, 'color: #3b82f6; font-weight: bold;');
    if (data) {
        console.log('📦 Data:', data);
    }
    console.groupEnd();
  },

  // 2. Log SUCCESS (Warna Hijau Terang) - Sukses fetch/simpan
  success: (componentName, action, data = null) => {
    if (!IS_DEV) return;

    const timestamp = new Date().toLocaleTimeString();
    console.log(`%c[${timestamp}] ✅ ${componentName}: ${action}`, 'color: #10b981; font-weight: bold; background: #ecfdf5; padding: 2px 5px; border-radius: 4px;');
    if (data) console.log(data);
  },

  // 3. Log ERROR (Warna Merah) - Gagal API/Logic
  error: (componentName, action, error) => {
    // Error boleh tampil di production juga agar bisa dicek
    const timestamp = new Date().toLocaleTimeString();
    console.group(`%c[${timestamp}] ❌ ${componentName}: ${action}`, 'color: #ef4444; font-weight: bold; font-size: 1.1em;');
    console.error(error);
    console.groupEnd();
  },

  // 4. Log WARN (Warna Kuning) - Peringatan
  warn: (componentName, message) => {
    if (!IS_DEV) return;
    console.warn(`⚠️ [${componentName}] ${message}`);
  }
};