import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) =>{
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      //设置别名:src路劲转化@....
      alias: {
          '@': resolve(__dirname, 'src'),
          components: resolve(__dirname, './src/components'),
          assets: resolve(__dirname, './src/assets'),
          '#': resolve(__dirname, 'types'),
          build: resolve(__dirname, 'build'),
      },
      // 省略文件扩展名
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }, 
    plugins: [
      vue(),
      // mock服务
      viteMockServe({
        supportTs: false,
        logger: false,
        mockPath: "./src/mock/",
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      //按需加载Antd组件
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
          ElementPlusResolver()
        ],
      }),
    ],
    server: {
      open: true,//启动项目自动弹出浏览器
      hmr: true, //开启热加载
      host: true,//监听所有地址
      port: 5173,//启动端口
      //proxy: createProxy(env.VITE_APP_API_HOST),
      proxy: {
          '/api': {
              target:  env.VITE_APP_API_HOST,//'http://localhost:8080' 后端服务实际地址
              changeOrigin: true,//开启代理
              rewrite: path => path.replace(/^\/api/,'') // 将请求中/api用空值替换重写
          },
      }
  }
  }
})
