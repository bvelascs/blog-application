export function toUrlPath(path: string) {
  // replace all non alphanumerics characters with hyphen
  // then replace all sequential hyphens with single hyphen
  // then remove leading and trailing hyphens
  return path
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, "");
}