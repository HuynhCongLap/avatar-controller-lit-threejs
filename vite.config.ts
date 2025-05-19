import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true,              // Tự động mở báo cáo sau khi build
          filename: 'bundle-stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
});
