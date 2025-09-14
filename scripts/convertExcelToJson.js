// scripts/convertExcelToJson.js
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const dirPath = "./dictionary";
let allData = [];

const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".xls"));

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  allData = allData.concat(data);
  console.log(`${file} -> ${data.length}건 변환 완료!`);
});

fs.writeFileSync("./src/words.json", JSON.stringify(allData, null, 2));
console.log(`총 ${allData.length}건 합쳐서 JSON 변환 완료!`);
