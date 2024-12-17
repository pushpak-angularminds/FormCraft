import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Resolves the '@' alias to the 'src' folder
    },
  },
  base: '/FormCraft/', // Ensure the base path matches your GitHub repository name for deployment
});
