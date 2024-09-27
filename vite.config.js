import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/ai': {
  //       target: 'https://ai-awsfqa.avlr.sh',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/ai/, ''),
  //     },
  //   },
  //   port: 8080,
  //   open: true,
  // },
});
