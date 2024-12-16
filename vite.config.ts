import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  //项目npm run build的时候要把下面这行打开
  // base: "/dist",
  plugins: [vue(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  createSvgIconsPlugin({
    // Specify the icon folder to be cached
    iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
    // Specify symbolId format
    symbolId: 'icon-[dir]-[name]',

    /**
     * custom insert position
     * @default: body-last
     */
    // inject?: 'body-last' | 'body-first'

    // /**
    //  * custom dom id
    //  * @default: __svg__icons__dom__
    //  */
    // customDomId: '__svg__icons__dom__',
  })
  ],
  // 反向代理
  server:{
    port: 6173,
    // proxy:{
    //   '/':{
    //     target:'http://www.haifengonline.top',
    //     changeOrigin:true,
    //     secure:false,
    //   }
    // }
  },

  resolve: {
    alias: {
      //@ts-ignore
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/global/global.module.scss";`
      }
    }
  }
})
