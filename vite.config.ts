import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
  'import.meta.env.VITE_AUTH_DOMAIN': JSON.stringify(env.VITE_AUTH_DOMAIN),
  'import.meta.env.VITE_PROJECT_ID': JSON.stringify(env.VITE_PROJECT_ID),
  'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(env.VITE_STORAGE_BUCKET),
  'import.meta.env.VITE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_MESSAGING_SENDER_ID),
  'import.meta.env.VITE_APP_ID': JSON.stringify(env.VITE_APP_ID),
  'import.meta.env.VITE_FIRESTORE_DB': JSON.stringify(env.VITE_FIRESTORE_DB),
},
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
          register: path.resolve(__dirname, 'register.html'),
          freelancer_profile: path.resolve(__dirname, 'freelancer_profile.html'),
          client_profile: path.resolve(__dirname, 'client_profile.html'),
          admin_dashboard: path.resolve(__dirname, 'admin_dashboard.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          matched_projects: path.resolve(__dirname, 'matched_projects.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
