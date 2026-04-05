/**
 * URL path segment for tag pages (`/tags/{segment}/`). Lowercase for stable,
 * crawler-friendly URLs while frontmatter can keep mixed-case labels.
 */
export function tagToUrlPath(tag: string): string {
	return tag.toLowerCase()
}
