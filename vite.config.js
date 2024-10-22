import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('env', env);
  return {
    define: {
      NODE_ENV: JSON.stringify(env.NODE_ENV),
      CRR_URL: JSON.stringify(env.VITE_CRR_URL),
      TOKEN_URL: JSON.stringify(env.VITE_TOKEN_URL),
    },
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
  };
});
