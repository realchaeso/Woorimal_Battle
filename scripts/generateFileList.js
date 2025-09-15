// scripts/generateFileList.js
const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "../public/words_jsons");
const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".json"));

fs.writeFileSync(path.join(dirPath, "file_list.json"), JSON.stringify(files, null, 2));
console.log("file_list.json 생성 완료!", files);
