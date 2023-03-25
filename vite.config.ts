import { defineConfig } from "vite";
import packateJson from "./package.json";

export default defineConfig({
  base: "./",
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AntTableExtensions",
      fileName: packateJson.name,
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
