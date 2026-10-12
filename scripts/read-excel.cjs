/**
 * read-excel.cjs
 * Reads ecommerce.xlsx, dumps all sheets as JSON so we can inspect structure.
 */
const XLSX = require('xlsx');
const path = require('path');
const fs   = require('fs');

const filePath = 'C:\\Users\\sale2\\Downloads\\WEBSITE\\ecommerce.xlsx';
const wb = XLSX.readFile(filePath, { cellDates: true });

console.log('=== SHEETS ===');
console.log(wb.SheetNames);

wb.SheetNames.forEach(name => {
  const ws   = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`\n=== SHEET: ${name} (${data.length} rows) ===`);
  if (data.length > 0) {
    console.log('COLUMNS:', Object.keys(data[0]));
    console.log('FIRST 5 ROWS:');
    data.slice(0, 5).forEach((r, i) => console.log(i, JSON.stringify(r)));
    console.log('...');
    console.log('LAST 3 ROWS:');
    data.slice(-3).forEach((r, i) => console.log(data.length - 3 + i, JSON.stringify(r)));
  }
});
