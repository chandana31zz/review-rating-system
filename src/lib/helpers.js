export const AVATAR_COLORS = [
  { bg: '#1e3a5c', color: '#5b9bd5' },
  { bg: '#2d1a4a', color: '#a07be0' },
  { bg: '#1a3528', color: '#4caf72' },
  { bg: '#3a1e1e', color: '#e07070' },
  { bg: '#2a2e1a', color: '#a8b840' },
  { bg: '#1a2e3a', color: '#40b8c8' },
  { bg: '#3a2a1a', color: '#d4904a' },
];

export function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export function getAvatarStyle(index) {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return { background: c.bg, color: c.color, border: `1px solid ${c.color}55` };
}

export function renderStars(n = 0) {
  const full = Math.min(5, Math.max(0, Math.round(n)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
