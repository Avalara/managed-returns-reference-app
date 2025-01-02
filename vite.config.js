import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('env', env);
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/connect': {
          target: 'https://ai-awsfqa.avlr.sh',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
