/**
 * Format a date string to a human-readable format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
export function formatDate(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(dateObj)
}

/**
 * Format a date to ISO string
 * @param date - Date object
 * @returns ISO date string
 */
export function toISODate(date: Date): string {
	return date.toISOString()
}

/**
 * Get reading time estimate for text content
 * @param text - Text content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): number {
	const words = text.trim().split(/\s+/).length
	return Math.ceil(words / wordsPerMinute)
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default: "...")
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength - suffix.length).trim() + suffix
}

/**
 * Generate slug from text
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/**
 * Get unique tags from a list of items with tags
 * @param items - Items with tags property
 * @returns Sorted array of unique tags
 */
export function getUniqueTags<T extends { tags?: string[] }>(items: T[]): string[] {
	const tagSet = new Set<string>()
	
	items.forEach(item => {
		item.tags?.forEach(tag => tagSet.add(tag))
	})
	
	return Array.from(tagSet).sort()
}

/**
 * Group items by a key
 * @param items - Items to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
	return items.reduce((groups, item) => {
		const groupKey = String(item[key])
		if (!groups[groupKey]) {
			groups[groupKey] = []
		}
		groups[groupKey].push(item)
		return groups
	}, {} as Record<string, T[]>)
}
