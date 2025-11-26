import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mergeConfig, type UserConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
        allowedHosts: true,
    },
  });
};

