import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'

export default defineConfig({
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisation du bundle
    target: 'es2015',
    minify: 'esbuild', // Utiliser esbuild (plus rapide que terser)
    sourcemap: false,
    
    // Configuration du chunking
    rollupOptions: {
      output: {
        // Chunking manuel par catégorie
        manualChunks: (id) => {
          // React core et React Router dans un chunk vendor-react
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          
          // Radix UI components dans un chunk vendor-ui
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
          
          // i18n dans un chunk vendor-i18n
          if (id.includes('node_modules/i18next') || 
              id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          
          // Audio libraries dans un chunk vendor-audio
          if (id.includes('node_modules/howler')) {
            return 'vendor-audio';
          }
          
          // Charts et visualisation dans un chunk vendor-charts
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3-')) {
            return 'vendor-charts';
          }
          
          // Supabase dans un chunk vendor-supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          
          // Utilitaires (date-fns, clsx, etc.) dans un chunk vendor-utils
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/class-variance-authority')) {
            return 'vendor-utils';
          }
          
          // Autres dépendances node_modules dans vendor-other
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
        
        // Naming pour les chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').slice(-1)[0] : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        
        // Naming pour les entry files
        entryFileNames: 'assets/[name]-[hash].js',
        
        // Naming pour les assets
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Limites de chunk size (warnings)
    chunkSizeWarningLimit: 500, // 500 KB warning
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
    exclude: [
      // Exclure les grandes librairies qui seront lazy loadées
      'recharts',
    ],
  },
  
  // Configuration du serveur de développement
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
})
