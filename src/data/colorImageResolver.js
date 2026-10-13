const COLORLESS_WORDS = new Set(['transparent']);
const NON_PRODUCT_IMAGES = new Set(['accessory', 'lifestyle', 'logo', 'multi-color', 'technical']);

function getImageDescriptor(image) {
  const filename = image.slice(image.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '').toLowerCase();
  const parts = filename.split('__');
  return parts.length >= 3 ? parts.at(-2) : '';
}

function getColorGroups(color) {
  return String(color).toLowerCase().split('/')
    .map(group => group.split(/[^a-z0-9]+/).filter(word => word && !COLORLESS_WORDS.has(word)))
    .filter(group => group.length > 0);
}

export function resolveProductImageForColor(images, color) {
  if (!images?.length) return '/images/placeholder-pot.jpg';
  if (!color) return images[0];

  const groups = getColorGroups(color);
  const targetDescriptor = groups.map(group => group.join('-')).join('-');
  if (!targetDescriptor) return images[0];

  const descriptors = images.map(image => getImageDescriptor(image));
  const exactMatch = images.find((image, index) => descriptors[index] === targetDescriptor);
  if (exactMatch) return exactMatch;

  let bestImage = null;
  let bestScore = -Infinity;

  descriptors.forEach((descriptor, index) => {
    const parts = descriptor.split('-');
    if (!descriptor || NON_PRODUCT_IMAGES.has(parts[0])) return;

    let score = 0;
    groups.forEach((group, groupIndex) => {
      const matched = group.filter(word => parts.includes(word)).length;
      if (matched === group.length) score += (groupIndex + 1) * 3;
      else if (matched > 0) score += (groupIndex + 1) * matched;
    });
    if (score === 0) return;

    if (score > bestScore) {
      bestScore = score;
      bestImage = images[index];
    }
  });

  return bestImage || images[0];
}
