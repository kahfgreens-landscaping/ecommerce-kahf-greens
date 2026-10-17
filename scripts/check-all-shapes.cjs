const c = require('../src/data/catalog.json');
const imgMap = require('../src/data/imageMap.js').productImageMap;

console.log('--- ALL 50 PRODUCTS ---');
c.products.forEach((p, idx) => {
  const sizes = [...new Set(p.variants.map(v => v.size || v.sizeLabel))].join(', ');
  const firstImg = (imgMap[p.id] || [])[0] || 'none';
  console.log(`${idx + 1}. [${p.id}]`);
  console.log(`   Name: ${p.name}`);
  console.log(`   Category: ${p.category}`);
  console.log(`   Sizes: ${sizes}`);
  console.log(`   Sample Img: ${firstImg}`);
});
