// Site configuration types
export interface SiteConfig {
	title: string
	author: string
	headerTitle: string
	description: string
	language: string
	theme: 'light' | 'dark'
	siteUrl: string
	siteRepo: string
	siteLogo: string
	image: string
	socialBanner: string
	email: string
	github: string
	twitter: string
	linkedin: string
	locale: string
}

export interface NavLink {
	href: string
	title: string
}

// Project types
export interface Project {
	title: string
	description: string
	imgSrc: string
	href: string
	externalHref?: string
	clientName?: string
	clientURL?: string
	date?: string
	skills?: string[]
}

// Blog post types (from content collections)
export interface BlogFrontmatter {
	title: string
	description: string
	date: Date
	tags: string[]
	draft: boolean
	image?: string
}

// Social link types
export interface SocialLink {
	name: string
	href: string
	icon: 'github' | 'twitter' | 'linkedin'
}
