import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon.png", "icon.svg"],
      manifest: {
        name: "Subway surfers JSON editor",
        short_name: "SS Decrypted",
        description: "Subway surfers JSON editor",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
