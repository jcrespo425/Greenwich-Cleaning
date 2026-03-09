import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "services", "index.html"),
        about: resolve(__dirname, "about", "index.html"),
        serviceArea: resolve(__dirname, "service-area", "index.html"),
        contact: resolve(__dirname, "contact", "index.html"),
        thankYou: resolve(__dirname, "thank-you", "index.html")
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 4173
  }
});
