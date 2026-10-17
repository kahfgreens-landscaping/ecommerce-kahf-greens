const sharp = require('sharp');
const path = require('path');

const svg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F4F1EA"/>
  <g transform="translate(250, 220)">
    <!-- Plant foliage -->
    <path d="M150 70 C150 20, 180 0, 150 -50 C120 0, 150 20, 150 70 Z" fill="#6D7865"/>
    <path d="M150 70 C110 30, 70 20, 40 -10 C60 30, 110 50, 150 70 Z" fill="#7A8771"/>
    <path d="M150 70 C190 30, 230 20, 260 -10 C240 30, 190 50, 150 70 Z" fill="#7A8771"/>
    <path d="M150 70 C130 50, 100 60, 70 50 C90 70, 130 70, 150 70 Z" fill="#8A9680"/>
    <path d="M150 70 C170 50, 200 60, 230 50 C210 70, 170 70, 150 70 Z" fill="#8A9680"/>
    
    <!-- Pot Rim -->
    <rect x="30" y="70" width="240" height="26" rx="8" fill="#C4BAA9"/>
    <!-- Pot Body -->
    <path d="M45 96 L70 300 C72 315, 85 325, 100 325 L200 325 C215 325, 228 315, 230 300 L255 96 Z" fill="#D6CEBE"/>
    <path d="M70 300 L100 325 L200 325 L230 300 Z" fill="#B8AE9D" opacity="0.4"/>
  </g>
  <text x="400" y="640" font-family="serif" font-size="22" fill="#8C8F85" text-anchor="middle" letter-spacing="3">KAHF GREENS</text>
  <text x="400" y="670" font-family="sans-serif" font-size="13" fill="#AAAFA3" text-anchor="middle" letter-spacing="2">PHOTO COMING SOON</text>
</svg>
`;

const outFile = path.join(__dirname, '..', 'public', 'images', 'placeholder-pot.jpg');
sharp(Buffer.from(svg))
  .jpeg({ quality: 90 })
  .toFile(outFile)
  .then(() => console.log('Successfully created placeholder-pot.jpg'));
