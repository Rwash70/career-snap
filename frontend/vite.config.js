import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // CareerSnap frontend
    open: true, // auto-open browser tab
    host: true, // bind to 0.0.0.0 (fixes some localhost quirks)
    strictPort: true, // fail if the port is taken instead of silently switching
  },
});
