import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export default defineConfig({
	site: "https://johanguse.dev",
	trailingSlash: "always",
	output: "static",
	compressHTML: false,
	build: {
		inlineStylesheets: "auto",
	},
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
		svgo: true,
		rustCompiler: true,
		queuedRendering: {
			enabled: true,
			contentCache: true,
		},
	},
	prefetch: {
		defaultStrategy: "hover",
	},
	integrations: [react(), mdx(), sitemap()],
	devToolbar: {
		enabled: false,
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(
					browserslist([
						"> 0.5%",
						"last 2 versions",
						"Firefox ESR",
						"not dead",
						"cover 80% in CN",
						"unreleased versions",
					]),
				),
			},
		},
		build: {
			minify: false,
			cssMinify: false,
		},
		plugins: [tailwindcss()],
	},
});
