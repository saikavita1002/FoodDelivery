import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // default Vite port is 5173; set to 3000 to match the rest of this guide
  },
});
