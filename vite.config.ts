import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import removeConsole from 'vite-plugin-remove-console'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      dirs: ['./src/hooks/**/*.ts', './src/components/**/*.vue', './src/components/**/*.tsx', './src/utils/**/*.ts'],
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ['src/components', 'src/**/components'],
      extensions: ['vue', 'jsx', 'tsx', 'ts', 'js'],
      dts: './src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    removeConsole(),
    ElementPlus({}),
    viteCompression(),
    viteMockServe({
      mockPath: 'mock',
      enable: process.env.NODE_ENV === 'development',
      watchFiles: false,
    }),
  ],
  css: {
    postcss: {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
