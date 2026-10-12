/**
 * lib/utils.js — shared utility functions
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format AED price */
export function formatPrice(amount, currency = 'AED') {
  if (amount === null || amount === undefined) return 'Price on request';
  return `${currency} ${Number(amount).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format price range */
export function formatPriceRange(min, max, currency = 'AED') {
  if (min === null) return 'Price on request';
  if (min === max) return formatPrice(min, currency);
  return `${currency} ${Number(min).toLocaleString('en-AE', { minimumFractionDigits: 2 })} – ${Number(max).toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
}

/** Slugify a string */
export function slug(str) {
  return String(str).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Color → hex / CSS background mapping for accurate swatch display */
export const COLOR_HEX = {
  // Monochromes & neutrals
  'white':             '#FFFFFF',
  'bianco':            '#F8F9FA',
  'black':             '#1F1F1F',
  'black washed':      '#333333',
  'anthracite':        '#3B4247',
  'dark anthracite':   '#282C30',
  'dark grey':         '#4A4E54',
  'ash':               '#A0AAB2',
  'ash sky':           '#9BB8C7',
  'ash sky blue':      '#9BB8C7',
  'taupe':             '#9E8B76',
  'sabbia':            '#D8C6A5',
  'ivory':             '#FFFFF0',
  'powder':            '#D3C5D6',

  // Earth tones & ceramics
  'terracotta':        '#C55A38',
  'light terracotta':  '#DF7A58',
  'impruneta':         '#9E4732',
  'brick stone':       '#8B4232',
  'clay resnova':      '#8F7362',
  'nova clay':         '#987554',
  'nova carbon':       '#2E3338',
  'nova rock':         '#7A7D82',
  'rock res nova':     '#6E7278',
  'chocolate':         '#603813',

  // Greens & nature
  'pistachio':         '#94BA87',
  'pistachio green':   '#94BA87',
  'green':             '#43A047',
  'lime':              '#9CCC65',
  'sage':              '#7C9D86',

  // Brights & pastels
  'yellow':            '#FDD835',
  'orange':            '#FB8C00',
  'red':               '#E53935',
  'total red':         '#C62828',
  'fuchsia':           '#D81B60',
  'fushia':            '#D81B60',
  'pink':              '#EC407A',
  'rose':              '#E57373',
  'lilac':             '#BA68C8',
  'purple':            '#7E57C2',
  'dark purple':       '#4A148C',
  'blue':              '#1E88E5',

  // Metallic & luxury
  'gold':              '#D4AF37',
  'total gold':        '#D4AF37',
  'gold pearl':        '#E8D49E',
  'silver':            '#C0C0C0',
  'metallic copper':   '#B87333',
  'white gold':        '#F3E5AB',
  'black gold':        '#2E2619',

  // Transparents
  'transparent':       'rgba(240, 245, 250, 0.45)',

  // Transparent tint combinations (with frosted glass gradients)
  'transparent/lime':   'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(156,204,101,0.65) 100%)',
  'transparent/pink':   'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(236,64,122,0.6) 100%)',
  'transparent/violet': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(186,104,200,0.65) 100%)',
  'transparent/white':  'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(200,215,225,0.6) 100%)',
  'transparent white/transparent lime':   'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(156,204,101,0.65) 100%)',
  'transparent white/transparent pink':   'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(236,64,122,0.6) 100%)',
  'transparent white/transparent violet': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(186,104,200,0.65) 100%)',

  // Dual-tone combinations (split diagonal swatch)
  'black/black':       '#1F1F1F',
  'black/white':       'linear-gradient(135deg, #1F1F1F 50%, #FFFFFF 50%)',
  'black/lime':        'linear-gradient(135deg, #1F1F1F 50%, #9CCC65 50%)',
  'black/fuchsia':     'linear-gradient(135deg, #1F1F1F 50%, #D81B60 50%)',
  'black/red':         'linear-gradient(135deg, #1F1F1F 50%, #E53935 50%)',
  'black/pearl':       'linear-gradient(135deg, #1F1F1F 50%, #E8D49E 50%)',

  'white/white':       '#FFFFFF',
  'white/ash':         'linear-gradient(135deg, #FFFFFF 50%, #A0AAB2 50%)',
  'white/ash sky blue':'linear-gradient(135deg, #FFFFFF 50%, #9BB8C7 50%)',
  'white/pistachio':   'linear-gradient(135deg, #FFFFFF 50%, #94BA87 50%)',
  'white/powder':      'linear-gradient(135deg, #FFFFFF 50%, #D3C5D6 50%)',
  'white/purple':      'linear-gradient(135deg, #FFFFFF 50%, #7E57C2 50%)',
  'white/sabbia':      'linear-gradient(135deg, #FFFFFF 50%, #D8C6A5 50%)',
  'white/taupe':       'linear-gradient(135deg, #FFFFFF 50%, #9E8B76 50%)',
  'white/terracotta':  'linear-gradient(135deg, #FFFFFF 50%, #C55A38 50%)',
};

/** Get swatch CSS style (background color or gradient) */
export function getColorStyle(colorName) {
  if (!colorName) return { backgroundColor: '#CCCCCC' };
  const key = String(colorName).toLowerCase().trim();
  const val = COLOR_HEX[key];
  if (val) {
    if (val.startsWith('linear-gradient') || val.startsWith('rgba')) {
      return { background: val };
    }
    return { backgroundColor: val };
  }
  // Fallback for partial dual colors like "color1/color2"
  if (key.includes('/')) {
    const [c1, c2] = key.split('/').map(s => s.trim());
    const v1 = COLOR_HEX[c1] || '#999999';
    const v2 = COLOR_HEX[c2] || '#DDDDDD';
    return { background: `linear-gradient(135deg, ${v1} 50%, ${v2} 50%)` };
  }
  return { backgroundColor: '#B0BEC5' };
}

export function getColorHex(colorName) {
  const key = String(colorName).toLowerCase().trim();
  const val = COLOR_HEX[key];
  if (val && !val.startsWith('linear-gradient')) return val;
  return '#B0BEC5';
}

/** Truncate text */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/** Group array by key */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

/** Debounce */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
