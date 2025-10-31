export const normalizeKey = (key) => {
  if (!key) return '';
  return key
    .replace(/_/g, ' ') // Replace underscores
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
