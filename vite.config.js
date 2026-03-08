import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "services.html"),
        about: resolve(__dirname, "about.html"),
        serviceArea: resolve(__dirname, "service-area.html"),
        contact: resolve(__dirname, "contact.html"),
        thankYou: resolve(__dirname, "thank-you.html")
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 4173
  }
});
