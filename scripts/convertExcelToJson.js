// scripts/convertExcelToJson.js
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const dirPath = "../dictionary";      // XLS 파일 있는 경로
const outputDir = "../public/words_jsons"; // JSON 저장 폴더

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".xls") || file.endsWith(".xlsx"));

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const jsonFileName = file.replace(/\.[^/.]+$/, ".json"); // 확장자 .json으로 변경
  const outputPath = path.join(outputDir, jsonFileName);

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`${file} -> ${data.length}건 JSON 변환 완료! (${jsonFileName})`);
});

console.log("모든 XLS 파일 JSON 변환 완료! JSON들은 public/words_jsons 폴더에 저장됨!");
