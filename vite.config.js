import { defineConfig } from "vite";
import vitePluginsAutoI18n, {
	VolcengineTranslator,
} from "vite-auto-i18n-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr(),
		vitePluginsAutoI18n({
			translator: new VolcengineTranslator({
				apiKey: "c7ad927b-6a48-4059-901e-fb7c325e78b4",
				model: "doubao-1.5-lite-32k-250115",
			}),
			targetLangList: ["en", "fr", "ja"],
			originLang: "zh-cn",
			insertFileExtensions: [".jsx"],
			translateType: "semi-auto",
			translateKey: "t",
		}),
	],
	envPrefix: "APP_", // 设置环境变量前缀
});
