

// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import { createHtmlPlugin } from 'vite-plugin-html';

// export default defineConfig(({ mode }) => {
//   // Load environment variables
//   const env = loadEnv(mode, process.cwd());

//   return {
//     define: {
//       'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
//       'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY)
//     },
//     server: {
//       proxy: {
//         '/api': {
//           target: 'http://localhost:7500',
//           secure: false,
//         },
//       },
//     },
//     plugins: [react()],
//   }
// });


// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import { createHtmlPlugin } from 'vite-plugin-html';

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());

//   return {
//     define: {
//       'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
//     },
//     server: {
//       proxy: {
//         '/api': {
//           target: 'http://localhost:7500',
//           secure: false,
//         },
//       },
//     },
//     plugins: [
//       react(),
//       createHtmlPlugin({
//         inject: {
//           data: {
//             googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
//           },
//         },
//       }),
//     ],
//   };
// });


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  return {
    define: {
      'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
    },
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:7500',
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
          },
        },
      }),
      nodePolyfills({
        include: ['crypto', 'process', 'stream', 'util'],
        globals: { global: true, process: true },
      }),
    ],
  }
});
