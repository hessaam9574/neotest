import { getT } from './src/utils';

const tests = [
  { scale: 'روان نژندی', raw: 59, expected: 32 },
  { scale: 'برونگرایی', raw: 134, expected: 62 },
  { scale: 'انعطاف پذیری', raw: 114, expected: 56 },
  { scale: 'دلپذیر بودن', raw: 94, expected: 36 },
  { scale: 'با وجدان بودن', raw: 168, expected: 74 }
];

let allPassed = true;
for (const t of tests) {
  const actual = getT(t.scale, t.raw, 'male');
  console.log(`Scale: ${t.scale}, Raw: ${t.raw} => Actual: ${actual}, Expected: ${t.expected}`);
  if (actual !== t.expected) {
    allPassed = false;
  }
}

console.log("All passed:", allPassed);
