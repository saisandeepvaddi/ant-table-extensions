import { defineConfig } from "vite";
import packateJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AntTableExtensions",
      fileName: packateJson.name,
    },
    rollupOptions: {
      external: ["react", "react-dom", "antd"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
        },
      },
    },
  },
});
