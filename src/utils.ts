import { Q } from "./data/questions";
import { TS } from "./data/scoringData";
import { MAIN, SORD } from "./data/constants";
import { UserData, ResultsData, ResultItem, Level5, Level3 } from "./types";

export function getT(scale: string, raw: number, gender: 'female' | 'male'): number {
  const key = `${scale}_${gender === 'female' ? 'زن' : 'مرد'}`;
  const lookup = TS[key];

  // SAFETY: a missing norm key must NOT silently return a raw score as if it were a T-score.
  // With the complete TS table this branch should never run; if it does, it signals a data gap.
  if (!lookup) {
    if (typeof console !== 'undefined') {
      console.error(`[NEO] Missing norm table for "${key}". Returning T=50 (neutral) to avoid invalid quadrant placement. Fix scoringData.ts.`);
    }
    return 50; // neutral midpoint — prevents a raw score from masquerading as a T-score
  }

  const sraw = String(raw);
  if (lookup[sraw] !== undefined) return lookup[sraw];

  // clamp to nearest available raw within the table
  let best: number | null = null;
  let minDiff = Infinity;
  for (const k in lookup) {
    const diff = Math.abs(parseInt(k) - raw);
    if (diff < minDiff) { minDiff = diff; best = lookup[k]; }
  }
  return best !== null ? best : 50;
}

export function getLevel5(t: number): Level5 {
  if (t <= 35) return "بسیار پایین";
  if (t <= 44) return "پایین";
  if (t <= 55) return "متوسط";
  if (t <= 64) return "بالا";
  return "بسیار بالا";
}

export function getLevel3(t: number): Level3 {
  if (t <= 44) return "پایین";
  if (t <= 55) return "متوسط";
  return "بالا";
}

export function getDimensionInterpretation(scale: string, level: string): string {
  const isHigh = level === "بالا" || level === "بسیار بالا";
  const isLow = level === "پایین" || level === "بسیار پایین";
  
  switch(scale) {
    case "روان نژندی":
      if (isHigh) return "مستعد تجربه استرس، نگرانی و احساسات منفی هستید و در مواجهه با فشارهای محیطی حساسیت بیشتری نشان می‌دهید.";
      if (isLow) return "فردی آرام، خونسرد و مقاوم در برابر استرس هستید و به ندرت دچار نگرانی‌های شدید می‌شوید.";
      return "در مواجهه با استرس تعادل مناسبی دارید؛ نه بیش از حد حساس هستید و نه کاملاً بی‌تفاوت.";
      
    case "برونگرایی":
      if (isHigh) return "فردی اجتماعی، پرانرژی و قاطع هستید که از حضور در جمع و تعامل با دیگران لذت می‌برید.";
      if (isLow) return "فردی تودار، مستقل و محتاط هستید که به تنهایی یا جمع‌های کوچک و صمیمی تمایل بیشتری دارید.";
      return "رفتاری متعادل در جمع دارید؛ گاهی از حضور در جمع لذت می‌برید و گاهی به تنهایی نیاز دارید.";
      
    case "انعطاف پذیری":
      if (isHigh) return "دارای تخیل قوی، کنجکاوی فکری و تمایل به تجربیات جدید و ایده‌های نوآورانه هستید.";
      if (isLow) return "واقع‌گرا، عمل‌گرا و پایبند به سنت‌ها هستید و روال‌های آشنا و اثبات‌شده را ترجیح می‌دهید.";
      return "بین نوآوری و حفظ سنت‌ها تعادل برقرار می‌کنید و در صورت لزوم پذیرای تغییر هستید.";
      
    case "دلپذیر بودن":
      if (isHigh) return "فردی مهربان، همدل، قابل اعتماد و سازگار هستید که به رفاه دیگران اهمیت زیادی می‌دهید.";
      if (isLow) return "فردی رقابت‌جو، صریح و انتقادپذیر هستید که بیشتر بر روی اهداف خود تمرکز دارید تا رضایت دیگران.";
      return "به طور کلی با دیگران سازگارید، اما در مواقع لزوم می‌توانید روی مواضع و منافع خود پافشاری کنید.";
      
    case "با وجدان بودن":
      if (isHigh) return "فردی منظم، هدف‌گرا، مسئولیت‌پذیر و دارای انضباط شخصی بالایی هستید.";
      if (isLow) return "فردی انعطاف‌پذیر و خودجوش هستید، اما ممکن است در برنامه‌ریزی و پیگیری اهداف بلندمدت دچار مشکل شوید.";
      return "از نظم و مسئولیت‌پذیری کافی برخوردارید و معمولاً به تعهدات خود عمل می‌کنید.";
      
    default:
      return "";
  }
}

export function detectCarelessResponses(answers: (string | null)[]): string[] {
  const warnings: string[] = [];
  
  if (answers.length === 0) return warnings;

  const counts: Record<string, number> = {};
  let neutralCount = 0;
  
  answers.forEach(a => {
    if (a) {
      counts[a] = (counts[a] || 0) + 1;
      if (a === "نظری ندارم") neutralCount++;
    }
  });

  const totalAnswered = answers.filter(a => a !== null).length;
  
  if (totalAnswered > 0) {
    const maxCount = Math.max(...Object.values(counts));
    if (maxCount === totalAnswered && totalAnswered > 20) {
       warnings.push("پاسخ‌های یکسان: به نظر می‌رسد به همه سوالات یک گزینه یکسان پاسخ داده‌اید.");
    } else if (maxCount > totalAnswered * 0.9) {
       warnings.push("الگوی مشکوک: بیش از ۹۰ درصد پاسخ‌های شما یکسان است که ممکن است نشان‌دهنده عدم دقت باشد.");
    }
    
    if (neutralCount > totalAnswered * 0.5) {
       warnings.push("پاسخ‌های خنثی زیاد: انتخاب بیش از حد گزینه «نظری ندارم» می‌تواند اعتبار نتایج آزمون را کاهش دهد.");
    }
  }

  return warnings;
}

export function calculateResults(answers: (string | null)[], user: UserData): ResultsData {
  const results: ResultsData = {};
  const subRaw: Record<string, number> = {};
  const mainRaw: Record<string, number> = {};
  const subParent: Record<string, string> = {};

  Q.forEach((q, i) => {
    const ans = answers[i];
    const score = ans ? (q.scores[ans] || 0) : 0;

    subRaw[q.subscale] = (subRaw[q.subscale] || 0) + score;
    mainRaw[q.scale] = (mainRaw[q.scale] || 0) + score;
    subParent[q.subscale] = q.scale;
  });

  MAIN.forEach(sc => {
    const raw = mainRaw[sc] || 0;
    const t = getT(sc, raw, user.gender);
    results[sc] = {
      type: "main",
      raw,
      t,
      l5: getLevel5(t),
      l3: getLevel3(t)
    };
  });

  Object.entries(subRaw).forEach(([sub, raw]) => {
    const t = getT(sub, raw, user.gender);
    results[sub] = {
      type: "sub",
      raw,
      t,
      l5: getLevel5(t),
      l3: getLevel3(t),
      parent: subParent[sub]
    };
  });

  return results;
}
