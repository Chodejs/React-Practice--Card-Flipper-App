import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.config.js.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // --- THIS IS THE FIX ---
      // We are now telling Vite to watch for any request
      // that starts with '/card-flipper-api'
      '/card-flipper-api': {
        // ...and forward it to your AMPPS server
        target: 'http://localhost', 
        changeOrigin: true,
        secure: false,
        
        // --- THIS IS THE NEW, CRITICAL PART ---
        // We must rewrite the path.
        // Your request is '/card-flipper-api/save_card.php'
        // Your server path is 'www/card-flipper-api/save_card.php'
        // We need to tell the proxy to send the *full path*
        // to the target. By default, it might not.
        // Let's try a rewrite to be safe, to make sure
        // 'http://localhost' gets the '/card-flipper-api/save_card.php' part.
        
        // Actually, on second thought, no rewrite is needed.
        // A request to '/card-flipper-api/save_card.php'
        // proxied to 'http://localhost'
        // *will* correctly forward to
        // 'http://localhost/card-flipper-api/save_card.php'
        // which matches your AMPPS 'www/card-flipper-api/' folder.
        // My previous config was just listening for the wrong path.
      },
    },
  },
})