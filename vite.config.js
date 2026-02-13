import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages project site: set to your repo name, e.g. base: '/shtouka/'
  // For username.github.io (root): use base: '/'
  base: '/shtouka/',
})
