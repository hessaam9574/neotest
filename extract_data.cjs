const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function extractVar(varName, nextVarName) {
  const startStr = 'const ' + varName + '=';
  const startIdx = html.indexOf(startStr);
  if (startIdx === -1) return null;
  
  let endIdx = -1;
  if (nextVarName) {
    endIdx = html.indexOf('const ' + nextVarName + '=', startIdx);
  } else {
    endIdx = html.indexOf(';', startIdx);
  }
  
  if (endIdx === -1) return null;
  
  let content = html.substring(startIdx + startStr.length, endIdx).trim();
  if (content.endsWith(';')) content = content.slice(0, -1);
  return content;
}

const qData = extractVar('Q', 'TS');
const tsData = extractVar('TS', 'AN');
const anData = extractVar('AN', 'TOTAL');

console.log('Q length:', qData?.length, 'TS length:', tsData?.length, 'AN length:', anData?.length);

fs.writeFileSync('src/data/questions.ts', 'import { QuestionType } from "../types";\nexport const Q: QuestionType[] = ' + qData + ';\n');
fs.writeFileSync('src/data/scoringData.ts', 'export const TS: any = ' + tsData + ';\n');
fs.writeFileSync('src/data/analysisData.ts', 'export const AN: any = ' + anData + ';\n');

console.log('Done.');
