import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy access to api/v1 endpoints
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Allow proxy to pass cookies for sessions or CSRF tokens
        cookieDomainRewrite: {
          '*': ''
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
            // Log headers for debugging but exclude sensitive data
            console.log('Headers:', Object.keys(req.headers).reduce((acc, key) => {
              if (!['cookie', 'authorization'].includes(key.toLowerCase())) {
                acc[key] = req.headers[key];
              } else {
                acc[key] = '[REDACTED]';
              }
              return acc;
            }, {}));
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
            // Check for specific error codes
            if (proxyRes.statusCode >= 400) {
              console.log('Error response status:', proxyRes.statusCode);
              console.log('Error response headers:', proxyRes.headers);
            }
          });
        }
      }
    }
  }
})
