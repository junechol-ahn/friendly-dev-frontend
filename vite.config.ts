import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    {
      name: 'ignore-chrome-devtools-request',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            req.url?.split('?')[0] ===
            '/.well-known/appspecific/com.chrome.devtools.json'
          ) {
            res.statusCode = 404
            res.end()
            return
          }

          next()
        })
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
