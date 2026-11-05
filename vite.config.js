import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vin1 from '../public/vin1.jpg';
import vin2 from '../public/vin2.jpg';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
})
