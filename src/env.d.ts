/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Environment variables
interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

// Extend Window interface for custom properties
declare global {
	interface Window {
		theme?: 'light' | 'dark'
	}
}

export {}
