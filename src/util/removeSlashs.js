export function removeTrailingSlash(path) {
	return path.replace(/[/\\]+$/, '');
}

export function removeLeadingSlash(path) {
	return path.replace(/^[/\\]+/, '');
}

export function removeTrailingLeadingSlashs(path) {
  return removeTrailingSlash(removeLeadingSlash(path))
}
