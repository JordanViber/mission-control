export function projectNameToSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function projectHref(project?: string | null) {
  if (!project) return '/projects';
  return `/projects/${projectNameToSlug(project)}`;
}
