export type Gender = 'female' | 'male';

export type UserData = {
  name: string;
  age: string;
  education: string;
  gender: Gender;
  avatar?: string;
};

export type Answer = "کاملا موافقم" | "موافقم" | "نظری ندارم" | "مخالفم" | "کاملا مخالفم";

export type Level5 = "بسیار پایین" | "پایین" | "متوسط" | "بالا" | "بسیار بالا";
export type Level3 = "پایین" | "متوسط" | "بالا";

export type ResultItem = {
  type: "main" | "sub";
  raw: number;
  t: number;
  l5: Level5;
  l3: Level3;
  parent?: string;
};

export type ResultsData = Record<string, ResultItem>;

export type QuestionType = {
  id: number;
  text: string;
  scale: string;
  subscale: string;
  scores: Record<string, number>;
};
