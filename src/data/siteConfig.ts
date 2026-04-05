import type { SiteConfig, NavLink } from '../types'

export const siteConfig: SiteConfig = {
	title: 'Johan Guse',
	author: 'Johan Guse',
	headerTitle: 'Johan Guse',
	description: 'My personal portfolio website and blog. A developer from Brazil.',
	language: 'en-us',
	theme: 'dark', // Resend defaults to dark
	siteUrl: 'https://johanguse.dev',
	siteRepo: 'https://github.com/johanguse/johanguse-dev',
	siteLogo: '/logo.png',
	image: '/avatar.png',
	socialBanner: '/twitter-card.png',
	email: 'johanguse@gmail.com',
	github: 'https://github.com/johanguse',
	twitter: 'https://twitter.com/johanguse',
	linkedin: 'https://www.linkedin.com/in/johanguse',
	locale: 'en-US',
}

export const navLinks: NavLink[] = [
	{ href: '/', title: 'Home' },
	{ href: '/blog/', title: 'Blog' },
	{ href: '/projects/', title: 'Projects' },
	{ href: '/about/', title: 'About' },
]
