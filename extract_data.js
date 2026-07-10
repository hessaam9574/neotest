const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function extractVar(varName) {
  const regex = new RegExp('const ' + varName + '=(.*?);\\n(const |//)', 's');
  const match = html.match(regex);
  if (match) {
    return match[1];
  }
  // Try fallback without trailing \n
  const regex2 = new RegExp('const ' + varName + '=(.*?);\\r?\\n', 's');
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

const qData = extractVar('Q');
const tsData = extractVar('TS');
const anData = extractVar('AN');

fs.mkdirSync('src/data', { recursive: true });

fs.writeFileSync('src/data/questions.ts', 'import { QuestionType } from "../types";\nexport const Q: QuestionType[] = ' + qData + ';');
fs.writeFileSync('src/data/scoringData.ts', 'export const TS = ' + tsData + ';');
fs.writeFileSync('src/data/analysisData.ts', 'export const AN = ' + anData + ';');

console.log('Extraction complete.');
