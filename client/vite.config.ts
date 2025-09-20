import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://ec2-16-176-24-111.ap-southeast-2.compute.amazonaws.com:4000",
        changeOrigin: true,
      },
    },
  },
});
