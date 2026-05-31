export const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const uniqueSlug = (name) => {
  const base = slugify(name);
  return base || `story-${Math.random().toString(36).slice(2, 8)}`;
};
